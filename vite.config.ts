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
const SITE_NAME = "How Unusual Is My County?";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const readData = <T,>(f: string): T => JSON.parse(readFileSync(resolve(process.cwd(), "public/data", f), "utf8"));

/** <title>, description and the Open Graph tags that Discord, Slack, iMessage and social sites read for link previews. */
function previewTags(p: { pageTitle: string; title: string; description: string; path: string }): string {
  const url = SITE_URL + p.path;
  return `<!--preview-->
    <title>${esc(p.pageTitle)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}favicon.png" />
    <meta property="og:image:width" content="256" />
    <meta property="og:image:height" content="256" />
    <meta name="twitter:card" content="summary" />
    <meta name="theme-color" content="#0071e3" />
    <link rel="canonical" href="${url}" />
    <!--/preview-->`;
}

/** Generic preview for the home page. */
function sitePreview(): Plugin {
  return {
    name: "site-preview",
    transformIndexHtml: (html) => {
      const date = fmtDateShort(readData<Metadata>("metadata.json").snapshot_date);
      return html.replace("<!--preview-->", previewTags({
        pageTitle: SITE_NAME,
        title: "Is your county unusual for data-center development?",
        description: `Compare any U.S. county with the 40 counties most like it in population and density, using Compute Atlas records as of ${date}.`,
        path: "",
      }));
    },
  };
}

/**
 * Link-preview crawlers read <meta> tags without running JavaScript, and a static host serves the same page for every
 * ?county= value. So after each build this writes the app once more per county at c/<GEOID>/ with that county's
 * result in its tags (wording from the same verdict() the app shows). The app puts these addresses in the address
 * bar, so a copied link previews properly wherever it is pasted.
 */
function countyPages(): Plugin {
  return {
    name: "county-pages",
    apply: "build",
    closeBundle() {
      const shell = readFileSync(resolve(process.cwd(), "dist/index.html"), "utf8")
        .replace(/(href|src)="\.\//g, '$1="../../'); // two folders down from the site root
      const metrics = readData<CountyMetric[]>("county_metrics.json");
      const peers = readData<PeersFile>("county_peers.json").peers;
      const date = fmtDateShort(readData<Metadata>("metadata.json").snapshot_date);
      let written = 0;
      for (const c of metrics) {
        const p = peers[c.geoid];
        if (!p) continue;
        const n = c.pipeline_count;
        const tags = previewTags({
          pageTitle: `${c.county_name}, ${c.state} · ${SITE_NAME}`,
          title: `${c.county_name}, ${c.state_name}`,
          description:
            `${verdict(c, p).headline}. ${n} ${plural(n, "site", "sites")} in development on record as of ${date}. ` +
            `Of the 40 counties most like it in population and density, ${p.n_fewer} have fewer, ${p.n_equal} the same and ${p.n_greater} more.`,
          path: `c/${c.geoid}/`,
        });
        const dir = resolve(process.cwd(), "dist/c", c.geoid);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), shell.replace(/<!--preview-->[\s\S]*?<!--\/preview-->/, tags));
        written++;
      }
      console.log(`county-pages: wrote ${written} county pages`);
    },
  };
}

// Relative base so the built site works from any static host path.
export default defineConfig({
  base: "./",
  // A new ID per build. Data files keep fixed names, so requests carry ?v=<id> to stop browsers pairing new code
  // with data cached from an earlier deploy (GitHub Pages lets browsers reuse files for 10 minutes).
  define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
  plugins: [react(), sitePreview(), countyPages()],
  test: { include: ["src/**/*.test.ts"] },
});
