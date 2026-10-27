import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { verdict } from "./src/lib/summary";
import { fmtDateShort, plural } from "./src/lib/format";
import type { CountyMetric, Metadata, PeersFile } from "./src/types";

// Public address of the deployed site (link previews need absolute URLs). Override with SITE_URL for another host.
const SITE_URL = (process.env.SITE_URL ?? "https://usuriouscape607.github.io/how-unusual-is-my-county/").replace(/\/?$/, "/");

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Link previews for Discord, Slack, iMessage and social sites. Their crawlers read <meta> tags without running
 * JavaScript, so the single-page app can only offer a generic preview. After each build this writes a tiny page per
 * county at c/<GEOID>/ whose tags state that county's result (wording from the same verdict() the app uses), then
 * forwards visitors to the app. "Copy link" hands out these URLs.
 */
function linkPreviews(): Plugin {
  return {
    name: "link-previews",
    apply: "build",
    transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", SITE_URL),
    closeBundle() {
      const read = <T,>(f: string): T => JSON.parse(readFileSync(resolve(process.cwd(), "public/data", f), "utf8"));
      const metrics = read<CountyMetric[]>("county_metrics.json");
      const peers = read<PeersFile>("county_peers.json").peers;
      const meta = read<Metadata>("metadata.json");
      const date = fmtDateShort(meta.snapshot_date);
      let written = 0;
      for (const c of metrics) {
        const p = peers[c.geoid];
        if (!p) continue;
        const v = verdict(c, p).headline;
        const n = c.pipeline_count;
        const title = `${c.county_name}, ${c.state_name}: ${v.charAt(0).toLowerCase()}${v.slice(1)}`;
        const desc =
          `${n} data-center ${plural(n, "site", "sites")} in development on record as of ${date}. ` +
          `Of its 40 most similar counties by population and density, ${p.n_fewer} have fewer, ${p.n_equal} the same and ${p.n_greater} more.`;
        const app = `../../?county=${c.geoid}`;
        const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(`${c.county_name}, ${c.state} · How Unusual Is My County?`)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="How Unusual Is My County?">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE_URL}c/${c.geoid}/">
<meta property="og:image" content="${SITE_URL}favicon.png">
<meta property="og:image:width" content="256"><meta property="og:image:height" content="256">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0071e3">
<link rel="canonical" href="${SITE_URL}?county=${c.geoid}">
<link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32.png">
<script>location.replace(${JSON.stringify(app)} + location.hash)</script>
</head><body style="font-family:system-ui,-apple-system,sans-serif;padding:24px">
<p><a href="${app}">Open the comparison for ${esc(`${c.county_name}, ${c.state}`)}</a></p>
</body></html>
`;
        const dir = resolve(process.cwd(), "dist/c", c.geoid);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), html);
        written++;
      }
      console.log(`link-previews: wrote ${written} county preview pages`);
    },
  };
}

// Relative base so the built site works from any static host path.
export default defineConfig({
  base: "./",
  // A new ID per build. Data files keep fixed names, so requests carry ?v=<id> to stop browsers pairing new code
  // with data cached from an earlier deploy (GitHub Pages lets browsers reuse files for 10 minutes).
  define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
  plugins: [react(), linkPreviews()],
  test: { include: ["src/**/*.test.ts"] },
});
