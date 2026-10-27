import type { Project } from "../types";
import { normalize } from "./search";

/**
 * Find projects by name, company, city, or county. Name matches rank above company, then place matches.
 * Returns at most `limit` results; queries shorter than 2 characters return nothing.
 */
export function searchProjects(index: Project[], query: string, limit = 20): Project[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const words = q.split(" ");
  const scored: { p: Project; score: number }[] = [];
  for (const p of index) {
    const name = normalize(p.name ?? "");
    const op = normalize(p.operator ?? "");
    const place = normalize(`${p.city ?? ""} ${p.source_county ?? ""} ${p.state ?? ""}`);
    const hay = `${name} ${op} ${place}`;
    if (!words.every((w) => hay.includes(w))) continue;
    let score = 1;
    if (name.startsWith(q)) score = 6;
    else if (name.includes(q)) score = 5;
    else if (op.startsWith(q)) score = 4;
    else if (op.includes(q)) score = 3;
    else if (place.includes(q)) score = 2;
    scored.push({ p, score });
  }
  scored.sort((a, b) => b.score - a.score || (a.p.name ?? a.p.id).localeCompare(b.p.name ?? b.p.id));
  return scored.slice(0, limit).map((s) => s.p);
}
