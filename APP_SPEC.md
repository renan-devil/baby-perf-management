# Constance Development Tracker: App Specification (v0.1, draft to amend)

> **How to use this document.** This is a working draft. Amend anything directly.
> Items marked **🟡 DECISION** need your call before we build. Items marked
> **⚠️ NOTE** are things I found in the Excel file that we should fix.

---

## 1. Purpose

Track Constance's developmental milestones (motor, language, cognitive, social,
self-care) from birth to about 6 years old, compare her progress with **scientifically
sourced reference ages**, and suggest **what to do next** to support the skills
she is currently developing.

What the app is **not**: a medical or diagnostic tool. Children vary a lot. The app
should say "worth mentioning to the pediatrician", never "problem". Loss of a skill
she already had (regression) is always flagged, because that is a recognised warning sign.

### Goals, in priority order
1. **Log** quickly: "Constance did X today", from a phone, in under 10 seconds.
2. **Compare**: is she inside the normal window for each milestone? Where is she
   ahead or behind, by domain?
3. **Guide**: which skills are "up next" for her age, and which activities help.
4. **Remember**: keep a dated history (with optional notes and photos) as a family record.

---

## 2. What the Excel file (v0) does today

### 2.1 Structure
| Sheet | Content |
|---|---|
| `Raw ability` | 135 milestones from 0 to 36 months, each written as one CSV-style text cell: `"age band","ability","how to train it"`. Formulas split the text into columns. |
| `Dashboard performance` | One line chart: **Regular** vs **Constance**. |

Key columns in `Raw ability`:
- **J, "Age of the child"**: reference age = the **lower bound** of the age band (e.g. `"9-12 months"` becomes 9).
- **M, "Constance (months)"**: the month at which Constance achieved the milestone (blank = not yet).
- **O / P / Q**: for each month 0 to 36, the **cumulative number** of milestones reached by that month:
  `P = COUNTIF(J, < month+1)` (reference) and `Q = COUNTIF(M, < month+1)` (Constance).

So the chart answers: *"by month t, how many milestones has a typical child reached,
and how many has Constance reached?"* It is a good core idea and we keep it (improved, see §5).

### 2.2 Current data snapshot
- 135 milestones in 14 age bands (0-1 m … 36 m). One row is empty (row 73).
- Constance has 122 of 135 recorded. The latest entries are at 29 months, so she is probably about 29-30 months old now.
- She is **earlier than the reference for 110 of 122**, the same for 11, later for 1.
  Average difference: **3.4 months earlier**.

### 2.3 Issues to fix (⚠️ NOTE)
1. **The reference ages are not scientific.** The list reads like a generic
   compilation (probably AI-generated), with no source and no spread. One age
   per band lower bound does not say *how normal* a given age is. For example,
   walking alone has a normal window of about **8 to 18 months** (WHO), not "12".
2. **The reference is a band lower bound, so the comparison is biased.** Being
   "3.4 months ahead of the lower bound" on almost everything is statistically
   very unlikely. It more likely means the reference ages are wrong, or the
   milestone definitions were read loosely. Two concrete checks against WHO data:
   - *Sits without support* recorded at **3 months**. The WHO normal window is
     3.8 to 9.2 months (1st to 99th percentile), median 5.9.
   - *Crawls* recorded at **5 months**. WHO hands-and-knees crawling window is
     5.2 to 13.5 months, median 8.5.
   These may be real, or may be "sits with support" and "commando crawl" recorded
   early. This is exactly why each milestone needs a **precise, observable definition**.
3. **Duplicates or near duplicates:** "Uses pronouns (I, me, you)" (21 m and 33 m),
   "Understands prepositions" (27 m and 36 m), "Pedals / Rides a tricycle / Rides a tricycle well"
   (27, 33, 36 m), "Follows simple directions" vs "Follows simple commands",
   "Identifies body parts" (15 m) vs "Knows basic body parts" (30 m),
   "Says name, age, gender" (24 m) vs "Knows own name, age, and gender" (36 m).
4. **Some items are behaviours, not skills:** "Shows stranger anxiety", "Shows defiant behavior".
   Keep them as *observations* if you like, but they should not count as "performance".
5. **Some items are not standard milestones at that age:** "Recites the alphabet" or
   "Recognizes familiar written words" at 3 years depend on exposure, not development norms.
6. **No domain** (motor / language / …), so no per-domain view.
7. **Only month precision** and no dates, so we cannot see progress within a month.
8. **The data is stored as text inside one cell** and split with formulas. Fragile, but
   easy to migrate (I have parsed it already).

---

## 3. Scientific basis (the reference data)

Principle: every reference age in the app comes from a **named source**, and
wherever possible it is a **distribution** (percentiles), not a single number.

| Source | What it gives | Use in the app |
|---|---|---|
| **WHO Motor Development Study** (Multicentre Growth Reference Study, 2006) | 6 gross motor milestones with 1st / 50th / 99th percentile windows, measured on ~800 children in 5 countries | Gold standard for motor: sitting, crawling, standing with help, walking with help, standing alone, walking alone |
| **CDC / AAP "Learn the Signs. Act Early."** (revised 2022) | Checklists at 2, 4, 6, 9, 12, 15, 18 m, 2, 3, 4, 5 years. Each item is something **75% of children** do by that age | Main catalogue for social, language, cognitive, motor. Also "when to talk to your doctor" flags |
| **Denver II** (Frankenburg et al.) | Ages at which 25%, 50%, 75%, 90% of children pass each item | Best for percentile curves where available (item details are licensed, so use carefully) |
| **French health booklet** (*carnet de santé*, 2018 edition), optional | Milestones checked at the mandatory check-ups (9 m, 24 m, …) | Aligns the app with what your pediatrician checks |

**Reference model for each milestone:** a small set of percentile points, for example
`p25, p50, p75, p90` (in months). Between points we interpolate linearly. This gives, for
any age *t*, the fraction of children who have acquired the skill by age *t*:
`F_i(t)`, the cumulative distribution function (CDF) of milestone *i*.

When a source gives only one number (e.g. CDC's 75th percentile), we store it as
`p75` and mark the other percentiles as estimates, with the confidence shown in the UI.

🟡 **DECISION 1: age range.** 0 to 36 months (what the Excel covers), or extend to
5 or 6 years now? *Recommendation:* 0 to 6 years in the catalogue, because Constance is
already about 2.5 and CDC data exists up to 5 years.

🟡 **DECISION 2: bilingual?** If Constance hears two languages (e.g. French and English),
science says bilingual children reach language milestones on time **when you count
words in both languages together**. The app would then count vocabulary across languages.

---

## 4. Functional description

### 4.1 Screens
1. **Today** (home)
   - Constance's age (years, months, days), plus corrected age if she was premature.
   - **"Up next"**: 3 to 5 milestones she is likely working on now, each with 1 or 2
     activities ("How to train"). A milestone is "up next" if it is not achieved and
     her age is between its `p25` and `p90`.
   - Big **"+ Log a milestone"** button.
2. **Milestones** (the catalogue)
   - Filter by domain and age. Each milestone shows: definition (what exactly counts),
     normal window, source, activities, and Constance's status.
   - Status choices: *Not yet*, *Emerging* (sometimes / with help), *Achieved* (with date).
3. **Progress** (the dashboard, successor of the Excel chart)
   - Chart A: cumulative curve with a normal band (see §5.1).
   - Chart B: developmental age by domain vs actual age (see §5.2).
   - Chart C: timeline of each milestone, showing where Constance's date falls in its window.
4. **Journal**: dated notes and photos ("first sentence: *encore gâteau*").
5. **Alerts**: milestones past `p90` and not achieved ("mention at next check-up"),
   and any skill marked as lost.
6. **Settings**: child profile (name, birth date, due date if premature), languages,
   export / import (CSV and JSON), family members who can log.

### 4.2 Status logic per milestone (simple and explainable)
Let *t* be Constance's age (corrected if premature, until 24 months).

| Situation | Label | Colour |
|---|---|---|
| Achieved at age *a* < p25 | Early | blue |
| Achieved at p25 ≤ *a* ≤ p90 | In the normal window | green |
| Achieved at *a* > p90 | Later than most (still achieved) | grey |
| Not achieved, *t* < p25 | Not expected yet | none |
| Not achieved, p25 ≤ *t* ≤ p90 | Up next | yellow |
| Not achieved, *t* > p90 | Worth discussing with the pediatrician | orange |
| Marked as lost | Regression: discuss soon | red |

### 4.3 Out of scope for v1 (can add later)
Growth curves (weight / height / head circumference, WHO charts), sleep and feeding logs,
vaccination record, multiple children, and AI-generated activity suggestions.

🟡 **DECISION 3:** confirm the out-of-scope list. Growth curves are cheap to add later
since WHO publishes the tables openly.

---

## 5. The maths (computations)

### 5.1 Cumulative curve with a normal band (improved Excel chart)
For each age *t* (in months, step 0.25):
- **Constance:** `C(t)` = number of milestones she achieved by age *t* (same as the Excel `COUNTIF`).
- **Expected count:** `E(t) = Σ_i F_i(t)`, the sum over all milestones of the probability
  that a typical child has it by age *t*. This replaces the "lower bound" step curve by a
  smooth, unbiased expected value.
- **Band:** the normal range of the count. Assuming milestones are independent,
  the variance is `V(t) = Σ_i F_i(t)·(1 − F_i(t))`, and we show `E(t) ± 1.28·√V(t)`
  (roughly the 10th to 90th percentile).
  *Caveat:* milestones are positively correlated (a child ahead in motor is often ahead in
  other motor items), so the true band is **wider**. v1 shows this band labelled as
  "approximate". v2 could calibrate it by simulation.

### 5.2 Developmental age and developmental quotient (per domain)
For domain *d* (e.g. language), Constance's **developmental age** is the age *t\** at which
a typical child has reached as many milestones in that domain as she has:
`E_d(t*) = C_d(today)`. Solve by bisection, since `E_d` is increasing.

**Developmental quotient:** `DQ_d = 100 × t* / actual age`. 100 = exactly typical,
above 100 = ahead. This concept is used in standard developmental scales (e.g. Griffiths).
We display it with a range, not as a precise score.

### 5.3 Percentile of each achievement
For an achieved milestone at age *a*: percentile = `F_i(a) × 100`. Example: walking alone
at 10 months is around the 15th to 20th percentile (earlier than about 80% of children).
The average of these percentiles by domain gives a simple, readable "ahead / on track" summary.

### 5.4 Corrected age
If born before 37 weeks: `corrected age = age − (40 − gestational weeks at birth)`,
used until 24 months (standard pediatric practice).

---

## 6. Architecture (simple and sound)

### 6.1 Principles
1. **Content separate from code.** The milestone catalogue is a plain data file
   (`catalog/milestones.csv` or `.json`) in the repo. You can amend it without touching code.
2. **Computations are pure functions** (§5), unit tested, in one file. Easy to check the maths.
3. **Few moving parts.** One web app, one managed database, no custom servers.
4. **Private by default.** Login required, no ads, no third-party analytics.

### 6.2 Recommended stack
| Layer | Choice | Why |
|---|---|---|
| App | **Web app installable on the phone (PWA)** in React + TypeScript (Vite) | One code base for iPhone, Android and computer. No App Store needed. |
| Charts | Recharts | Simple, standard |
| Database + login | **Supabase** (managed PostgreSQL + authentication + photo storage), EU region | Both parents see the same data on their phones. Free tier is enough for one family. |
| Hosting | **Vercel** (or Netlify) | Free tier, deploys automatically from GitHub |
| Tests | Vitest for the maths | Checks the formulas of §5 |

**Expected cost:** €0/month on free tiers. About €25/month only if we ever outgrow them
(e.g. many photos). Custom domain name optional (~€10/year).

```
 Phone / laptop (PWA)                    Cloud (managed, no servers to maintain)
 ┌──────────────────────────────┐        ┌──────────────────────────────┐
 │ UI: Today, Milestones,       │        │ Supabase (EU)                │
 │     Progress, Journal        │  HTTPS │  - Auth (family accounts)    │
 │ Logic: status, curves, DQ ◄──┼────────┼─►- Postgres: child,          │
 │ Catalogue (bundled data)     │        │    observations, journal     │
 │ Offline cache                │        │  - Storage: photos           │
 └──────────────────────────────┘        └──────────────────────────────┘
          ▲ built & deployed by Vercel from GitHub
```

🟡 **DECISION 4: sync vs local only.**
- **Option A (recommended): Supabase.** Several devices and parents, data backed up.
- **Option B: local only.** Data stays on one device's browser, with manual export.
  Simpler and 100% private, but data can be lost if the browser is cleared, and no sharing.

🟡 **DECISION 5: languages of the interface.** English only, French only, or both?

### 6.3 Data model

```
Child           id, first_name, birth_date, gestational_weeks (nullable), languages[]
Milestone       id, domain, title, definition, activities[], age_band_label,
  (catalogue)   p25, p50, p75, p90 (months, nullable), source, source_ref,
                confidence (measured | estimated), kind (skill | behaviour), min_age_display
Observation     id, child_id, milestone_id, status (not_yet | emerging | achieved | lost),
                observed_on (date), note, photo_url, logged_by, created_at
JournalEntry    id, child_id, date, text, photo_url, milestone_ids[]
FamilyMember    id, user_id, child_id, role (parent | viewer)
```

Notes:
- We keep **every observation** (history), not just the latest status. "Emerging on 3 March,
  achieved on 20 April" is valuable, and it lets us detect regression.
- **Domains:** gross motor, fine motor, language (receptive / expressive), cognitive,
  social-emotional, self-care. These match CDC's groupings.

### 6.4 Repository layout
```
/catalog/milestones.csv      reference data (editable, sourced)
/catalog/sources.md          full citations
/src/domain/                 pure logic: age, status, curves, DQ (+ tests)
/src/ui/                     screens and components
/supabase/schema.sql         database tables and security rules
/scripts/import-excel.ts     one-off migration of BabyPerfMGT.xlsx
APP_SPEC.md                  this document
```

---

## 7. Migrating the Excel data
1. Rebuild the catalogue from CDC / WHO sources (§3), assigning domains and definitions.
2. **Map** each of the 135 Excel milestones to a catalogue item (many map directly;
   duplicates are merged; items with no scientific equivalent are kept as "custom", with no
   reference age, so they are logged but not scored).
3. Import Constance's months as observations with date = birth date + *m* months, flagged
   "approximate date (imported)".
4. I will produce a **mapping table for you to review** before import, especially for
   the early motor entries in §2.3 (sitting at 3 months, crawling at 5 months).

🟡 **DECISION 6:** I need Constance's **birth date** (and gestational age at birth if
she was premature) to convert months into dates and compute her current age.

---

## 8. Build plan (proposed)

| Step | Deliverable | Rough effort |
|---|---|---|
| 1 | Sourced milestone catalogue (CSV) + Excel mapping table, **for your review** | 1 session |
| 2 | Pure logic module (§5) + unit tests, validated against the Excel numbers | 1 session |
| 3 | App v1: Today, Milestones, logging, Progress chart A; Supabase login | 1-2 sessions |
| 4 | Import Constance's history; charts B and C; alerts | 1 session |
| 5 | Journal with photos, export, PWA install on phones | 1 session |

We validate with you after steps 1, 3 and 4.

---

## 9. Risks and safeguards
- **Anxiety from comparisons.** Show windows and ranges, never rankings. Neutral wording.
  Orange / red flags always come with "discuss with your pediatrician", not a verdict.
- **Reference data quality.** Every item shows its source; estimated items are marked.
- **Privacy (GDPR, child data).** EU hosting, family-only access, export and delete everything on demand.
- **Data loss.** Supabase daily backups, plus manual CSV export.

---

## 10. Summary of decisions needed
| # | Question | My recommendation |
|---|---|---|
| 1 | Age range | 0 to 6 years |
| 2 | Bilingual language counting | Yes, if applicable |
| 3 | Out-of-scope list for v1 | As listed in §4.3 |
| 4 | Sync (Supabase) vs local only | Supabase |
| 5 | Interface language | Your choice (FR / EN / both) |
| 6 | Birth date, gestational age | Needed before import |
