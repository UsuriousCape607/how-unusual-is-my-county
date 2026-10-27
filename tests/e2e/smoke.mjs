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
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
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
  check("URL carries default GEOID", page.url().includes(`c/${meta.default_geoid}/`));
  const asOf = new Date(`${meta.snapshot_date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  check("data-as-of banner shows snapshot date", (await page.textContent(".freshness")).includes(`Data as of ${asOf}`), asOf);
  const asOfShort = new Date(`${meta.snapshot_date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  check("answer card shows as-of date next to the count", (await page.textContent(".answer .hero-label")).includes(asOfShort));
  check("plain-language verdict shown", (await page.textContent(".verdict")).includes("similar counties"), await page.textContent(".verdict"));
  check("share button present", await page.getByRole("button", { name: "Share" }).isVisible());
  check("attribution visible", (await page.textContent(".site-footer")).includes("Compute Atlas"));
  check("methodology section present", await page.isVisible("#methodology"));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/desktop-default.png`, fullPage: false });

  // What's in the count (2+ records), state context.
  const sb = def.pipeline_by_status;
  check("status breakdown shown for a multi-record county", (await page.textContent(".status-line")).includes(`${sb.under_construction} under construction`), await page.textContent(".status-line"));
  const stc = meta.state_context[def.state];
  check("state context line", (await page.textContent(".state-line")).includes(`In ${stc.state_name}, ${stc.with_pipeline} of ${stc.counties} counties`));

  // Share menu: one button, keyboard-operable, copy link, CSV download, embed code.
  await page.getByRole("button", { name: "Share" }).click();
  check("share menu lists its actions", (await page.$$("[role=menuitem]")).length === 5);
  await page.keyboard.press("Escape");
  check("Escape closes the share menu", (await page.$$("[role=menuitem]")).length === 0);
  await page.getByRole("button", { name: "Share" }).click();
  await page.getByRole("menuitem", { name: "Copy link" }).click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check("copy link gives the county's link-preview URL", clip === `${BASE}c/${meta.default_geoid}/`, clip);
  await page.getByRole("button", { name: "Share" }).click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("menuitem", { name: "Download similar counties (CSV)" }).click()]);
  const csv = readFileSync(await dl.path(), "utf8").replace(/^\ufeff/, "").trim().split(/\r?\n/);
  check("similar-counties CSV has the county and its 40 peers", csv.length === 42 && csv[1].includes(def.county_name), `${csv.length} lines; ${dl.suggestedFilename()}`);
  await page.getByRole("button", { name: "Share" }).click();
  await page.getByRole("menuitem", { name: "Embed on a website…" }).click();
  const code = await page.inputValue(".sheet textarea");
  check("embed dialog gives iframe code", code.startsWith("<iframe") && code.includes("embed=1"), code.slice(0, 80));
  await page.getByRole("button", { name: "Done" }).click();

  // Find a project: counted here / counted elsewhere (with compare) / operating / not counted with reason.
  const find = page.locator("#find-input");
  await find.fill("Spring Valley Technology Park");
  await page.waitForSelector(".find-results li");
  check("find: counted here", (await page.textContent(".find-results li")).includes("Counted here"));
  await find.fill("Aligned IAD-01");
  await page.waitForFunction(() => document.querySelector(".find-results li")?.textContent.includes("Aligned IAD-01"));
  check("find: operating shown as context", (await page.textContent(".find-results li")).includes("Operating"));
  await find.fill("prometheus");
  await page.waitForFunction(() => document.querySelectorAll(".find-results li").length >= 2);
  const promText = await page.textContent(".find-results");
  check("find: excluded project explains why", promText.includes("Not counted") && promText.includes("map location and named county disagree"));
  check("report link points to Compute Atlas", (await page.getAttribute(".find-foot a", "href")) === "https://www.compute-atlas.com/contribute");
  await page.locator(".find-results li", { hasText: "Prometheus Hyperscale Falls Ranch Data Center Campus" }).getByRole("button", { name: /^Compare/ }).click();
  await page.waitForTimeout(500);
  check("find: counted elsewhere switches to that county", page.url().includes("c/56009/"), page.url());

  // Print layout: the summary, without search, map or menus.
  await page.emulateMedia({ media: "print" });
  check("print layout hides search and map, keeps the answer",
    !(await page.isVisible(".search-bar")) && !(await page.isVisible(".area-map")) && (await page.isVisible(".answer")) && (await page.isVisible(".print-only")));
  await page.emulateMedia({ media: "screen" });
  await page.goto(BASE);
  await page.waitForSelector("#summary-title");

  // Search: keyboard selection of a multi-record county.
  const input = page.getByRole("combobox");
  await input.fill(multi.county_name.split(" ")[0]);
  await page.waitForSelector('[role="listbox"] [role="option"]');
  const optionTexts = await page.$$eval('[role="option"]', (els) => els.map((e) => e.textContent));
  const idx = optionTexts.findIndex((t) => t.startsWith(`${multi.county_name}, ${multi.state}`));
  for (let i = 0; i < idx; i++) await input.press("ArrowDown");
  await input.press("Enter");
  await page.waitForFunction((n) => document.querySelector("#summary-title")?.textContent.includes(n), multi.county_name);
  check("keyboard search selects county by GEOID", page.url().includes(`c/${multi.geoid}/`), `${multi.county_name}, ${multi.state}`);
  // Choosing from search should glide the map to the new county (Santa Clara is near 37.2 N, 121.7 W).
  await page.waitForTimeout(1500);
  const [vlat, vlng] = ((await page.getAttribute(".map", "data-view")) ?? "0,0").split(",").map(Number);
  const target = await page.evaluate(async (g) => {
    const fc = await (await fetch("/data/counties.geojson")).json();
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
  check("selecting a peer refocuses the app", page.url().includes(`c/${firstPeer.geoid}/`));

  // Map click selects the county under the cursor (tooltip name == selected county by GEOID) without moving the camera.
  // Start from an inland county so the probe point is always over land.
  await page.goto(`${BASE}?county=51107`);
  await page.waitForSelector("#summary-title");
  check("an older ?county= link turns into the county's page address", page.url() === `${BASE}c/51107/`, page.url());
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
  const g = page.url().match(/\/c\/(\d{5})\/$/)?.[1];
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
  check("example chip selects county", page.url().includes("c/48201/"));

  // Zero-count county wording.
  await page.goto(`${BASE}?county=${zero.geoid}`);
  await page.waitForSelector("#summary-title");
  const body = await page.textContent("main");
  check("zero-count wording", body.includes("No qualifying pipeline records were found in this county in the selected dataset snapshot"), `${zero.county_name}, ${zero.state}`);
  check("never claims 'has no proposed data centers'", !/has no proposed data centers/i.test(body));
  check("leading-zero GEOID in URL works", page.url().includes(`c/${zero.geoid}/`));

  // Browser back restores the previous county (in-app history, no page load).
  await page.locator(".examples").getByRole("button", { name: "Harris County, TX" }).click();
  await page.waitForFunction(() => document.querySelector("#summary-title")?.textContent.includes("Harris County"));
  await page.goBack();
  await page.waitForFunction((n) => document.querySelector("#summary-title")?.textContent.includes(n), zero.county_name, { timeout: 5000 }).catch(() => {});
  check("back button restores county", page.url().endsWith(`c/${zero.geoid}/`) && (await page.textContent("#summary-title")).includes(zero.county_name), page.url());

  // Invalid GEOID falls back to the demo county with a notice.
  await page.goto(`${BASE}?county=99999`);
  await page.waitForSelector(".notice");
  check("invalid GEOID handled", page.url().includes(`c/${meta.default_geoid}/`));

  check("no external network requests (no API keys, tiles or CDNs)", external.length === 0, external.slice(0, 3).join(", "));
  check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));

  // Mobile layout.
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(`${BASE}?county=${multi.geoid}`);
  await mobile.waitForSelector("#summary-title");
  await mobile.waitForTimeout(600);
  // Against the device width: a phone widens the page to fit anything that sticks out, so scrollWidth − innerWidth stays 0.
  const overflow = await mobile.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - 390);
  check("mobile: no horizontal page overflow", overflow <= 1, `${overflow}px`);
  await mobile.screenshot({ path: `${OUT}/mobile-top.png` });
  await mobile.locator(".map-card").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: `${OUT}/mobile-map.png` });
  await mobile.locator("#chart-title").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: `${OUT}/mobile-chart.png` });
  await mobile.getByRole("button", { name: "Share" }).scrollIntoViewIfNeeded();
  await mobile.getByRole("button", { name: "Share" }).tap();
  await mobile.waitForTimeout(400);
  const mb = await mobile.locator(".menu").boundingBox();
  check("mobile: share menu fits on screen", mb && mb.x >= 0 && mb.x + mb.width <= 390, mb && `${Math.round(mb.x)}–${Math.round(mb.x + mb.width)}px`);
  await mobile.screenshot({ path: `${OUT}/mobile-share.png` });

  // Link previews (Discord, Slack, iMessage): crawlers read static tags, so each county has its own small page.
  const home = await (await page.request.get(BASE)).text();
  check("home page has a preview with the data date",
    /og:description" content="[^"]+as of [A-Z][a-z]{2} \d{1,2}, \d{4}\."/.test(home));
  check("favicon is served", (await page.request.get(`${BASE}favicon-32.png`)).ok() && (await page.request.get(`${BASE}favicon.png`)).ok());
  const prev = await (await page.request.get(`${BASE}c/${multi.geoid}/`)).text();
  const tag = (prop) => prev.match(new RegExp(`${prop}" content="([^"]+)"`))?.[1] ?? "";
  check("county page preview names the county and states its result",
    tag("og:title") === `${multi.county_name}, ${multi.state_name}` && /similar counties\. \d+ sites? in development on record as of/.test(tag("og:description"))
    && prev.includes('name="theme-color"') && /^https:\/\//.test(tag("og:image")) && !prev.includes("og:image:alt"), `${tag("og:title")} | ${tag("og:description")}`);
  // Large preview image (X, Facebook, WhatsApp, iMessage, Discord): 1200 x 630 PNG, small enough for WhatsApp.
  const pngInfo = async (path) => {
    const r = await page.request.get(`${BASE}${path}`); const b = await r.body();
    return { ok: r.ok() && b.subarray(1, 4).toString() === "PNG", w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) };
  };
  const img = await pngInfo(`og/${multi.geoid}.png`);
  check("county page has its own large preview image",
    tag("twitter:card") === "summary_large_image" && tag("og:image").endsWith(`/og/${multi.geoid}.png`) && img.ok && img.w === 1200 && img.h === 630 && img.kb < 150,
    `${tag("og:image").split("/").slice(-2).join("/")} ${img.w}x${img.h} ${img.kb} KB`);
  const homeImg = await pngInfo("og/home.png");
  check("home page has a large preview image", /og:image" content="https:\/\/[^"]+\/og\/home\.png"/.test(home) && homeImg.ok && homeImg.w === 1200, `${homeImg.kb} KB`);
  const visitor = await browser.newPage();
  await visitor.goto(`${BASE}c/${multi.geoid}/`);
  await visitor.waitForSelector("#summary-title");
  check("county page is the app itself (no redirect), with the county in the tab title",
    visitor.url() === `${BASE}c/${multi.geoid}/` && (await visitor.title()).startsWith(`${multi.county_name}, ${multi.state}`), visitor.url());
  await visitor.reload();
  check("refreshing a county page keeps the county", (await visitor.waitForSelector("#summary-title").then((h) => h.textContent())).includes(multi.county_name));

  // Embed mode: compact card with credit and a link out; no search or map.
  const emb = await browser.newPage({ viewport: { width: 600, height: 500 } });
  await emb.goto(`${BASE}?county=${multi.geoid}&embed=1`);
  await emb.waitForSelector(".embed .verdict");
  check("embed mode shows the compact answer only",
    !(await emb.$(".search-bar")) && !(await emb.$(".leaflet-container")) && (await emb.textContent(".embed")).includes("Compute Atlas"),
    await emb.textContent(".embed .verdict"));
  const embHref = await emb.getAttribute(".embed-link", "href");
  check("embed links to the county page", embHref === `${BASE}c/${multi.geoid}/`, embHref);
  await emb.screenshot({ path: `${OUT}/embed.png` });

  // A single-record county shows no status line (the record list already says its status).
  const one = metrics.find((m) => m.eligible && m.pipeline_count === 1);
  await page.goto(`${BASE}?county=${one.geoid}`);
  await page.waitForSelector("#summary-title");
  check("no status line for a single-record county", !(await page.$(".status-line")), `${one.county_name}, ${one.state}`);

  // Refresh after a deploy: data requests carry the build ID, so new code never runs on old cached data...
  const fresh = await browser.newPage();
  const dataUrls = [];
  fresh.on("request", (r) => { if (r.url().includes("/data/")) dataUrls.push(r.url()); });
  await fresh.goto(`${BASE}?county=${meta.default_geoid}`);
  await fresh.waitForSelector("#summary-title");
  await fresh.reload();
  await fresh.waitForSelector("#summary-title");
  check("data requests carry the build ID (no stale cache after a deploy)", dataUrls.length > 0 && dataUrls.every((u) => /\?v=\w+/.test(u)), dataUrls[0]);
  // ...and if old-shaped data does arrive, the page still renders (this was a blank page).
  const stale = await browser.newPage();
  await stale.route("**/data/county_metrics.json*", async (r) => {
    const res = await r.fetch(); const j = await res.json(); j.forEach((m) => delete m.pipeline_by_status); r.fulfill({ response: res, json: j });
  });
  await stale.route("**/data/metadata.json*", async (r) => {
    const res = await r.fetch(); const j = await res.json(); delete j.state_context; r.fulfill({ response: res, json: j });
  });
  await stale.goto(`${BASE}?county=${meta.default_geoid}`);
  check("page renders even with data from an older deploy", await stale.waitForSelector("#summary-title", { timeout: 15000 }).then(() => true, () => false));
  // A real render crash shows a recovery message, never a blank page.
  const crash = await browser.newPage();
  await crash.route("**/data/county_peers.json*", async (r) => {
    const res = await r.fetch(); const j = await res.json(); j.peers[meta.default_geoid] = {}; r.fulfill({ response: res, json: j });
  });
  await crash.goto(`${BASE}?county=${meta.default_geoid}`);
  check("a render error shows 'Something went wrong' with Reload", await crash.waitForSelector("text=Something went wrong", { timeout: 15000 }).then(() => true, () => false)
    && await crash.getByRole("button", { name: "Reload" }).isVisible());

  // Error state when data cannot load.
  const broken = await browser.newPage();
  await broken.route("**/data/county_metrics.json*", (r) => r.fulfill({ status: 500, body: "" }));
  await broken.goto(BASE);
  await broken.waitForSelector('[role="alert"]');
  check("load failure shows an error message", (await broken.textContent('[role="alert"]')).includes("could not be loaded"));

  // Languages (own context, so the remembered choice does not leak into the checks above).
  const lctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const lp = await lctx.newPage();
  const langErrors = [];
  lp.on("pageerror", (e) => langErrors.push(e.message));
  await lp.goto(`${BASE}c/${multi.geoid}/`);
  await lp.waitForSelector("#summary-title");
  await lp.getByRole("button", { name: /^Language:/ }).click();
  check("language menu offers 10 languages, English checked",
    (await lp.$$("[role=menuitemradio]")).length === 10 && (await lp.textContent('[aria-checked="true"] .lang-native')) === "English");
  await lp.getByRole("menuitemradio", { name: /日本語/ }).click();
  await lp.waitForFunction(() => document.documentElement.lang === "ja");
  check("choosing Japanese translates the page and records it in the address",
    (await lp.textContent("h1")) === "うちの郡はどれくらい特別？" && lp.url().endsWith(`c/${multi.geoid}/?lang=ja`)
    && (await lp.textContent(".verdict")).includes("郡") && (await lp.textContent(".freshness-pill")).includes("時点"), lp.url());
  check("methodology stays English, marked as such", (await lp.getAttribute("#methodology", "lang")) === "en" && (await lp.textContent("#methodology .lang-note")).includes("英語"));
  await lp.fill(".search input", "Harris County, TX");
  await lp.waitForSelector(".search-results li[role=option]");
  await lp.keyboard.press("Enter");
  await lp.waitForFunction(() => document.querySelector("#summary-title")?.textContent.includes("Harris"));
  check("county search still takes English names in Japanese", lp.url().endsWith("c/48201/?lang=ja"), lp.url());
  await lp.getByRole("button", { name: "共有" }).click();
  await lp.getByRole("menuitem", { name: "リンクをコピー" }).click();
  await lp.waitForTimeout(200);
  check("a copied link opens in the same language", (await lp.evaluate(() => navigator.clipboard.readText())) === `${BASE}c/48201/?lang=ja`);
  const lp2 = await lctx.newPage();
  await lp2.goto(`${BASE}c/51107/`);
  await lp2.waitForFunction(() => document.documentElement.lang === "ja");
  check("the choice is remembered on the next visit", (await lp2.textContent("h1")) === "うちの郡はどれくらい特別？" && lp2.url().includes("lang=ja"));
  await lp2.getByRole("button", { name: /^言語/ }).click();
  await lp2.getByRole("menuitemradio", { name: /^English/ }).click();
  await lp2.waitForFunction(() => document.documentElement.lang === "en");
  check("switching back to English removes ?lang=", (await lp2.textContent("h1")) === "How Unusual Is My County?" && !lp2.url().includes("lang="), lp2.url());
  check("no page errors while switching languages", langErrors.length === 0, langErrors.join(" | "));

  const kctx = await browser.newContext({ locale: "ko-KR" });
  const kp = await kctx.newPage();
  await kp.goto(`${BASE}c/51107/`);
  await kp.waitForSelector("#summary-title");
  check("a Korean browser gets Korean (Hangul) by default", (await kp.evaluate(() => document.documentElement.lang)) === "ko" && (await kp.textContent("h1")).includes("카운티"));

  const emES = await browser.newPage({ viewport: { width: 600, height: 500 } });
  await emES.goto(`${BASE}?county=${multi.geoid}&embed=1&lang=es`);
  await emES.waitForSelector(".embed .verdict");
  check("embeds follow ?lang=", (await emES.textContent(".embed-link")) === "Ver la comparación completa" && (await emES.getAttribute(".embed-link", "href")).includes("lang=es"));

  // Phone: the menu is a bottom sheet that fits the screen, can be swiped away, and every language fits 390 px.
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(`${BASE}c/${multi.geoid}/`);
  await mp.waitForSelector("#summary-title");
  await mp.getByRole("button", { name: /^Language:/ }).tap();
  await mp.waitForTimeout(500);
  const sheet = await mp.locator(".lang-panel").boundingBox();
  check("phone: language menu is a bottom sheet across the screen",
    (await mp.evaluate(() => document.querySelector(".lang-panel").matches(":modal"))) && sheet.x === 0 && Math.round(sheet.width) === 390 && Math.round(sheet.y + sheet.height) === 844,
    `${Math.round(sheet.x)},${Math.round(sheet.y)} ${Math.round(sheet.width)}x${Math.round(sheet.height)}`);
  const rows = await mp.$$eval("[role=menuitemradio]", (els) => els.map((e) => e.getBoundingClientRect().height));
  check("phone: language rows are easy to tap (≥ 48 px)", rows.every((h) => h >= 48), rows.map(Math.round).join(","));
  await mp.screenshot({ path: `${OUT}/mobile-language.png` });
  const head = await mp.locator(".lang-head").boundingBox();
  await mp.mouse.move(head.x + head.width / 2 - 60, head.y + 20);
  await mp.mouse.down();
  for (let i = 1; i <= 8; i++) await mp.mouse.move(head.x + head.width / 2 - 60, head.y + 20 + i * 40);
  await mp.mouse.up();
  await mp.waitForTimeout(500);
  check("phone: swiping the sheet down closes it", !(await mp.evaluate(() => document.querySelector(".lang-panel").open)));
  await mp.getByRole("button", { name: /^Language:/ }).tap();
  await mp.waitForTimeout(450);
  await mp.getByRole("menuitemradio", { name: /Polski/ }).tap();
  await mp.waitForFunction(() => document.documentElement.lang === "pl");
  const sheetClosed = await mp.waitForFunction(() => !document.querySelector(".lang-panel").open, null, { timeout: 2000 }).then(() => true, () => false);
  check("phone: choosing a language slides the sheet away and applies it", sheetClosed && (await mp.textContent("h1")).includes("hrabstwo"));
  // Every language at 390 px, also with a wide fallback font (Linux CI renders system-ui as DejaVu Sans, which is wider).
  const overflow390 = [];
  const wide = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await wide.addInitScript(() => document.addEventListener("DOMContentLoaded", () => {
    const s = document.createElement("style");
    s.textContent = '* { font-family: "DejaVu Sans", sans-serif !important; }';
    document.head.append(s);
  }));
  for (const [ctxName, c] of [["system", mctx], ["wide font", wide]]) {
    const wp = await c.newPage();
    for (const l of ["en", "es", "ko", "ko-Kore", "zh-TW", "zh-CN", "ja", "hu", "pl", "sv"]) {
      await wp.goto(`${BASE}c/${multi.geoid}/?lang=${l}`);
      await wp.waitForFunction((x) => document.documentElement.lang.startsWith(x.slice(0, 2)) && document.querySelector("#summary-title"), l);
      await wp.waitForTimeout(250);
      const o = await wp.evaluate(() => Math.max(document.documentElement.scrollWidth, innerWidth) - 390);
      if (o > 0) overflow390.push(`${ctxName}/${l}:+${o}px`);
    }
    await wp.close();
  }
  check("phone: no language overflows 390 px (system and wide fonts)", overflow390.length === 0, overflow390.join(" "));
} finally {
  await browser.close();
  server.kill();
}

writeFileSync(`${OUT}/e2e-results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
