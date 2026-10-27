# Translation review

All 21 translations (`src/i18n/*.ts`) were written with AI. **None has been checked by a professional translator or a
native speaker**, and the site says so in every language (the note under the title and in the language menu). This
file lists what a reviewer should look at first, language by language, with the lowest-confidence ones at the top.
English (`src/i18n/en.ts`) is the source of truth. Anything a translation leaves out falls back to English.

What tests already guarantee for every language:
- every message is present;
- every number, name and date passed in appears in the output;
- markup is balanced, and `<list/>` slots are kept;
- the disclosure is translated.

They cannot check grammar, register or terminology.

## How to review
- Each file is a flat object keyed like `en.ts`. Strings with `${…}` are templates: keep every placeholder. Move
  `<b>…</b>` / `<a>…</a>` freely to fit word order.
- Run `npm test` after editing: it fails if a placeholder or key goes missing.
- To see a language in context, open `…/?lang=<id>` (for example `?lang=nv`).
- Dates, "N days ago" and list joins for languages the browser has no data for are written out in
  `src/i18n/formats.ts`. Review those too: month names and the "ago" phrases.

## Confidence by language

| id | Language | Confidence | Main concerns |
|---|---|---|---|
| `nv` | Diné bizaad (Navajo) | **Very low** | Verb morphology, coined terms, see below |
| `xno` | Anglo-Norman (Law French) | Low | A historical register with no modern technical vocabulary |
| `la-x-eccl` | Latina Ecclesiastica | Low–medium | Neologisms for modern things |
| `el-x-kathar` | Ελληνικά (Καθαρεύουσα) | Low–medium | Register consistency, modern terms |
| `pdc` | Pennsylvania Dutch (Deitsch) | Low–medium | Spelling system, English loans |
| `mn-Cyrl` | Монгол | Medium | Terminology |
| `az-Latn` | Azərbaycanca | Medium | Terminology |
| `ht` | Kreyòl ayisyen | Medium | Terminology |
| `ko-Kore` | 韓國語（國漢文混用） | Medium | Which words take hanja |
| `tr`, `hi`, `el`, `hu`, `pl`, `sv`, `ja`, `ko`, `zh-TW`, `zh-CN`, `es`, `it` | | Medium–high | Tone, small terminology choices |

## Diné bizaad (`nv`): needs a fluent speaker before anyone relies on it
No Navajo dictionary was reachable while writing this. The terms below were checked only against published
examples found by web search, and the rest of the text is unverified:
- `béésh nitsékeesí` "computer" (lit. thinking metal): seen in a published Navajo word-of-the-day series, spelled
  there *béésh nitsikeesí*.
- `hahoodzo` "state": from *Hoozdo Hahoodzo* (Arizona). Navajo County's Navajo name also contains *Bił Hahoodzo*, so
  the word may be the usual term for county too.

Points to check:
- **"county"** is left as an English loan (how many speakers say it in practice). A speaker may prefer *hahoodzo*
  for county and another word for state.
- **"data center"** = `béésh nitsékeesí bá kin` (building for computers): a coinage.
- **"similar"** = `ahééníłtʼéhígíí`: built on the prefix *ahee-* "alike" with the stem *-níłtʼé* (extent). This is the
  biggest risk. It appears on almost every screen.
- **Verb forms** may be wrong in person, mode or number. These include:
  - *ádoolnííł* "will be built"
  - *ádaalnééh* "being built"
  - *bee haʼdeetʼą́* "permitted"
  - *yíltaʼ* "counted"
  - *yiníłʼį́* "look at it"
  - *hádínítaʼ* "search for it"
  - *bikʼidíílniih* "touch/press it"
  - *ánílééh* "make it"
  - *ánáánílééh* "reload"
- **Comparatives**: *bilááh* "more than" and *bitsʼą́ą́ʼ áłtsʼíísí* "less than" (lit. smaller); *ałʼąą doo átʼée da* "not
  different" for "the same"; *łą́ąjí* "most/majority"; *ałníiʼgi* "in the middle" for the median.
- **Population density** is a periphrasis: *dineʼé bitaʼ áhání*, roughly "how close people are".
- **UI verbs** (Share, Copy, Download, Print, Embed) keep English words with *ánílééh* "make/do".
- **formats.ts:**
  - month names (*Yas Niłtʼees … Níłchʼitsoh*);
  - *dííjį́* "today" and *adąąʼdą́ą́ʼ* "yesterday";
  - "N days ago" = *N jį́ yę́ędą́ą́ʼ* and "N months ago" = *N nídeezid yę́ędą́ą́ʼ*. These two are guesses.
- Typography: ʼ is U+02BC (a test enforces it); nasal hooks use ogonek characters with combining acute accents.

If a speaker cannot review it, consider showing Navajo only for the most-used labels and letting the rest fall back
to English (delete keys from `nv.ts`; the English fallback is automatic).

## Anglo-Norman / Law French (`xno`)
- **Register:** the year books, abridgments and reports. The forms used are:
  - "de record", "ceo", "issint", "nient", "nemy", "solonc", "chescun";
  - "ount"/"sount"/"ad", "fuit"/"fuerent", "darreinement", "ensement".

  Spelling is deliberately unstandardised, as the sources were. The text uses -é / -ez participles and "le" for
  most nouns.
- **Modern things keep their English name inside Law French grammar,** as reporters did with English words
  ("un data center", "crypto-mining", "power"). "Snapshot" is rendered *transcript*, "summary" *abbregement*.
- **Coinages to check:**
  - *en fesance* "in development";
  - *licencié* "permitted";
  - *en edifiant* "under construction";
  - *Cancellé*;
  - *fichiers*;
  - *descharger* "download";
  - *lien* "link";
  - *intelligence artificiele*.
- **Dates** (formats.ts): "2 jour d’Octobre l’an 2026". Month spellings Janver, Feverer, Marz, Averil, May, Juyn, Juyl,
  August, Septembre, Octobre, Novembre, Decembre. "a jour de huy" for today, "N jours passez" for days ago.
- It must not read as modern French. Flag any modern French forms (e.g. *nous*, *aujourd’hui*, *données*).

## Ecclesiastical Latin (`la-x-eccl`)
- **Register:** modern Holy See institutional Latin, with Italian number formatting as in Vatican documents.
- **Key terms:**
  - *comitatus* "county";
  - *centrum datorum* "data center", a calque. Alternatives: *centrum computatorium*, or a periphrasis;
  - *in apparatu* "in development";
  - *in actis (relatus)* "on record";
  - *inscriptio* "record";
  - *exemplum* "snapshot";
  - *situs interretialis* "website";
  - *nexus* "link";
  - *depromere* "download";
  - *intellegentia artificialis*;
  - *mediana / medium* "median / mean".
- **Long dates** are ablatives of time ("die 2 mensis Octobris anno 2026"). Every sentence that receives one is
  built for an ablative ("Notitiae prout erant …", "in exemplo … confecto", "quem Census aestimat … fuisse").
  Check these readings.
- **Status words** in the compact list avoid gender agreement: *in aedificatione*, *permissu dato*, *in proposito*.

## Katharevousa (`el-x-kathar`)
- Polytonic throughout (a test checks it), with:
  - dative where the learned register keeps it;
  - -ις / -εως nouns;
  - -αι plurals;
  - "μέχρι τῆς" before dates.

  Grave accents are used where the next word follows without a pause.
- **Modern terms are anachronistic in any register.** Check:
  - κέντρον δεδομένων "data center";
  - στιγμιότυπον "snapshot";
  - λῆψις "download";
  - τεχνητὴ νοημοσύνη "AI";
  - ἱστότοπος "website".
- **Consistency:** a reviewer should check that no Demotic forms slipped in (e.g. *είναι* without breathing, *-ση*
  endings, *θα*).
- **formats.ts:** genitive month names (Ἰανουαρίου … Δεκεμβρίου), *σήμερον*, *χθές*, *πρὸ N ἡμερῶν*.

## Pennsylvania Dutch (`pdc`)
- **Spelling:** the Buffington–Barba system (English-based spelling such as *Kaundi*, *Yuli*, *Oktower*), not
  Standard German spelling. It must not drift into Standard German or Dutch.
- **Loans to check:**
  - *Data-Center*, *Snapshot*, *Link*, *Webseit*, *runnerlaade* "download" (as everyday PA Dutch borrows).
  - *Bletz am Kumme* "sites in development". The literal sense is "places in the coming", an idiomatic stretch.
  - *uffgschriwwe* "on record".
- **Quotes:** „…“ style.
- **Dates** (formats.ts): Yenner, Hanning, Marz, Abril, Moi, Yuni, Yuli, Auguscht, September, Oktower, Nowember,
  Disember. "vor N Daag" for days ago.

## Mongolian (`mn-Cyrl`)
- **Terms:**
  - *каунти* "county", a transliteration. Alternatives: *муж* (province/state, wrong level) or *сум*, which is a
    different unit.
  - *өгөгдлийн төв* "data center";
  - *байршил* "site";
  - *хувилбар* "snapshot/version".
- **Grammar:** sentences avoid case suffixes on English names by using "огноо:" and parentheses. Check they read
  naturally.
- **Dates:** "2026 оны 10-р сарын 2" (written out; browsers have no Mongolian date data).

## Azerbaijani (`az-Latn`)
- **Terms:**
  - *qraflıq* "county". *İnzibati rayon* is the domestic analogue.
  - *məlumat mərkəzi* "data center". *Data mərkəzi* is also common.
  - *obyekt* "site";
  - *buraxılış* "snapshot/release".
- **Grammar:** suffixes are kept off English names.
- **Numbers and dates:** numbers use Turkish formatting (same separators). Dates are written out: "2 oktyabr 2026".

## Haitian Creole (`ht`)
- **Terms:**
  - *konte* "county";
  - *sant done* "data center";
  - *ekstrè done* "snapshot". This is a weak choice; *foto done yo* or *vèsyon done yo* may be clearer.
- **Style:** check the use of *yo* plural markers and the determiner (*la/a/an*) forms after nasal and vowel
  endings.
- **Dates:** written out ("2 oktòb 2026").

## Others (medium–high confidence)
- **Mixed-script Korean (`ko-Kore`):** which Sino-Korean words are written in hanja is a style choice. Native words
  stay in Hangul.
- **Turkish (`tr`):** *ilçe* (district) for county; *kontluk* is literal but unusual in Turkish usage about U.S.
  counties.
- **Hindi (`hi`):** *काउंटी* (loan) for county, *डेटा सेंटर*. Numbers use Indian grouping (4,49,749) via the browser.
- **Greek (`el`):** monotonic Demotic, *κομητεία*. Articles are avoided before dates.
- **Italian (`it`), Hungarian (`hu`), Polish (`pl`), Swedish (`sv`), Spanish (`es`), Japanese (`ja`), Korean (`ko`), Chinese
  (`zh-TW`, `zh-CN`):** tone and small terminology only. Grammar near numbers was checked: Polish verb agreement
  (*ma/mają*) and genitive plural; Swedish singular/plural; Japanese spacing before 時点.
