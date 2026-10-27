import { useId, useMemo, useRef, useState } from "react";
import type { CountyMetric } from "../types";
import { buildIndex, searchCounties } from "../lib/search";
import { useM } from "../i18n/I18nProvider";

interface Props {
  metrics: CountyMetric[];
  onSelect: (geoid: string) => void;
}

/** Accessible combobox (WAI-ARIA 1.2 pattern): arrows move, Enter selects, Escape closes. */
export default function CountySearch({ metrics, onSelect }: Props) {
  const m = useM();
  const index = useMemo(() => buildIndex(metrics.filter((m) => m.eligible)), [metrics]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => searchCounties(index, query), [index, query]);

  const choose = (geoid: string) => {
    onSelect(geoid);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Japanese, Chinese and Korean keyboards use Enter and the arrows to pick characters; leave those keys to them.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results[active]) {
        e.preventDefault();
        choose(results[active].geoid);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="search">
      <label htmlFor={`${listId}-input`} className="search-label">
        {m.findCounty}
      </label>
      <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        id={`${listId}-input`}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${results[active].geoid}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={m.searchPlaceholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul id={listId} role="listbox" className="search-results" aria-label={m.matchingCounties}>
          {results.length === 0 && (
            <li className="search-empty" role="option" aria-selected={false} aria-disabled>
              {m.noCountyMatch(query)}
            </li>
          )}
          {results.map((r, i) => (
            <li
              key={r.geoid}
              id={`${listId}-${r.geoid}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(r.geoid);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span>{r.label}</span>
              <span className="muted">{r.stateName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
