import type { Plugin } from "vite";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import sharp from "sharp";
import { verdict } from "../src/lib/summary";
import { fmtDateShort, plural } from "../src/lib/format";
import type { CountyMetric, Metadata, PeersFile } from "../src/types";

// Public address of the deployed site (link previews need absolute URLs). Override with SITE_URL for another host.
const SITE_URL = (process.env.SITE_URL ?? "https://usuriouscape607.github.io/how-unusual-is-my-county/").replace(/\/?$/, "/");
const SITE_NAME = "How Unusual Is My County?";
const ROOT = process.cwd();
const DIST = resolve(ROOT, "dist");
const CACHE = resolve(ROOT, ".cache/share-images"); // rendered images keyed by content, reused between builds
const W = 1200, H = 630;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const readData = <T,>(f: string): T => JSON.parse(readFileSync(resolve(ROOT, "public/data", f), "utf8"));
const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 24);

interface Page { pageTitle: string; title: string; description: string; path: string; image?: string }

/**
 * <title>, description and the Open Graph / X card tags that Discord, X, Facebook, WhatsApp, iMessage, Slack and
 * LinkedIn read for link previews. With a rendered image they show it large; otherwise the icon as a thumbnail.
 */
function previewTags(p: Page): string {
  const url = SITE_URL + p.path;
  const image = p.image
    ? `<meta property="og:image" content="${SITE_URL}${p.image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${W}" />
    <meta property="og:image:height" content="${H}" />
    <meta name="twitter:card" content="summary_large_image" />`
    : `<meta property="og:image" content="${SITE_URL}favicon.png" />
    <meta property="og:image:width" content="256" />
    <meta property="og:image:height" content="256" />
    <meta name="twitter:card" content="summary" />`;
  return `<!--preview-->
    <title>${esc(p.pageTitle)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    ${image}
    <meta name="theme-color" content="#0071e3" />
    <link rel="canonical" href="${url}" />
    <!--/preview-->`;
}

function homePage(date: string, image?: string): Page {
  return {
    pageTitle: SITE_NAME,
    title: "Is your county unusual for data-center development?",
    description: `Compare any U.S. county with the 40 counties most like it in population and density, using Compute Atlas records as of ${date}.`,
    path: "",
    image,
  };
}

interface Card { geoid: string; name: string; verdict: string; n: number; date: string; fewer: number; equal: number; greater: number }

/** The template with the Inter font (latin subsets), the site icon and the site's host name filled in. */
export function cardTemplate(): string {
  const fontDir = resolve(ROOT, "node_modules/@fontsource-variable/inter");
  const fontCss = readFileSync(resolve(fontDir, "opsz.css"), "utf8")
    .split(/(?=\/\* inter-)/)
    .filter((block) => /inter-latin(-ext)?-opsz-normal/.test(block))
    .map((block) => block.replace(/url\(\.\/files\/([^)]+)\)/, (_, f) => `url(data:font/woff2;base64,${readFileSync(resolve(fontDir, "files", f)).toString("base64")})`))
    .join("\n");
  const icon = `data:image/png;base64,${readFileSync(resolve(ROOT, "public/favicon.png")).toString("base64")}`;
  return readFileSync(resolve(ROOT, "previews/card.html"), "utf8")
    .replace("/*FONT_CSS*/", fontCss)
    .replaceAll("ICON_URL", icon)
    .replaceAll("SITE_HOST", esc(SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")));
}

/**
 * Renders the 1200 x 630 preview images into dist/og/ with headless Chromium (Playwright). Images whose inputs have not
 * changed are copied from the cache instead. Returns false when no browser is available outside CI, so the build
 * falls back to the small icon card; in CI that is an error.
 */
async function renderImages(cards: Card[], date: string): Promise<boolean> {
  const t0 = Date.now();
  const template = cardTemplate();
  const version = sha(template);
  // County cards are flat colour and text, so a 128-colour palette keeps them crisp at ~35 KB (vs ~90 KB).
  type Job = { file: string; key: string; palette: boolean; run: (page: any) => Promise<void> };
  const jobs: Job[] = [
    { file: "home.png", key: sha(`${version}|home|${date}`), palette: false, run: (page) => page.evaluate((h: object) => (window as any).renderHome(h), { date }) },
    ...cards.map((c) => ({
      file: `${c.geoid}.png`,
      key: sha(`${version}|${JSON.stringify(c)}`),
      palette: true,
      run: (page: any) => page.evaluate((card: Card) => (window as any).renderCounty(card), c),
    })),
  ];
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(resolve(DIST, "og"), { recursive: true });
  const todo = jobs.filter((j) => !existsSync(resolve(CACHE, `${j.key}.png`)));

  if (todo.length) {
    let chromium: any;
    try {
      chromium = createRequire(resolve(ROOT, "package.json"))("playwright").chromium;
    } catch {
      chromium = null;
    }
    const browser = chromium && (await chromium.launch().catch(() => null));
    if (!browser) {
      const msg = "share-images: Playwright/Chromium not available, so link previews use the small icon card";
      if (process.env.CI) throw new Error(msg);
      console.warn(msg);
      return false;
    }
    try {
      const geo = readData<object>("counties.geojson");
      const queue = [...todo];
      await Promise.all(Array.from({ length: 4 }, async () => {
        const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
        await page.setContent(template);
        await page.evaluate((fc: object) => (window as any).setGeo(fc), geo);
        for (let job = queue.shift(); job; job = queue.shift()) {
          await job.run(page);
          const png = sharp(await page.screenshot({ type: "png" }));
          const opts = { compressionLevel: 9, effort: 10 };
          await (job.palette ? png.png({ ...opts, palette: true, colours: 128, dither: 0 }) : png.png(opts)).toFile(resolve(CACHE, `${job.key}.png`));
        }
        await page.close();
      }));
    } finally {
      await browser.close();
    }
  }

  const used = new Set(jobs.map((j) => `${j.key}.png`));
  for (const j of jobs) copyFileSync(resolve(CACHE, `${j.key}.png`), resolve(DIST, "og", j.file));
  for (const f of readdirSync(CACHE)) if (!used.has(f)) rmSync(resolve(CACHE, f)); // keep the cache to this build
  console.log(`share-images: rendered ${todo.length}, reused ${jobs.length - todo.length} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  return true;
}

/** Fills the generic preview into index.html (the small icon card; the build swaps in the large image once rendered). */
export function sitePreview(): Plugin {
  return {
    name: "site-preview",
    transformIndexHtml: (html) =>
      html.replace("<!--preview-->", previewTags(homePage(fmtDateShort(readData<Metadata>("metadata.json").snapshot_date)))),
  };
}

/**
 * Link-preview crawlers read <meta> tags without running JavaScript, and a static host serves the same page for every
 * ?county= value. So after each build this writes the app once more per county at c/<GEOID>/ with that county's
 * result in its tags (wording from the same verdict() the app shows) and its own preview image at og/<GEOID>.png.
 * The app puts these addresses in the address bar, so a copied link previews properly wherever it is pasted.
 */
export function countyPages(): Plugin {
  return {
    name: "county-pages",
    apply: "build",
    async closeBundle() {
      const metrics = readData<CountyMetric[]>("county_metrics.json");
      const peers = readData<PeersFile>("county_peers.json").peers;
      const date = fmtDateShort(readData<Metadata>("metadata.json").snapshot_date);
      const counties = metrics.filter((c) => peers[c.geoid]);
      const cards: Card[] = counties.map((c) => {
        const p = peers[c.geoid];
        return { geoid: c.geoid, name: c.county_name === c.state_name ? c.county_name : `${c.county_name}, ${c.state_name}`, verdict: verdict(c, p).headline, n: c.pipeline_count, date, fewer: p.n_fewer, equal: p.n_equal, greater: p.n_greater };
      });
      const images = await renderImages(cards, date);

      const index = readFileSync(resolve(DIST, "index.html"), "utf8");
      const block = /<!--preview-->[\s\S]*?<!--\/preview-->/;
      writeFileSync(resolve(DIST, "index.html"), index.replace(block, previewTags(homePage(date, images ? "og/home.png" : undefined))));
      const shell = index.replace(/(href|src)="\.\//g, '$1="../../'); // county pages sit two folders below the root
      for (const [i, c] of counties.entries()) {
        const card = cards[i];
        const tags = previewTags({
          pageTitle: `${c.county_name}, ${c.state} · ${SITE_NAME}`,
          title: card.name,
          description:
            `${card.verdict}. ${card.n} ${plural(card.n, "site", "sites")} in development on record as of ${date}. ` +
            `Of the 40 counties most like it in population and density, ${card.fewer} have fewer, ${card.equal} the same and ${card.greater} more.`,
          path: `c/${c.geoid}/`,
          image: images ? `og/${c.geoid}.png` : undefined,
        });
        const dir = resolve(DIST, "c", c.geoid);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), shell.replace(block, tags));
      }
      console.log(`county-pages: wrote ${counties.length} county pages`);
    },
  };
}
