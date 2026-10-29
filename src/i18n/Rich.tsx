import { Fragment, type ReactNode } from "react";

const TAGS = /(<(?:b|a|code)>.*?<\/(?:b|a|code)>|<list\/>)/;

/**
 * Renders interface text containing <b>…</b>, <code>…</code>, <a>…</a> and a <list/> slot. The pieces become React
 * elements (never raw HTML), so names inside the text are always shown as plain text.
 */
export function Rich({ text, a, list }: { text: string; a?: (label: string) => ReactNode; list?: ReactNode }) {
  return (
    <>
      {text.split(TAGS).map((part, i) => {
        if (!part) return null;
        if (part === "<list/>") return <Fragment key={i}>{list}</Fragment>;
        const m = part.match(/^<(b|a|code)>(.*?)<\/\1>$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const [, tag, inner] = m;
        const el = tag === "b" ? <strong>{inner}</strong> : tag === "code" ? <code>{inner}</code> : (a?.(inner) ?? inner);
        return <Fragment key={i}>{el}</Fragment>;
      })}
    </>
  );
}

/** The same text without markup, for labels and tooltips. */
export function plain(text: string): string {
  return text.replace(/<\/?(?:b|a|code)>|<list\/>/g, "");
}

/** Marks each URL in a data string (a source credit, a citation) as <a>…</a>, so Rich renders it as a link to itself. */
export function linkUrls(text: string): string {
  return text.replace(/https?:\/\/[^\s)]+/g, (url) => `<a>${url}</a>`);
}
