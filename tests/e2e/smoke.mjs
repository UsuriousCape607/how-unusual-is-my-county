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
  check("summary card shows as-of date", (await page.textContent(".summary .eyebrow")).includes(asOf));
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
  const items = await page.$$eval("#records-title ~ .facility-list > li", (els) => els.length);
  check("facility list matches pipeline count", items === multi.pipeline_count, `${items} vs ${multi.pipeline_count}`);
  const hrefs = await page.$$eval("#records-title ~ .facility-list .sources a", (els) => els.map((a) => a.href));
  check("source links are http(s)", hrefs.length > 0 && hrefs.every((h) => /^https?:\/\//.test(h)), `${hrefs.length} links`);
  const dots = await page.$$eval(".chart svg circle[fill='#2b8a8c']", (els) => els.length);
  check("chart shows 40 peer dots", dots === 40, `${dots}`);
  const summaryNums = await page.$$eval(".breakdown strong", (els) => els.map((e) => Number(e.textContent)));
  const p = peers[multi.geoid];
  check("summary breakdown matches data", JSON.stringify(summaryNums) === JSON.stringify([p.n_fewer, p.n_equal, p.n_greater]), summaryNums.join("/"));
  const nMarkers = facilities.filter((f) => f.county_geoid === multi.geoid && f.metric === "pipeline").length;
  check("map legend counts markers", (await page.textContent(".legend")).match(/\((\d+)\)/g)?.map((s) => Number(s.slice(1, -1))).reduce((a, b) => a + b, 0) === nMarkers);

  // Duplicate county names are distinguished by state.
  await input.fill("washington");
  await page.waitForSelector('[role="option"]');
  const wa = await page.$$eval('[role="option"]', (els) => els.map((e) => e.textContent));
  check("duplicate names listed with states", wa.filter((t) => t.startsWith("Washington County")).length >= 5, `${wa.length} options`);
  await input.press("Escape");
  await input.fill("");

  // Peer table: expand to 40 and select a peer.
  check("peer table starts with 10 rows", (await page.$$eval("#peers-title ~ .table-wrap tbody tr", (r) => r.length)) === 11);
  await page.getByRole("button", { name: /Show all 40 peers/ }).click();
  check("peer table expands to 40", (await page.$$eval("#peers-title ~ .table-wrap tbody tr", (r) => r.length)) === 41);
  const firstPeer = byGeoid.get(p.peer_geoids[0]);
  await page.click("#peers-title ~ .table-wrap tbody tr:nth-child(2) button");
  await page.waitForFunction((n) => document.querySelector("#summary-title")?.textContent.includes(n), firstPeer.county_name);
  check("selecting a peer refocuses the app", page.url().includes(`county=${firstPeer.geoid}`));

  // Map click selects the county under the cursor (tooltip name == selected county by GEOID).
  await page.getByRole("button", { name: "Zoom to county" }).click();
  await page.waitForTimeout(700);
  const box = await page.locator(".map").boundingBox();
  const px = box.x + box.width * 0.12, py = box.y + box.height * 0.5;
  await page.mouse.move(px - 15, py - 15);
  await page.mouse.move(px, py, { steps: 5 });
  await page.waitForTimeout(300);
  const tipName = (await page.textContent(".leaflet-tooltip strong").catch(() => null)) ?? "";
  await page.mouse.click(px, py);
  await page.waitForTimeout(500);
  const g = new URL(page.url()).searchParams.get("county");
  const clicked = byGeoid.get(g);
  check("map click selects matching GEOID", tipName && clicked && tipName === `${clicked.county_name}, ${clicked.state}`, `${tipName} -> ${g}`);

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
