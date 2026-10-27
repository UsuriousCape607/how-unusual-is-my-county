// End-to-end smoke test against the production build (`npm run build` first).
// Usage: node tests/e2e/smoke.mjs   — starts `vite preview`, drives Chromium, writes screenshots to test-results/.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

// require() also resolves a globally installed Playwright (NODE_PATH); locally: npm i -D playwright && npx playwright install chromium
const { chromium } = createRequire(import.meta.url)("playwright");

const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = "test-results";
mkdirSync(OUT, { recursive: true });

const metrics = JSON.parse(readFileSync("public/data/county_metrics.json", "utf8"));
const peers = JSON.parse(readFileSync("public/data/county_peers.json", "utf8")).peers;
const facilities = JSON.parse(readFileSync("public/data/facilities.json", "utf8"));
const meta = JSON.parse(readFileSync("public/data/metadata.json", "utf8"));
const byGeoid = new Map(metrics.map((m) => [m.geoid, m]));
const zero = metrics.find((m) => m.eligible && m.pipeline_count === 0 && m.geoid.startsWith("0"));
const multi = [...metrics].sort((a, b) => b.pipeline_count - a.pipeline_count || a.geoid.localeCompare(b.geoid))[0];

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok: !!ok, detail });
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail ? " — " + detail : ""}`);
}

// Run Vite directly (not via npx) so server.kill() stops the real server process.
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], { stdio: "pipe" });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error("preview server did not start")), 30000);
  server.stdout.on("data", (d) => { if (String(d).includes(String(PORT))) { clearTimeout(t); resolve(); } });
});

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const external = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("request", (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith("data:")) external.push(r.url()); });

  // Default county loads with calculated results and a shareable URL.
  await page.goto(BASE);
  await page.waitForSelector("#summary-title");
  const def = byGeoid.get(meta.default_geoid);
  check("default county shown", (await page.textContent("#summary-title")).includes(def.county_name));
  check("URL carries default GEOID", page.url().includes(`county=${meta.default_geoid}`));
  const asOf = new Date(`${meta.snapshot_date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  check("data-as-of banner shows snapshot date", (await page.textContent(".freshness")).includes(`Data as of ${asOf}`), asOf);
  const asOfShort = new Date(`${meta.snapshot_date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  check("answer card shows as-of date next to the count", (await page.textContent(".answer .hero-label")).includes(asOfShort));
  check("plain-language verdict shown", (await page.textContent(".verdict")).includes("similar counties"), await page.textContent(".verdict"));
  check("share button present", await page.isVisible("text=Copy link to this county"));
  check("attribution visible", (await page.textContent(".site-footer")).includes("Compute Atlas"));
  check("methodology section present", await page.isVisible("#methodology"));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/desktop-default.png`, fullPage: false });

  // Search: keyboard selection of a multi-record county.
  const input = page.getByRole("combobox");
  await input.fill(multi.county_name.split(" ")[0]);
  await page.waitForSelector('[role="listbox"] [role="option"]');
  const optionTexts = await page.$$eval('[role="option"]', (els) => els.map((e) => e.textContent));
  const idx = optionTexts.findIndex((t) => t.startsWith(`${multi.county_name}, ${multi.state}`));
  for (let i = 0; i < idx; i++) await input.press("ArrowDown");
  await input.press("Enter");
  await page.waitForFunction((n) => document.querySelector("#summary-title")?.textContent.includes(n), multi.county_name);
  check("keyboard search selects county by GEOID", page.url().includes(`county=${multi.geoid}`), `${multi.county_name}, ${multi.state}`);
  // Choosing from search should glide the map to the new county (Santa Clara is near 37.2 N, 121.7 W).
  await page.waitForTimeout(1500);
  const [vlat, vlng] = ((await page.getAttribute(".map", "data-view")) ?? "0,0").split(",").map(Number);
  const target = await page.evaluate(async (g) => {
    const fc = await (await fetch("data/counties.geojson")).json();
    const f = fc.features.find((x) => x.properties.geoid === g);
    const pts = JSON.stringify(f.geometry.coordinates).match(/-?\d+\.?\d*,-?\d+\.?\d*/g).map((s) => s.split(",").map(Number));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return [(Math.min(...ys) + Math.max(...ys)) / 2, (Math.min(...xs) + Math.max(...xs)) / 2];
  }, multi.geoid);
  check("search selection moves the map to the county", Math.abs(vlat - target[0]) < 1 && Math.abs(vlng - target[1]) < 1, `view ${vlat},${vlng} vs county ${target.map((x) => x.toFixed(2))}`);
  const items = await page.$$eval("#records-title ~ .facility-list > li", (els) => els.length);
  check("facility list matches pipeline count", items === multi.pipeline_count, `${items} vs ${multi.pipeline_count}`);
  const hrefs = await page.$$eval("#records-title ~ .facility-list .sources a", (els) => els.map((a) => a.href));
  check("source links are http(s)", hrefs.length > 0 && hrefs.every((h) => /^https?:\/\//.test(h)), `${hrefs.length} links`);
  const dots = await page.$$eval(".chart svg circle[r='4.5']", (els) => els.length);
  check("chart shows 40 peer dots", dots === 40, `${dots}`);
  const summaryNums = await page.$$eval(".compare-labels strong", (els) => els.map((e) => Number(e.textContent)));
  const p = peers[multi.geoid];
  check("summary breakdown matches data", JSON.stringify(summaryNums) === JSON.stringify([p.n_fewer, p.n_equal, p.n_greater]), summaryNums.join("/"));
  const expectedVerdict = p.n_fewer === 40 ? "than all 40 similar counties" : p.n_fewer > 20 ? "than most similar counties" : "";
  check("verdict restates the counts", (await page.textContent(".verdict")).includes(expectedVerdict), expectedVerdict);
  await page.click("text=What is counted as a “site in development”?");
  check("explanations open on demand", await page.isVisible("text=Operating data centers are counted separately"));
  const nMarkers = facilities.filter((f) => f.county_geoid === multi.geoid && f.metric === "pipeline").length;
  const markerCounts = await page.$$eval(".legend > span", (els) => els.filter((e) => /Exact location|Approximate area/.test(e.textContent)).map((e) => Number(e.textContent.match(/\((\d+)\)/)[1])));
  check("map legend counts markers", markerCounts.reduce((a, b) => a + b, 0) === nMarkers, `${markerCounts} vs ${nMarkers}`);
  const cmpLegend = await page.textContent(".legend-group");
  check("map legend shows fewer/same/more counts", cmpLegend.includes(`fewer (${p.n_fewer})`) && cmpLegend.includes(`more (${p.n_greater})`), cmpLegend);
  const dotColors = await page.$$eval(".chart svg circle[r='4.5']", (els) => els.map((e) => e.getAttribute("fill")));
  check("chart dots coloured by fewer/same/more", dotColors.filter((c) => c === "#8944ab").length === p.n_fewer && dotColors.filter((c) => c === "#c96e00").length === p.n_greater);

  // Duplicate county names are distinguished by state.
  await input.fill("washington");
  await page.waitForSelector('[role="option"]');
  const wa = await page.$$eval('[role="option"]', (els) => els.map((e) => e.textContent));
  check("duplicate names listed with states", wa.filter((t) => t.startsWith("Washington County")).length >= 5, `${wa.length} options`);
  await input.press("Escape");
  await input.fill("");

  // Peer table: expand to 40 and select a peer.
  check("peer table starts with 10 rows", (await page.$$eval("#peers-title ~ .table-wrap tbody tr", (r) => r.length)) === 11);
  await page.getByRole("button", { name: /Show all 40 similar counties/ }).click();
  check("peer table expands to 40", (await page.$$eval("#peers-title ~ .table-wrap tbody tr", (r) => r.length)) === 41);
  const firstPeer = byGeoid.get(p.peer_geoids[0]);
  await page.click("#peers-title ~ .table-wrap tbody tr:nth-child(2) button");
  await page.waitForFunction((n) => document.querySelector("#summary-title")?.textContent.includes(n), firstPeer.county_name);
  check("selecting a peer refocuses the app", page.url().includes(`county=${firstPeer.geoid}`));

  // Map click selects the county under the cursor (tooltip name == selected county by GEOID) without moving the camera.
  // Start from an inland county so the probe point is always over land.
  await page.goto(`${BASE}?county=51107`);
  await page.waitForSelector("#summary-title");
  await page.waitForTimeout(1200);
  const box = await page.locator(".map").boundingBox();
  const px = box.x + box.width * 0.12, py = box.y + box.height * 0.5;
  await page.mouse.move(px - 15, py - 15);
  await page.mouse.move(px, py, { steps: 5 });
  await page.waitForTimeout(300);
  const tipName = (await page.textContent(".map-hover strong").catch(() => null)) ?? "";
  check("hover card shows inside the map frame", await page.$eval(".map-hover", (el) => el.classList.contains("on")));
  // The map is drawn on a canvas; its pan offset lives on the map pane and changes whenever the camera moves.
  const viewBefore = await page.getAttribute(".map", "data-view");
  await page.mouse.click(px, py);
  await page.waitForTimeout(1200);
  const g = new URL(page.url()).searchParams.get("county");
  const clicked = byGeoid.get(g);
  check("map click selects matching GEOID", tipName && clicked && tipName === `${clicked.county_name}, ${clicked.state}`, `${tipName} -> ${g}`);
  const viewAfter = await page.getAttribute(".map", "data-view");
  check("map click does not move the camera", viewBefore && viewBefore === viewAfter, `${viewBefore} vs ${viewAfter}`);

  // Desktop wheel/trackpad zoom: continuous (map moves nearly every frame), one redraw at the end, and repeat
  // gestures keep working (a second gesture used to be aborted by Leaflet snapping the fractional zoom).
  await page.mouse.move(box.x + box.width / 2 + 15, box.y + box.height / 2 + 10);
  const wz = async () => Number((await page.getAttribute(".map", "data-view")).split(",")[2]);
  const wz0 = await wz();
  await page.evaluate(() => {
    window.__scales = []; window.__long = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ entryTypes: ["longtask"] });
    const c = document.querySelector(".leaflet-overlay-pane canvas");
    const tick = () => { window.__scales.push(getComputedStyle(c).transform); if (window.__scales.length < 60) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, -12); await page.waitForTimeout(16); }
  await page.waitForTimeout(1000);
  const wz1 = await wz();
  const wheel = await page.evaluate(() => ({ scales: window.__scales, long: window.__long.length }));
  let moved = 0; for (let i = 1; i < wheel.scales.length; i++) if (wheel.scales[i] !== wheel.scales[i - 1]) moved++;
  check("wheel zoom is continuous with at most 2 redraw freezes", wz1 > wz0 + 1 && moved >= 0.8 * (wheel.scales.length - 1) && wheel.long <= 2,
    `zoom ${wz0} -> ${wz1}; map moved in ${moved}/${wheel.scales.length - 1} frames; ${wheel.long} long tasks`);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 12); await page.waitForTimeout(16); }
  await page.waitForTimeout(900);
  const wz2 = await wz();
  check("a second wheel gesture works right after the first", wz2 < wz1 - 0.2, `zoom ${wz1} -> ${wz2}`);
  // The county under the cursor stays under the cursor while zooming.
  const ax = box.x + 70, ay = box.y + box.height * 0.55;
  await page.mouse.move(ax, ay); await page.waitForTimeout(250);
  const under0 = await page.textContent(".map-hover strong").catch(() => "");
  for (let i = 0; i < 15; i++) { await page.mouse.wheel(0, -12); await page.waitForTimeout(16); }
  await page.waitForTimeout(900);
  await page.mouse.move(box.x + box.width + 40, ay); await page.waitForTimeout(150);
  await page.mouse.move(ax, ay); await page.waitForTimeout(250);
  const under1 = await page.textContent(".map-hover strong").catch(() => "");
  check("wheel zoom keeps the point under the cursor fixed", under0 && under0 === under1, `${under0} / ${under1}`);

  // "Similar counties" reframes with a cross-fade (no blank-canvas flight) and ends fully visible.
  const zoomCounty = Number((await page.getAttribute(".map", "data-view")).split(",")[2]);
  await page.getByRole("button", { name: "Similar counties", exact: true }).click();
  await page.waitForTimeout(900);
  const zoomSimilar = Number((await page.getAttribute(".map", "data-view")).split(",")[2]);
  const paneOpacity = await page.$eval(".leaflet-map-pane", (el) => getComputedStyle(el).opacity);
  check("similar-counties view zooms out and settles visible", zoomSimilar < zoomCounty && paneOpacity === "1", `zoom ${zoomCounty} -> ${zoomSimilar}, opacity ${paneOpacity}`);
  await page.screenshot({ path: `${OUT}/desktop-similar.png` });
  await page.getByRole("button", { name: "This county", exact: true }).click();
  await page.waitForTimeout(900);

  // Example chips select counties.
  await page.locator(".examples").getByRole("button", { name: "Harris County, TX" }).click();
  await page.waitForFunction(() => document.querySelector("#summary-title")?.textContent.includes("Harris County"));
  check("example chip selects county", page.url().includes("county=48201"));

  // Zero-count county wording.
  await page.goto(`${BASE}?county=${zero.geoid}`);
  await page.waitForSelector("#summary-title");
  const body = await page.textContent("main");
  check("zero-count wording", body.includes("No qualifying pipeline records were found in this county in the selected dataset snapshot"), `${zero.county_name}, ${zero.state}`);
  check("never claims 'has no proposed data centers'", !/has no proposed data centers/i.test(body));
  check("leading-zero GEOID in URL works", page.url().includes(`county=${zero.geoid}`));

  // Browser back restores the previous county.
  await page.goBack();
  await page.waitForTimeout(300);
  check("back button restores county", new URL(page.url()).searchParams.get("county") !== zero.geoid);

  // Invalid GEOID falls back to the demo county with a notice.
  await page.goto(`${BASE}?county=99999`);
  await page.waitForSelector(".notice");
  check("invalid GEOID handled", page.url().includes(`county=${meta.default_geoid}`));

  check("no external network requests (no API keys, tiles or CDNs)", external.length === 0, external.slice(0, 3).join(", "));
  check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));

  // Mobile layout.
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(`${BASE}?county=${multi.geoid}`);
  await mobile.waitForSelector("#summary-title");
  await mobile.waitForTimeout(600);
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("mobile: no horizontal page overflow", overflow <= 1, `${overflow}px`);
  await mobile.screenshot({ path: `${OUT}/mobile-top.png` });
  await mobile.locator(".map-card").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: `${OUT}/mobile-map.png` });
  await mobile.locator("#chart-title").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: `${OUT}/mobile-chart.png` });

  // Error state when data cannot load.
  const broken = await browser.newPage();
  await broken.route("**/data/county_metrics.json", (r) => r.fulfill({ status: 500, body: "" }));
  await broken.goto(BASE);
  await broken.waitForSelector('[role="alert"]');
  check("load failure shows an error message", (await broken.textContent('[role="alert"]')).includes("could not be loaded"));
} finally {
  await browser.close();
  server.kill();
}

writeFileSync(`${OUT}/e2e-results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
