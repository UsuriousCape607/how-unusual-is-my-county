import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { LANGUAGE, LANGUAGES, type Lang } from "../i18n/languages";

const PHONE = "(max-width: 520px)";
// iOS sheet curve: quick start, long gentle settle, no overshoot (a sheet that just appeared should not bounce).
const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Apple's momentum projection (Designing Fluid Interfaces): where a flick at `v` px/s would come to rest. */
const project = (v: number, rate = 0.998) => ((v / 1000) * rate) / (1 - rate);
/** Past the top edge the sheet follows the finger less and less instead of stopping dead. */
const rubberband = (over: number, size: number) => (over * size * 0.55) / (size + 0.55 * Math.abs(over));
/** Folded for type-to-select: "Türkçe" and "turk" match, as do "Diné" and "dine". */
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Language menu. A popover anchored to its button on wider screens; on phones a bottom sheet that can be swiped down,
 * tapped outside, or closed with Done or Escape. Choosing a language applies it at once.
 */
export default function LanguagePicker() {
  const { lang, m, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const drag = useRef<{ start: number; dy: number; samples: { y: number; t: number }[] } | null>(null);
  const titleId = useId();
  const current = LANGUAGE[lang];

  const isSheet = () => panel.current?.matches(":modal") ?? false;

  const show = () => {
    const d = panel.current;
    if (!d || d.open) return;
    if (window.matchMedia(PHONE).matches) d.showModal();
    else d.show();
    setOpen(true);
  };

  /** Close along the path it came in on: the sheet slides down from wherever it is now (it may be mid-swipe). */
  const close = (refocus = true) => {
    const d = panel.current;
    if (!d?.open) return;
    const finish = () => {
      d.close();
      d.classList.remove("closing");
      d.style.transform = "";
      setOpen(false);
      if (refocus) button.current?.focus();
    };
    if (!isSheet() || reducedMotion()) return finish();
    d.classList.add("closing");
    const from = getComputedStyle(d).transform;
    const anim = d.animate([{ transform: from === "none" ? "translateY(0)" : from }, { transform: "translateY(100%)" }], {
      duration: 280,
      easing: SHEET_EASE,
      fill: "forwards",
    });
    anim.finished.then(() => {
      finish();
      anim.cancel();
    }, finish);
  };

  /** Soft fades only at the edges that have more to scroll to. */
  const updateFades = () => {
    const l = list.current;
    if (!l) return;
    l.classList.toggle("fade-top", l.scrollTop > 1);
    l.classList.toggle("fade-bottom", l.scrollTop + l.clientHeight < l.scrollHeight - 1);
  };

  // Open on the current language, centred in the list (without scrolling the page); a tap outside the popover closes it.
  useEffect(() => {
    if (!open) return;
    const l = list.current;
    const item = panel.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');
    if (l && item) l.scrollTop = item.offsetTop - (l.clientHeight - item.offsetHeight) / 2;
    item?.focus({ preventScroll: true });
    updateFades();
    const onDown = (e: PointerEvent) => {
      if (!isSheet() && !wrap.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (l: Lang) => {
    if (l !== lang) setLang(l);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") items[(i + 1) % items.length]?.focus();
    else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length]?.focus();
    else if (e.key === "Home") items[0]?.focus();
    else if (e.key === "End") items[items.length - 1]?.focus();
    else if (e.key === "Escape") close();
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key !== " " || typed.current.text)) typeToSelect(e.key, items, i);
    else return;
    e.preventDefault();
  };

  /** Type-to-select, as in native menus: typing the start of a language's own or English name moves to it. */
  const typeToSelect = (key: string, items: HTMLButtonElement[], i: number) => {
    const t = typed.current;
    t.text = (Date.now() - t.at < 800 ? t.text : "") + fold(key);
    t.at = Date.now();
    // Repeating one letter steps through the languages that start with it.
    const repeat = t.text.length > 1 && [...t.text].every((c) => c === t.text[0]);
    const query = repeat ? t.text[0] : t.text;
    const order = repeat || t.text.length === 1 ? [...items.slice(i + 1), ...items.slice(0, i + 1)] : [...items.slice(Math.max(i, 0)), ...items.slice(0, Math.max(i, 0))];
    order.find((b) => (b.dataset.names ?? "").split("|").some((n) => n.startsWith(query)))?.focus();
  };

  // Swipe-to-dismiss on the sheet's top bar: 1:1 tracking, then the release velocity decides close or snap back.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isSheet() || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { start: e.clientY, dy: 0, samples: [{ y: e.clientY, t: e.timeStamp }] };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = drag.current;
    const d = panel.current;
    if (!g || !d) return;
    const raw = e.clientY - g.start;
    g.dy = raw >= 0 ? raw : rubberband(raw, d.offsetHeight);
    g.samples = [...g.samples.filter((s) => e.timeStamp - s.t < 100), { y: e.clientY, t: e.timeStamp }];
    d.style.transform = `translateY(${g.dy}px)`;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const g = drag.current;
    const d = panel.current;
    drag.current = null;
    if (!g || !d) return;
    const first = g.samples[0];
    const dt = Math.max(e.timeStamp - first.t, 1);
    const velocity = ((e.clientY - first.y) / dt) * 1000; // px/s, positive = downward
    const resting = g.dy + project(velocity);
    if (velocity > 300 || (velocity > -300 && resting > d.offsetHeight * 0.45)) return close();
    const from = getComputedStyle(d).transform;
    d.style.transform = "";
    if (!reducedMotion()) d.animate([{ transform: from }, { transform: "translateY(0)" }], { duration: 320, easing: SHEET_EASE });
  };

  return (
    <span className="lang" ref={wrap}>
      <button
        ref={button}
        type="button"
        className="lang-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={m.languageButton(current.native)}
        onClick={() => (open ? close() : show())}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="lang-icon">
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.9 8h12.2M8 1.75c-1.9 1.8-2.75 3.9-2.75 6.25S6.1 12.45 8 14.25M8 1.75c1.9 1.8 2.75 3.9 2.75 6.25S9.9 12.45 8 14.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span lang={current.html}>{current.short}</span>
      </button>
      <dialog
        ref={panel}
        className="lang-panel"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        onCancel={(e) => {
          e.preventDefault(); // Escape: run the closing animation instead of vanishing
          close();
        }}
        onClick={(e) => {
          // A tap on the dimmed backdrop lands on the <dialog> itself, outside its box.
          const r = panel.current!.getBoundingClientRect();
          if (e.target === panel.current && (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right)) close();
        }}
      >
        <div className="lang-head" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <span className="lang-grabber" aria-hidden="true" />
          <h2 id={titleId} className="lang-title">{m.language}</h2>
          <button type="button" className="lang-done" onClick={() => close()}>
            {m.done}
          </button>
        </div>
        <div ref={list} className="lang-list" role="menu" aria-labelledby={titleId} onScroll={updateFades}>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitemradio"
              aria-checked={l.id === lang}
              className="lang-item"
              data-names={`${fold(l.native)}|${fold(l.english)}|${fold(l.short)}`}
              onClick={() => choose(l.id)}
            >
              <span className="lang-names">
                <span lang={l.html} className="lang-native">{l.native}</span>
                {l.english !== l.native && <span className="lang-english">{l.english}</span>}
              </span>
              <svg viewBox="0 0 16 16" aria-hidden="true" className="lang-check">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
        <p className="lang-foot">{m.languagePanelNote}</p>
      </dialog>
    </span>
  );
}
