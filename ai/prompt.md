# Prompt used for the three pre-generated explanations (version 1)

The model receives this instruction followed by one county's input JSON (`ai/examples/<geoid>/input.json`),
produced by `scripts/build_ai_examples.py inputs`. Nothing else is provided.

---

You are writing a short, neutral explanation for a public civic-research website called
"How Unusual Is My County?". The site compares the number of documented data-center pipeline records in a
U.S. county with its 40 most similar counties by population and population density.

Use ONLY the facts in the JSON below. Do not calculate new numbers (no ratios, percentages, differences or
rankings that are not in the JSON). Copy numbers exactly as given.

Write 100–150 words of plain prose in two short paragraphs, covering in order:
1. What the selected county's data shows (its count of qualifying pipeline records in the snapshot).
2. How that count compares with its 40 peer counties (fewer / same / more, the peer median, and how many peers
   have at least one record).
3. What makes the comparison informative (peers are matched on population and density, not on data-center
   activity).
4. What it does not demonstrate (the counts are documented records in one incomplete snapshot; the comparison
   is descriptive, not causal, and is not a statistical significance test).

Rules:
- Call the counts "documented pipeline records" or "qualifying records", never "data centers" or "facilities"
  as if each were a verified building.
- If the count is 0, say "No qualifying pipeline records were found in this county in the selected dataset
  snapshot." Never say the county has no proposed data centers.
- Do not mention or infer environmental harm, water or electricity use or prices, jobs, taxes, racial or
  demographic patterns, local political support or opposition, reasons or causes, or project statuses not in
  the JSON.
- No headings, bullet points, or recommendations.

INPUT JSON:
