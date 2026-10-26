import { useId, useMemo, useRef, useState } from "react";
import type { CountyMetric } from "../types";
import { buildIndex, searchCounties } from "../lib/search";

interface Props {
  metrics: CountyMetric[];
  onSelect: (geoid: string) => void;
}

/** Accessible combobox (WAI-ARIA 1.2 pattern): arrows move, Enter selects, Escape closes. */
export default function CountySearch({ metrics, onSelect }: Props) {
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
        Find a county
      </label>
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
        placeholder="e.g. Loudoun County, VA"
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
        <ul id={listId} role="listbox" className="search-results" aria-label="Matching counties">
          {results.length === 0 && (
            <li className="search-empty" role="option" aria-selected={false} aria-disabled>
              No county matches “{query}”. Try a county name, “Name, ST”, or a 5-digit county code.
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
