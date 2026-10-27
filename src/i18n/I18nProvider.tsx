import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Messages } from "./en";
import { LANGUAGE, LOADERS, browserLang, parseLang, type Lang } from "./languages";
import { setActive } from "./state";

const STORAGE_KEY = "lang";

interface I18n {
  lang: Lang;
  m: Messages;
  setLang: (lang: Lang) => void;
}

const Ctx = createContext<I18n>({ lang: "en", m: en, setLang: () => {} });

export const useI18n = (): I18n => useContext(Ctx);
/** The interface text in the active language. */
export const useM = (): Messages => useContext(Ctx).m;

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** ?lang= in the address, then the visitor's earlier choice, then the browser's languages, then English. */
function initialLang(): Lang {
  return parseLang(new URLSearchParams(window.location.search).get("lang")) ?? parseLang(readStored()) ?? browserLang(navigator.languages ?? []);
}

async function messagesFor(lang: Lang): Promise<Messages> {
  if (lang === "en") return en;
  const t = (await LOADERS[lang]()).default;
  return { ...en, ...t };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ lang: Lang; m: Messages } | null>(() => {
    const lang = initialLang();
    if (lang !== "en") return null;
    setActive("en", en);
    return { lang: "en", m: en };
  });

  const apply = useCallback((lang: Lang) => {
    messagesFor(lang)
      .then((m) => {
        setActive(lang, m);
        setState({ lang, m });
      })
      .catch(() => {
        setActive("en", en);
        setState({ lang: "en", m: en });
      });
  }, []);

  // A translated first visit waits for its (small) translation file instead of flashing English.
  useEffect(() => {
    if (!state) apply(initialLang());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = state?.lang;
  useEffect(() => {
    if (!lang) return;
    document.documentElement.lang = LANGUAGE[lang].html;
    // The address carries the language, so a copied link opens in it and a refresh keeps it.
    const url = new URL(window.location.href);
    if (lang === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", lang);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private mode or blocked storage: the choice still applies to this visit and stays in the address.
      }
      apply(next);
    },
    [apply],
  );

  if (!state) return null;
  return <Ctx.Provider value={{ lang: state.lang, m: state.m, setLang }}>{children}</Ctx.Provider>;
}
