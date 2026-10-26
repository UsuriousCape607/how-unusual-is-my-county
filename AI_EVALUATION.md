# AI explanation evaluation

## What the AI does (and does not do)
The AI has exactly one job: turning one county's verified, structured comparison into a short, qualified paragraph.
It never calculates figures. Every county on the site gets a **deterministic template summary**
(`src/lib/summary.ts`, labelled "Automated summary · fixed template"). Three counties also show a **pre-generated
AI explanation**, labelled "AI-written explanation · pre-generated and checked". The site makes no model calls and
needs no API key.

## Process
1. `python scripts/build_ai_examples.py inputs <geoid>…` writes `ai/examples/<geoid>/input.json` from the exported
   data. It contains the county name, GEOID, state, population and density, pipeline count, peer method and count,
   peer population/density ranges, median, mean, fewer/equal/greater, peers with records, snapshot date, data
   version, limitations and quality indicators.
2. The model receives `ai/prompt.md` followed by that JSON and nothing else, and its text is saved verbatim as
   `output.md`.
3. `python scripts/build_ai_examples.py check` runs the automated checks:
   - every digit sequence in the output appears in the input;
   - length is 90–165 words;
   - no banned topics (harm, pollution, water, electricity, prices, jobs, taxes, racial or discrimination
     language, support/opposition, causal claims such as "because" or "due to", "statistically significant",
     "has no data centers");
   - the zero-count county uses the required sentence;
   - limitation language is present;
   - `input.json` still matches the current exported data.
4. A manual review traces each statement to an input field (`verification.md` in each folder).
5. `assemble` packages the examples into `public/data/ai_examples.json` with their `data_version`. The site shows an
   example only if that version matches the data currently on the site.

## Model
- **Model:** Anthropic Claude, used within the Claude Code session that built this project (prompt version 1,
  2026-10-26). The exact model identifier is not recorded in the repository, by the build tooling's policy; the
  project owner has it from the session.
- **Independence caveat:** the explanations were written by the same assistant that built the pipeline. It worked
  only from the prompt and input JSON, but it is not an independent system. The project owner should read the three
  outputs against their inputs before relying on them; this takes about five minutes.

## Examples (snapshot 2026-10-02)
| County | Why chosen | Count | Peers fewer / same / more | Automated check | Manual review |
|---|---|---|---|---|---|
| Loudoun County, VA (51107) | High count; default demo county | 9 | 40 / 0 / 0 | pass | pass (1 revision) |
| Marion County, IN (18097) | Typical case with ties | 3 | 33 / 5 / 2 | pass | pass (1 revision) |
| Harris County, TX (48201) | Large county with zero records | 0 | 0 / 15 / 25 | pass | pass |

**Revisions found by the checks:**
- Loudoun: the first draft said "informative because…", which the banned-wording check flagged; it was reworded.
- Marion: manual review removed "similar size and settlement pattern", an interpretation not in the input.

Neither revision changed a number. No output contained a number absent from its input.

## Files
```
ai/prompt.md                      exact prompt text
ai/examples/<geoid>/input.json    model input (generated from the exported data)
ai/examples/<geoid>/output.md     model output as published
ai/examples/<geoid>/verification.md   statement-by-statement check
ai/examples/<geoid>/meta.json     model label, date, summary
data/processed/ai_check_report.json   automated check results
public/data/ai_examples.json      what the website shows
```

## When the data are rebuilt
If a rebuild changes the data version, `check` reports the examples as stale and the site hides them; the template
summary is still shown for every county. To refresh them, regenerate the inputs, produce new outputs with the same
prompt, rerun `check`, review, and `assemble`.
