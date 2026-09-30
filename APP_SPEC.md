# Constance's Development Tracker: App Specification (v1.0, agreed; amend any time)

> **v1.0:** all open decisions answered (see §10). This version is the basis for the build.
>
> **v0.3 changes:** the app is **private, for Constance only**, not commercial and not
> open to other families. It is still online and shared between devices, by invitation only.
> Birth date confirmed: **4 February 2022**. §1, §3.7, §6 and §8–10 are simplified.
>
> **v0.2 changes:**
> - Skills are grouped by **subject → domain** (§3.3).
> - The timeline goes **beyond 36 months**, by joining our early catalogue with the open
>   **Marble Skill Taxonomy** (ages 4–13, §3.2, §3.4).
> - Skills are **linked by dependencies** (§3.6) and shown on a **skill map** (§4.1, §5.5–5.6).
> - Your answers are included: Constance was born on **4 February 2022**, she hears
>   **three languages** (EN / FR / PT, §3.5), the app is **shared online** between
>   family devices (§6.3), and the interface is in **FR / EN / PT** (§6.5).

> **How to use this document.** This is a working draft. Amend anything directly.
> Items marked **✅ DECIDED** record your choices. Items marked
> **⚠️ NOTE** are things I found in the Excel file that we should fix.

---

## 1. Purpose

Track Constance's skills, grouped by subject (mobility, language, social skills,
mathematics, …), from birth to the early school years. It is a **private family app**:
not commercial and not open to the public. It compares her progress with **scientifically
sourced reference ages**, and suggest **what to do next** to support the skills
she is currently developing.

What the app is **not**: a medical or diagnostic tool. Children vary a lot. The app
should say "worth mentioning to the pediatrician", never "problem". Loss of a skill
she already had (regression) is always flagged, because that is a recognised warning sign.

### Goals, in priority order
1. **Log** quickly: "Constance did X today", from a phone, in under 10 seconds.
2. **Compare**: is she inside the normal window for each milestone? Where is she
   ahead or behind, by subject?
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
- Constance has 122 of 135 recorded. The latest entries are at 29 months (about July 2024).
  With her birth date (4 Feb 2022), she is now **4 years 7 months (≈ 55.9 months)**. So the
  Excel is about two years out of date, and most of the "36 months" items she hasn't got are
  probably just not logged. The catalogue must extend well beyond 36 months (§3.3).
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
6. **No subject** (motor / language / …), so no per-subject view.
7. **Only month precision** and no dates, so we cannot see progress within a month.
8. **The data is stored as text inside one cell** and split with formulas. Fragile, but
   easy to migrate (I have parsed it already).

---

## 3. Scientific basis (the reference data)

### 3.1 Sources

Principle: every reference age in the app comes from a **named source**, and
wherever possible it is a **distribution** (percentiles), not a single number.

| Source | What it gives | Use in the app |
|---|---|---|
| **WHO Motor Development Study** (Multicentre Growth Reference Study, 2006) | 6 gross motor milestones with 1st / 50th / 99th percentile windows, measured on ~800 children in 5 countries | Gold standard for motor: sitting, crawling, standing with help, walking with help, standing alone, walking alone |
| **CDC / AAP "Learn the Signs. Act Early."** (revised 2022) | Checklists at 2, 4, 6, 9, 12, 15, 18 m, 2, 3, 4, 5 years. Each item is something **75% of children** do by that age | Main catalogue for social, language, cognitive, motor. Also "when to talk to your doctor" flags |
| **Denver II** (Frankenburg et al.) | Ages at which 25%, 50%, 75%, 90% of children pass each item | **Not used.** The item content is copyrighted, and CDC / WHO are enough |
| **French health booklet** (*carnet de santé*, 2018 edition), optional | Milestones checked at the mandatory check-ups (9 m, 24 m, …) | Aligns the app with what your pediatrician checks |

**Reference model for each milestone:** a small set of percentile points, for example
`p25, p50, p75, p90` (in months). Between points we interpolate linearly. This gives, for
any age *t*, the fraction of children who have acquired the skill by age *t*:
`F_i(t)`, the cumulative distribution function (CDF) of milestone *i*.

When a source gives only one number (e.g. CDC's 75th percentile), we store it as
`p75` and mark the other percentiles as estimates, with the confidence shown in the UI.

### 3.2 Two catalogues joined into one skill graph

The app combines **two complementary catalogues** into a single graph of skills:

| | **A. Early development** (we build it) | **B. Marble Skill Taxonomy v1** (your friends' open dataset) |
|---|---|---|
| Ages | 0 to about 5 years | 4 to 13 years (41 topics start at 4, 256 at 5, the rest later) |
| Content | Maturational milestones: sitting, walking, first words, pretend play, … | School learning: 1,590 "micro-topics" in 8 subjects (Mathematics 503, Science 547, English 286, Personal & Social Development 88, History 90, Life Skills 37, Computing 21, Learning to Learn 18) |
| Reference age | **Percentiles** (p25 / p50 / p75 / p90) from CDC / WHO | **Age range** in whole years (`ageRangeStart`–`ageRangeEnd`) |
| Links | We write them (~300 expected) | 3,221 prerequisite edges, tagged `hard` / `soft`, each with a one-line reason |
| Source | §3.1 | github.com/withmarbleapp/os-taxonomy |

The two meet around **4 to 5 years**, which is exactly Constance's age now. **Bridge links**
connect the end of A to the start of B. For example:
- *Counts to 3* → Marble *One-to-one counting* → *How many in total?*
- *Pincer grasp* → *Holds a crayon* → Marble *Sitting and holding a pencil*
- *Rhymes and songs* → Marble *Rhyming words* → *Onsets & rimes*
- *Names emotions* → Marble *Emotional literacy* topics

**What we take from Marble, besides the data** (so both catalogues share one format):
- **Same fields**: `id`, `type` (conceptual / procedural / representational / language / meta),
  `subject`, `domain`, `name`, `description`, `evidence` (observable signs of mastery),
  `assessmentPrompt` (a question for the parent, with `{{name}}`), age range, `standards`.
- **Same link format**: `topicId` depends on `prerequisiteId`, `strength` = `hard` / `soft`,
  plus `reason`.
- **The idea of "evidence"**: every skill lists concrete things you can observe. This fixes
  the "loose definitions" issue found in the Excel (§2.3).
- **Parent-friendly summaries** per subject, domain and age (Marble "clusters").

### 3.3 Subjects

Two levels, as in Marble: **subject → domain**. Every skill belongs to exactly one domain.

| Subject | Domains (examples) | Catalogue |
|---|---|---|
| **Mobility** | Gross motor: head control, sitting, crawling, walking, jumping, hopping, bike | A |
| **Hand skills** | Grasp, stacking, drawing, scissors, handwriting | A, then Marble *Handwriting & Transcription* |
| **Communication** | Understanding, Speaking, Conversation | A, then Marble *Speaking & Listening* |
| **Literacy** | Books & print, Sounds (phonological awareness), Letters, Reading, Writing | A, then Marble *English* (see the language caveat in §3.5) |
| **Mathematics** | Quantities, Counting & cardinality, Shapes, Measurement, then all Marble maths domains | A, then Marble |
| **Thinking & discovery** | Object permanence, cause and effect, sorting, puzzles, then Marble *Science* and *Learning to Learn* | A, then Marble |
| **Personal & social development** | Emotions, Self-regulation, Friendship & cooperation, Empathy (Marble's domain names) | A, then Marble |
| **Autonomy & life skills** | Eating, dressing, toilet, hygiene, then Marble *Money*, *Entrepreneurship* | A, then Marble |
| **History, Computing** | As in Marble | Marble only (ages 6+) |

Subjects and domains are **data** (`catalog/subjects.csv`), so you can rename or reorganise
them without changing code. When a skill touches two subjects (e.g. "counts to 10 aloud" is
maths *and* speaking), it gets one main subject and a **link** expresses the other (§3.6),
so no skill is counted twice.

### 3.4 Extending the timeline beyond 36 months

| Age | Main sources | Nature of the reference |
|---|---|---|
| 0–5 years | CDC / AAP 2022 (up to 5 years), WHO motor study | **Developmental norms** (percentiles) |
| 3–6 years | French *école maternelle* programme (cycle 1, *attendus de fin de cycle*) for items Marble lacks | **Learning goals** |
| 4–13 years | **Marble Skill Taxonomy** (aligned to the UK National Curriculum, Common Core, NGSS, …) | **Learning goals** with age ranges |

After about 4 years, most skills are **learned** (they depend on teaching and exposure) rather
than **maturational**. So each skill has a `kind`:
- `milestone`: developmental norm with percentiles. Scored as "in the window / ahead / to discuss".
- `learning_goal`: curriculum-based, with an age range. Shown as "typical age", **never flagged
  as late**, because it depends on schooling. This covers all Marble topics.
- `behaviour`: an observation such as "stranger anxiety". Logged, never scored.

**Constance is 4 years 7 months today**, so the useful part for her right now is the end of A
plus the 4–7 year part of Marble.

✅ **DECIDED: all 8 Marble subjects** are imported. The app shows only topics whose age range starts ≤ the child's age + 2 years. For Constance (4.6 y)
that means 426 Marble topics (age range starting at 4, 5 or 6), which is manageable, and the list grows as she grows.

### 3.5 Three languages at home (EN / FR / PT)

What research says, and what the app does about it:
- **Multilingual children reach language milestones (first words, combining words) in the same
  age windows as monolingual children, when you count all languages together.** In each
  single language, their vocabulary may be smaller, and that is normal. Mixing languages in
  one sentence is also normal, not a sign of confusion.
- So **speaking and understanding** milestones are logged once, with a tag for which
  language(s) were used. Vocabulary-type items are counted **across all three languages**
  (total conceptual vocabulary).
- **Literacy is language-specific.** Marble's *English* subject (phonics, digraphs, spelling,
  grammar) is built for English. Learning to read French or Portuguese follows different
  sound–letter rules. So literacy skills have a `language` field, and the app lets you track
  reading in each language separately. At first, the "sounds" and "letters" domains in
  French and Portuguese will use our own items, because Marble has no equivalent.
- **Mathematics, science and social skills** are language-neutral and shared.

✅ **DECIDED: school reading is in French**, so the French literacy track is built first
(our own items for sounds and letters, following the French *maternelle* / CP progression).
English uses Marble's items. Portuguese is added later.

### 3.6 Links between skills (dependencies)

Skills form a **directed acyclic graph** (arrows, no loops): an arrow A → B means "B depends
on A". We use Marble's two strengths:

| Strength | Meaning | Example | Effect in the app |
|---|---|---|---|
| **hard** | B practically cannot happen without A | head control → sits without support; one-to-one counting → how many in total | B is not suggested as "up next" before A |
| **soft** | A normally comes first or helps, but it can be skipped or reversed | crawls → walks (some children never crawl); babbling → first words; counting aloud → counting objects | Shown on the map as a dashed line; B can still be suggested |

Rules, checked automatically (§5.5):
- **No cycles.** A skill can never depend on itself, directly or indirectly.
- **Ages must agree.** If B hard-depends on A, A's typical age must not be later than B's.
  If it is, the link or the age is flagged for review.
- **Every link has a `reason`** (as in Marble), so it can be challenged.
- Links may cross subjects and cross catalogues (the bridge links of §3.2).

### 3.7 Licences (private, non-commercial use)

The app is for Constance only. It is not distributed or sold, so the licence obligations are light:

| Source | Licence | What it means for us |
|---|---|---|
| **Marble taxonomy** (database, ODbL 1.0; texts, CC BY-SA 4.0) | Open, commercial use allowed | Private use is fully allowed. Share-alike only applies if we **publish** a modified version of the dataset, which we don't. We still credit Marble in the app's About page (it's good practice, and it's your friends). |
| Marble `curriculum-standards.json` | Each source's own licence | Not needed. We keep only the standard codes that appear in the topics. |
| CDC "Learn the Signs. Act Early." | US government work, public domain | Free to use. We cite it. |
| WHO motor study | Published figures | We cite the source. |
| Denver II | Copyrighted test | Not used, since the CDC and WHO data are enough. |

If you ever want to open it to other families or make it commercial, §3.7 and §6.3 of v0.2
(in git history) list what would change: open-data publishing, GDPR impact assessment, and
medical-device positioning.

---

## 4. Functional description

### 4.1 Screens
1. **Today** (home, for the selected child)
   - Age in years, months and days, plus corrected age if born premature (until 2 years).
   - **"Up next"**: 3 to 5 skills to work on now, with activities (§5.6 explains how they are chosen).
   - A big **"+ Log a skill"** button, with search and the child's language tags.
2. **Skills** (catalogue): browse by subject → domain → skill. Each skill shows its
   description, evidence, parent question, typical age, source, prerequisites and what it
   unlocks, activities, and the child's history.
3. **Skill map** (graph visualisation, new):
   - **Focus view** (default): pick a skill and see its prerequisites (upstream) and what
     it unlocks (downstream), 2 levels each way. Nodes are coloured by status
     (achieved / emerging / ready / not yet), solid arrows are hard links, dashed are soft.
   - **Subject view**: one subject laid out left to right **by typical age**, in rows by domain.
     You can see where the child's "frontier" is.
   - **Whole map**: all ~1,900 skills as a zoomable network, coloured by subject, with the
     child's achieved skills lit up (similar in spirit to Marble's 3D view).
4. **Progress** (dashboards): chart A (cumulative curve vs normal band, §5.1) for `milestone`
   skills, chart B (developmental age per subject, §5.2), chart C (share of the child's
   current-age skills achieved per subject, for `learning_goal` skills).
5. **Journal**: dated notes and photos, linked to skills.
6. **Alerts**: milestones past p90 and not achieved, and any lost skill (regression).
7. **Family & settings**: children, caregivers and invitations, languages at home, interface
   language, export / delete all data.

### 4.2 Status logic per skill
Let *t* be the child's age (corrected if premature, until 24 months).

For **milestones** (percentiles known):

| Situation | Label | Colour |
|---|---|---|
| Achieved at age *a* < p25 | Early | blue |
| Achieved at p25 ≤ *a* ≤ p90 | In the normal window | green |
| Achieved at *a* > p90 | Later than most (achieved) | grey |
| Not achieved, *t* < p25 | Not expected yet | none |
| Not achieved, p25 ≤ *t* ≤ p90 | In its window | yellow |
| Not achieved, *t* > p90 | Worth discussing with the pediatrician | orange |
| Marked as lost | Regression: discuss soon | red |

For **learning goals** (Marble and school items): *Not yet*, *Ready* (all hard prerequisites
achieved), *Emerging*, *Achieved*. There is no "late" label.

**Implied skills:** if a child has achieved B, every prerequisite of B (hard and soft,
transitively) is shown as "probably achieved" (lighter colour) unless recorded otherwise.
*(Changed during the build: with hard links only, too many early skills stayed unmarked.)*

**Not logged:** a milestone more than 12 months past its p90 that nobody logged is shown as
"not logged (probably acquired long ago)" instead of being flagged, unless the family
explicitly recorded "not yet". Without this, a history that stops (like the Excel at
29 months) produces dozens of false alerts. This matters for onboarding:
for a 4½-year-old like Constance, you tick a few advanced skills and the app fills in the
hundreds of earlier ones, which you can then correct.

### 4.3 Out of scope for v1 (can add later)
Growth curves (WHO), sleep and feeding logs, vaccination record, AI-generated activity
suggestions, a public social feed or profiles, and school or teacher accounts.

✅ **DECIDED:** list confirmed.

---

## 5. The maths (computations)

### 5.1 Cumulative curve with a normal band (improved Excel chart)
Milestones only. For each age *t* (step 0.25 month):
- **Child:** `C(t)` = number of milestones achieved by age *t* (the Excel's `COUNTIF`).
- **Expected:** `E(t) = Σ_i F_i(t)`, where `F_i` is milestone *i*'s CDF, interpolated
  linearly between its percentile points.
- **Band:** `E(t) ± 1.28·√V(t)` with `V(t) = Σ_i F_i(t)(1 − F_i(t))` (about the 10th to
  90th percentile if milestones were independent). They are positively correlated, so the
  real band is wider. It is labelled "approximate" and can be calibrated by simulation later.

### 5.2 Developmental age and developmental quotient (per subject)
For subject *s*, the developmental age `t*` solves `E_s(t*) = C_s(today)`. We solve it by
bisection, since `E_s` only increases. `DQ_s = 100 × t* / age`, where 100 means typical.
It is shown with a range, not as a precise score. Computed only where enough `milestone`
items exist.

### 5.3 Percentile of each achievement
Achieved at age *a* → percentile `F_i(a) × 100`. Example: walking alone at 10 months is
about the 15th–20th percentile (earlier than roughly 80% of children).

### 5.4 Corrected age
Born before 37 weeks: `corrected age = age − (40 − gestational weeks)`, used until 24 months.

### 5.5 Graph checks (run on every catalogue change, in tests)
- **Cycle detection and ordering:** Kahn's topological sort, O(V + E). About 1,900 nodes and
  3,500 edges take milliseconds. If the sort cannot finish, there is a cycle, and it is reported.
- **Age consistency:** for each hard edge A → B, `typical_age(A) ≤ typical_age(B)` + tolerance,
  where typical age = p50, or `ageRangeStart` for Marble items.
- **Transitive reduction for display:** if A → B → C and A → C, the direct A → C arrow is
  hidden on the map (the dependency is still used). This keeps the drawings readable.
- **Orphans:** skills with no link at all are listed for review.

### 5.6 Choosing "Up next" (the frontier)
Candidates are skills that are not achieved, have **all hard prerequisites achieved or
implied**, and have a typical age ≤ age + 6 months (milestones) or `ageRangeStart` ≤ age
(learning goals). Candidates are ranked by:
1. **Unlock value**: how many skills it opens downstream (number of descendants in the graph;
   Marble's `centrality` is used as a tie-breaker).
2. **Timeliness**: milestones close to their p75 come first.
3. **Balance**: at most 2 per subject, so suggestions cover several areas.

It is a simple, explainable scoring. Each suggestion says *why* ("unlocks 12 skills in
mathematics").

---

## 6. Architecture (simple and sound)

### 6.1 Principles
1. **Content separate from code.** The catalogue (subjects, skills, links, translations) is
   plain data files in the repo, validated by tests.
2. **Computations are pure functions** (§5), unit tested, in one module.
3. **Few moving parts.** One web app, one managed database, no custom servers.
4. **Private**: no public sign-up. Only invited family members can log in.

### 6.2 Recommended stack
| Layer | Choice | Why |
|---|---|---|
| App | **PWA** (web app installable on phones) in React + TypeScript (Vite) | One code base for iPhone, Android and computer. No App Store fees or review at first. |
| Translations | i18next (FR / EN / PT) | Standard, simple |
| Charts | Recharts | Simple |
| Skill map | **React Flow + dagre layout** (focus and subject views); **react-force-graph** (whole map, canvas) | React Flow handles readable diagrams of up to a few hundred nodes; canvas is needed to draw ~1,800 nodes smoothly |
| Database + login + photos | **Supabase** (PostgreSQL, authentication, storage), **EU region** | Login, database and photo storage in one service; access restricted to invited family members |
| Hosting | **Vercel** | Deploys automatically from GitHub |
| Tests | Vitest | Maths and graph checks |

**Expected cost:** **€0/month**. One family fits easily within the free tiers of Supabase
(500 MB database, 1 GB photo storage) and Vercel. The only caveat: a free Supabase project
**pauses after 7 days without use** and has no automatic backups. So we add a weekly
automatic export (a small scheduled job, also free). Optional: Supabase Pro at €25/month
for daily backups, and a custom domain (~€10/year). Neither is needed.

```
 Family phones / laptops (PWA, FR/EN/PT)            Cloud (managed)
 ┌──────────────────────────────────┐        ┌─────────────────────────────────┐
 │ Today · Skills · Skill map ·     │        │ Supabase (EU)                   │
 │ Progress · Journal               │ HTTPS  │  Auth: invited family only      │
 │ Logic: status, curves, DQ,   ◄───┼────────┼─► Postgres: child,             │
 │        graph, "up next"          │        │    observations, journal        │
 │ Catalogue (bundled, versioned)   │        │    (row-level security)         │
 └──────────────────────────────────┘        │  Storage: photos (private)      │
          ▲ built & deployed by Vercel       └─────────────────────────────────┘
            from GitHub
```

The catalogue (~2 MB of JSON, less compressed) ships **inside the app**. So browsing and the
skill map work offline and fast, and the database only stores what the family records.

### 6.3 Access and privacy (private family app)
- **Who can log in:** you create the accounts. Parents are editors. Grandparents or the
  nanny can be invited as viewers or editors. There is no public sign-up page.
- **Isolation:** PostgreSQL row-level security. Even with the app's web address, nobody
  outside the family can read anything.
- **Optional read-only share link** (e.g. for the pediatrician). Off by default, revocable, expires.
- **Photos:** private storage, displayed through short-lived links.
- **GDPR:** a family keeping its own records is covered by the "household" exemption, so no
  formal compliance work is needed. We still use EU hosting, no trackers, and keep an export
  and delete-all button.
- **Tone:** it stays a parenting tool, not a diagnosis ("typical ages", "worth discussing
  with your pediatrician").

### 6.4 Data model

```
Catalogue (versioned files, not user data)
  Subject        id, name{fr,en,pt}, order, colour
  Domain         id, subject_id, name{fr,en,pt}
  Skill          id, domain_id, kind (milestone | learning_goal | behaviour),
                 type (conceptual | procedural | representational | language | meta),
                 name, description, evidence[], assessment_prompt, activities[],
                 p25, p50, p75, p90 (months, milestones only),
                 age_start, age_end (years, learning goals),
                 literacy_language (en | fr | pt | null), source, source_ref,
                 origin (own | marble), marble_id, centrality
  Dependency     skill_id, prerequisite_id, strength (hard | soft), reason, origin
  Translation    entity_id, field, locale (fr | en | pt), text, status (machine | reviewed)

User data (Supabase, per family)
  Family         id, name, created_at
  Member         family_id, user_id, role (owner | editor | viewer)
  Child          id, family_id, first_name, birth_date, gestational_weeks, home_languages[]
  Observation    id, child_id, skill_id, status (not_yet | emerging | achieved | lost),
                 observed_on, languages[], note, photo_path, logged_by, created_at
  JournalEntry   id, child_id, date, text, photo_path, skill_ids[]
  ShareLink      id, child_id, token, expires_at, revoked
```

Notes:
- Every observation is kept (full history), which allows regression detection and "emerging → achieved" timelines.
- `catalog_version` is stored with each observation, so later catalogue changes never corrupt history.
- Marble IDs (`mt_…`) are kept as they are, so we can pull new Marble versions and send
  improvements back.

### 6.5 Interface languages (FR / EN / PT)
- **Interface text**: i18next files `locales/{fr,en,pt}.json`. The language is detected from
  the phone and can be changed in settings.
- **Catalogue text**: source text is English (Marble is English). FR and PT are machine-
  translated first and marked `machine`, then reviewed by a native speaker and marked
  `reviewed`. If a translation is missing, the English text is shown.
- **Volume to translate:** about 1,900 skills × (name, description, evidence, prompt) ≈ 160,000
  words per language for Marble alone. Machine translation plus human review of the **4–7 year** range first
  (~430 Marble topics + our 3–5 y items) keeps this manageable.

✅ **DECIDED: European Portuguese (pt-PT).**

### 6.6 Repository layout
```
/catalog/subjects.csv            subjects & domains
/catalog/early/skills.csv        catalogue A (our 0–5 milestones)
/catalog/early/links.csv         links within A + bridges to Marble
/catalog/marble/                 pinned copy of Marble v1 (topics, dependencies, clusters)
/catalog/translations/{fr,pt}/   catalogue translations
/catalog/SOURCES.md              citations and licence notices (incl. Marble attribution)
/src/domain/                     pure logic: age, status, curves, DQ, graph, up-next (+ tests)
/src/ui/                         screens, skill map, charts
/locales/{fr,en,pt}.json         interface text
/supabase/schema.sql             tables + row-level security policies
/scripts/build-catalog.ts        merge A + Marble, validate graph, emit app JSON
/scripts/import-excel.ts         one-off migration of BabyPerfMGT.xlsx
APP_SPEC.md                      this document
```

---

## 7. Migrating the Excel data (Constance)
1. Build catalogue A from CDC / WHO, then map the 135 Excel rows to it (merging duplicates;
   items with no scientific equivalent kept as `behaviour` or dropped, your call).
2. Import Constance's months as observations dated `4 Feb 2022 + m months`, marked
   "approximate date (imported)".
3. Because the Excel stops at 29 months and she is now 55.9 months old, run an **onboarding
   pass**: you tick what she can do today among the 3–5 year milestones and the Marble 4–6
   topics, and the implied-skills rule (§4.2) fills in the rest.
4. I will give you the **mapping table to review** first, including the two early motor
   entries flagged in §2.3.

---

## 8. Build plan (proposed)

| Step | Deliverable | Rough effort |
|---|---|---|
| 1 | Catalogue A (0–5 y, sourced, with evidence) + bridge links to Marble + Excel mapping, **for your review** | 1–2 sessions |
| 2 | Catalogue build script: merge with Marble, graph checks (§5.5), tests | 1 session |
| 3 | Pure logic (§5) + tests, validated against the Excel numbers | 1 session |
| 4 | App v1: family login, Today, Skills, logging, FR/EN/PT interface | 2 sessions |
| 5 | Skill map (focus + subject views), Progress charts, import Constance | 1–2 sessions |
| 6 | Whole map, journal and photos, share link, weekly export, PWA install on your phones | 1–2 sessions |
| 7 | FR / PT review of the 4–7 year content by a native speaker (can be you) | outside coding |

We validate with you after steps 1, 4 and 5.

---

## 9. Risks and safeguards
- **Anxiety from comparisons:** show windows, not rankings. No "late" labels for learning
  goals. Flags always come with "discuss with your pediatrician".
- **Reference data quality:** every skill shows its source, and every link shows its reason.
  Graph checks run in tests.
- **Privacy:** invitation-only access, EU hosting, row-level security, no trackers.
- **Licences:** private use only; Marble credited (§3.7). Denver II not used.
- **English-centric learning content:** literacy tracked per language. FR / PT reviewed by native speakers.
- **Data loss:** weekly automatic export (free tier has no backups), plus manual export.

---

## 10. Decisions

| Question | Your answer |
|---|---|
| Birth date | **4 February 2022** (confirmed), so 4 y 7 m today |
| Languages at home | English, French, Portuguese (§3.5) |
| Sync | Shared online across family devices, invitation only (§6.3) |
| Use | **Private, non-commercial, for Constance only** (§3.7) |
| Interface | FR / EN / PT (§6.5) |
| Subjects, timeline beyond 36 m, dependencies + visualisation | Included (§3.2–3.6, §4.1, §5.5–5.6), inspired by the Marble taxonomy |
| Marble subjects | All 8, filtered by age (§3.4) |
| School reading language | French: its literacy track comes first (§3.5) |
| Out-of-scope list for v1 | Confirmed (§4.3) |
| Portuguese variant | European, pt-PT (§6.5) |
| Premature birth | No, so corrected age is not used for Constance (the field stays optional) |

No decisions are open. Next is **build step 1** (§8): catalogue A, the bridge links to
Marble, and the Excel mapping table, for your review.

---

## 11. Implementation notes (v1.0 build)
- **Status:** the app is built. See `BUILD_PROGRESS.md` and `README.md` (setup, deployment, catalogue editing).
- **Storage:** without Supabase settings, the app stores data in the browser (IndexedDB). With
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, it uses the shared online database. Sign-in is
  by email code, invitation only. The schema's access rules were tested on PostgreSQL with Supabase
  stubs: owner, editor, viewer (read only), stranger (no access), share link (valid, revoked).
- **Estimated percentiles:** for CDC items, `p25 = 0.75·p75`, `p50 = 0.87·p75`, `p90 = 1.15·p75`
  (typical spread of Denver-type norms); WHO windows use a normal approximation. All estimates are
  labelled in the app.
- **Catalogue A:** 230 skills (CDC 2022, CDC 2004–2021, WHO, maternelle, CP, Clements & Sarama, AAP)
  in EN / FR / PT, with 265 links, 48 of them bridges into Marble.
- **Translations:** all our texts and the interface are in 3 languages. Marble skill names for ages ≤ 6
  (426) and all domain names are machine-drafted in FR / PT (`status = draft`); descriptions and
  evidence of Marble skills are shown in English for now.
- **Subject map:** layered layout (prerequisites before dependents), limited to the 60 skills closest to
  the child's age for readability. The focus view shows 2 levels upstream and the 10 closest dependents.
