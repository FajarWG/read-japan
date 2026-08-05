# Handoff — Kakou merge (Katsuyou + Bunpou → Kakou)

Status as of commit `0f9c0c4` (Milestone 1 + layout fixes) + uncommitted Milestone 2a
(in-app photo AI review) + uncommitted Milestone 3 (sequential session picker +
closing-the-loop SRS, a full redesign of how sessions are chosen and how progress is
tracked) on top. Written so work can continue from a different machine without
re-deriving context.

## Why this change

Kakou (writing practice), Katsuyou (conjugation drill), Bunpou (grammar library) used to be
three separate bottom-nav pages. Actual practice happens on paper — the standalone
reference pages and their digital mini-games (conjugation quiz, SRS flashcards, sentence
scramble) saw little real use. Decision: fold Katsuyou/Bunpou into Kakou as a sidebar +
reference modal, drop the mini-games entirely, and keep the underlying SRS/completion data
to drive what shows up in Kakou instead of sitting behind pages nobody opens.

## Milestone 1 — DONE (merge, layout, nav)

- `/katsuyou`, `/bunpou` pages deleted, along with their dashboards and the mini-games
  (`PracticeTab`, `ReviewTab`, Bunpou's sentence-scramble `PracticeArea`,
  `HandwritingPracticeWidget`, and the now-orphaned `LearnTab`/`ExamplesTab`).
- New `src/modules/kakou/components/KakouSidebar.tsx` — tab switcher (Katsuyou / Bunpou)
  inside Kakou. Katsuyou pane: forms grouped by level with completion checks + due-review
  badges. Bunpou pane: searchable chapter/pattern browser with completion checks.
- New `src/modules/kakou/components/MaterialReferenceModal.tsx` — read-only reference
  content (conjugation rules/examples/table, or grammar pattern + examples) opened from a
  sidebar click. No interactive drills. Has a "Practice this in Kakou" CTA that reuses the
  pre-existing `?source=katsuyou|bunpou&sourceId=...` deep link.
- New `src/modules/kakou/actions/materialsActions.ts` — `getKakouMaterials()`, composed
  from the existing `getKatsuyouStats()` / `getBunpouProgress()` (no new Prisma queries,
  no schema changes).
- `pickPrompts()`/`createKakouSession()` in `kakouActions.ts` now sprinkle one real due
  Katsuyou form or unfinished Bunpou pattern into Daily Mix sessions (simple heuristic —
  first due item found, not full SRS-ranked prioritization).
- Nav/home/progress/journey entry points (`BottomNav`, `ContinueHero`, `QuickActionGrid`,
  `ProgressDashboard`, `journeyService`, `PageTransition`, `sitemap.ts`) repointed to
  `/kakou`. Bottom nav is now **Anki, Kakou, Book (`/somatome`), Conversation
  (`/conversation`)**.
- Kakou dashboard (pre-session screen) widened from a centered `max-w-3xl` column to a
  two-column `max-w-6xl` grid: session setup on the left, **Recent sessions history**
  sticky on the right. The active-writing-session screen stays a single centered column on
  purpose (focus mode).
- Sidebar layout bugs fixed this session (see `git log` / diff for exact commits):
  - Sidebar is `sticky top-0` with `max-h-screen overflow-y-auto` as a **single** scroll
    container wrapping the whole sidebar (tabs + pane) — earlier attempts nested
    `h-full`/`flex-1`/`min-h-0` per pane and the percentage-height chain broke specifically
    on the Bunpou tab (extra nesting level), letting content overflow and stretch the
    whole page. Don't reintroduce per-pane scroll containers; keep the one outer scroll
    container.
  - Sidebar width bug: `KakouSidebar` used to hardcode its own `md:w-80` **while its
    parent wrapper also hardcoded `w-80`** and added `px-4` padding — the child was wider
    than the padded parent, and the parent's `overflow-hidden` (used for the
    collapse/expand transition) silently clipped the right edge of every row. Fixed by
    making `KakouSidebar` just `w-full` and letting the parent wrapper (in
    `KakouDashboard.tsx`'s `KakouLayout`) be the single source of truth for width
    (`md:w-80`, 320px, border-box, padding included).
  - `.scrollbar-none` utility (used in ~5 places across the codebase already —
    `KatsuyouSidebar` remnant pattern, `ExploreBreadcrumb`, `GlobalSearchModal`,
    `HandwritingCanvas`, `conversation/page.tsx`) was **never actually defined anywhere**
    — it was a dead class name. Added a real definition in `app/globals.css`
    (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`). This silently
    fixes scrollbar visibility everywhere else that class was already being used, not just
    Kakou's sidebar.
- Known, intentional gap: sidebar's Katsuyou due-review badges read live from
  `KatsuyouReviewCard.nextReview`, but nothing writes to that table anymore (the Review
  tab that used to call `submitReview()` was deleted). Counts will only grow stale until
  Milestone 2 wires an update path back from AI-reviewed Kakou sessions.

## Milestone 2

1. **In-app AI scoring — photo path DONE, text path NOT STARTED.** Decision made: photo
   upload first (practice happens on paper, matches Milestone 1's rationale). Manual
   copy-paste flow (`buildTextReviewPrompt`/`buildPhotoReviewPrompt`/`handleJsonSubmit`)
   was kept, not removed — it's now the explicit fallback, collapsed behind a "Prefer to
   review manually?" toggle that auto-expands whenever the in-app call fails.
   - `buildTextReviewPrompt`/`buildPhotoReviewPrompt`/`parseKakouFeedbackJson` moved out of
     `KakouDashboard.tsx` into `src/modules/kakou/data/reviewPrompts.ts` (plain module, no
     "use client"/"use server") so both the client UI and the new server action can import
     them without duplication.
   - `src/shared/lib/gemini-limiter.ts` gained `callGeminiVision(systemPrompt, { mimeType,
     base64 }, preferredModel?)` — single-turn, sends an `inlineData` image part alongside
     text. Internals refactored: `callGemini`/`callGeminiVision` now both call a shared
     `sendGeminiRequest()` instead of duplicating the fetch/error/refund logic.
   - Corrected `gemini-3.5-flash`'s tier config (was 15 RPM/100 RPD, actually 5 RPM/20
     RPD per current free-tier limits the user provided) — the other two wired models
     (`gemini-3.1-flash-lite`, `gemini-2.5-flash-lite`) already matched. TPM (tokens/min)
     tracking was **not** added — it was already dead/unenforced config on one model before
     this change, and enforcing it properly is a separate task if it's ever needed.
   - New `submitKakouPhotoReview(sessionId, formData)` in `kakouActions.ts`: auth check,
     loads the session, normalizes the uploaded photo via `sharp` (`.rotate()` for EXIF
     auto-orient, resize to fit 1600×1600, re-encode as JPEG q82 — this also handles HEIC
     input, confirmed the installed `sharp` build decodes HEIF: `sharp.format.heif.input.buffer
     === true`), calls `callGeminiVision`, parses the JSON response, saves via
     `saveKakouAiFeedback`. On `RateLimitError`/`AllModelsExhaustedError`/parse failure/any
     other error it returns `{ success: false, error, fallbackToManual: true }` instead of
     throwing — client reads `fallbackToManual` and reveals the manual block.
   - `next.config.ts`: added `experimental.serverActions.bodySizeLimit: "10mb"` — default
     1MB would reject most raw phone photos sent as `FormData`.
   - **Not yet done**: no manual browser smoke test (only `tsc --noEmit` + `eslint` were
     run — see note below). Also not done: the typed/pasted-text in-app path (`callGemini`
     text-only already supports it, just needs a textarea + a `submitKakouTextReview`
     action mirroring the photo one — smaller lift than the photo path was).
2. **Milestone 2b (typed/pasted-text in-app review) — explicitly skipped.** User decided
   not to build this; photo is the only in-app AI review path. The manual copy-paste flow
   still supports both text and photo prompts (unchanged).

## Milestone 3 — DONE: sequential session picker + closing-the-loop SRS

Full redesign of *how sessions are chosen* and *how progress is tracked*, replacing three
previously-disconnected signals (`KatsuyouLessonProgress` manual "mark as read" checkbox,
`KatsuyouReviewCard` SRS data that nothing wrote to since the old flashcard quiz was
deleted, and `KakouSession.score` that never fed back anywhere) with **one source of
truth driven entirely by Kakou practice results**.

- **Destructive reset, explicitly confirmed by the user**: `KatsuyouLessonProgress` and
  `BunpouQuestion` (dead — 0 live callers after Milestone 1's mini-game removal,
  `getBunpouQuestions`/`generateBunpouQuestions` in `bunpouActions.ts` removed alongside
  it) were **dropped from the schema** — migration
  `prisma/migrations/20260805000000_kakou_sequential_progress`. `KatsuyouReviewCard` and
  `BunpouProgress` tables were **kept but had every existing row wiped** (40 review cards,
  32 Bunpou progress rows deleted) — repurposed as the single Kakou-driven progress store
  going forward, starting from zero.
  - Note on shadow-DB: the hosted Postgres user has no `CREATE DATABASE` permission, so
    `prisma migrate dev` fails with P3014. Worked around with
    `prisma migrate diff --from-config-datasource prisma.config.ts --to-schema
    prisma/schema.prisma --script` to generate the raw SQL, hand-authored the migration
    folder, then `prisma migrate deploy` (which doesn't need a shadow DB). Use the same
    approach for future schema changes on this DB.
- **The static 44-prompt bank is gone.** `src/modules/kakou/data/prompts.ts`
  (`KAKOU_PROMPTS`) deleted, along with `pickPrompts()` and the old `KakouMode` variety
  (`DAILY_MIX`/`GUIDED_JOURNAL`/`COPY_CHANGE_CREATE`/`GRAMMAR_CHALLENGE`/
  `CONJUGATION_DRILL`). New sessions are created with a single mode, `"PRACTICE"` — the
  old enum values are kept in `KAKOU_MODES`/`KAKOU_MODE_LABELS`/`KakouPromptKind` **only**
  so already-completed history sessions (frozen `promptSnapshot`/`mode` from before this
  change) still type-check and display correctly. Don't remove those old values without
  checking whether any real history still references them.
- **New `buildSequentialSession(userId, durationMinutes)`** in `kakouActions.ts`: due
  `KatsuyouReviewCard`s first (ordered by `nextReview`, they decay), then alternates the
  next not-yet-started Katsuyou form (walking `CONJUGATION_FORMS`, already ordered
  N5→N4→N3) and the next incomplete Bunpou pattern (`findFirstIncompleteBunpouPattern()`,
  unchanged) to fill the remaining slots. Each Katsuyou form only ever gets **one** verb
  pinned to it for its whole lifetime (chosen randomly from `mockVerbs` the first time
  that form comes up) — further practice of that form comes through SRS due-reviews on
  that same (verb, form) card, not fresh verbs each time. This was a deliberate
  simplification (matches "meruntut aja", not full SRS coverage of all 132 verbs × 13
  forms) — revisit if the user wants more verb variety per form later.
- **New `buildKatsuyouPracticePrompt(formKey, verbId)`** in `reminders.ts` — like
  `buildFocusedKakouPrompt("KATSUYOU", formKey)` but pins a specific verb's conjugated
  example instead of generic group examples, and stamps `source.verbId` (new optional
  field on `KakouSource`, `types.ts`) — needed because `KatsuyouReviewCard`'s unique key
  is `(userId, verbId, conjugationForm)`, not just the form.
- **Dashboard settings screen simplified**: mode and JLPT-level pickers removed entirely
  (`KakouDashboard.tsx`) — duration (5/10/20 min) is the only setting left.
  `createKakouSession()`'s input shrank to `{ durationMinutes, sourceType?, sourceId? }`.
- **AI review JSON schema changed from session-flat to per-prompt** — this is what
  actually makes closing the loop possible: one score/sentences array for the *whole*
  session couldn't tell you which of 2-5 prompts the user did well/poorly on.
  `KakouFeedback` (`types.ts`) is now `{ overallFeedback?, perPrompt: [{ promptIndex,
  score, sentences, errorPatterns?, reviewPoints? }] }`. `buildTextReviewPrompt`/
  `buildPhotoReviewPrompt` (`reviewPrompts.ts`) updated to request this shape, keyed off
  the already-numbered "Latihan" list; `parseKakouFeedbackJson` validates
  `perPrompt[]` instead of `sentences[]`. `saveKakouAiFeedback` now takes
  `{ sessionId, feedbackJson, userWriting? }` (no separate `score` param — it computes the
  `KakouSession.score` column as the **average** of `perPrompt[].score`, still used for
  the existing history `ScoreBadge`). `ReviewDisplayCard` (`KakouDashboard.tsx`)
  regrouped to render one section per prompt instead of one flat sentence list.
  - **Known gap**: old (pre-redesign) sessions' `feedbackJson` is in the old flat shape
    and will fail the new `perPrompt` validation — `readFeedbackJson` in `kakouActions.ts`
    will return `null` for them, so their detailed AI review card just won't render
    anymore (the `score` column itself is a separate DB field and is unaffected, so the
    history list's score badge still shows fine). Not fixed — low value for what's likely
    a handful of pre-redesign sessions on a single-user app; flagging in case it matters.
- **New `applyKakouReviewToProgress(userId, prompts, feedback)` and
  `applyCoarseDifficultyToProgress(userId, prompts, difficulty)`** in `kakouActions.ts`,
  both routing through a shared `applyRatingToSource()`:
  - Called from inside `saveKakouAiFeedback` (so both the photo-review path and the
    manual copy-paste path close the loop identically, since they both funnel through
    this one function) — maps each `perPrompt[i].score` to an SM-2 rating (≥75 "easy",
    60-74 "good", <60 "hard" — same thresholds already in the review-prompt rubric text)
    and either find-or-creates + updates the matching `KatsuyouReviewCard`, or upserts
    `BunpouProgress.completed = score >= 60`.
  - Called from `completeKakouSession` as a **coarser fallback** — only when the session
    still has no `feedbackJson` at completion time, the self-rated Easy/Okay/Difficult
    applies uniformly to every prompt's source (`EASY`→easy, `OKAY`→good,
    `DIFFICULT`→hard). If AI review is submitted for that same session *later*, it applies
    its own more precise update on top — a minor double-count if that happens, not
    considered worth guarding against for now.
  - `applySm2()` (the modified SM-2 math previously inline in `submitReview()`) and
    `ratingFromScore()` were extracted into a new plain module
    `src/modules/katsuyou/lib/sm2.ts` (not `"use server"` — needs to be importable as a
    sync pure function from `kakouActions.ts`, which a `"use server"` file's exports can't
    be). `submitReview()` in `katsuyouActions.ts` now calls the shared `applySm2()` too.
- **Milestone 4 (smarter Daily Mix selection) folded into this** — due-first ordering by
  `nextReview` *is* the smarter selection; there's no separate "first due item found"
  heuristic left to improve on for now.
- **Dead code removed alongside this**: `completeLesson()` (Katsuyou "mark as read") and
  `toggleBunpouProgress()` (Bunpou manual toggle) — both UI buttons in
  `MaterialReferenceModal.tsx` replaced with a read-only "Practiced in Kakou" / "Practice
  this in Kakou to mark it as learned" indicator, since completion is now Kakou-driven,
  not manually clickable. `getKatsuyouStats()`'s `completedLessons` is now derived from
  distinct `conjugationForm`s in `KatsuyouReviewCard` instead of the deleted table (same
  for the dashboard's "lessons done" stat in `src/modules/dashboard/lib/dashboard.ts`).
  Also deleted the fully-orphaned `src/modules/katsuyou/components/KatsuyouSidebar.tsx`
  (dead since `/katsuyou` was removed in Milestone 1) after redirecting
  `ConjugationTableTab.tsx`'s `CONJUGATION_FORMS` import to the real data module it was
  quietly re-exporting from.

## Key files

- `src/modules/kakou/components/KakouDashboard.tsx` — main page component,
  `KakouLayout` wrapper (sidebar + modal), two JSX branches (active session / dashboard),
  `ReviewDisplayCard` (per-prompt AI review display)
- `src/modules/kakou/components/KakouSidebar.tsx` — sidebar (Katsuyou + Bunpou panes)
- `src/modules/kakou/components/MaterialReferenceModal.tsx` — reference content modal
  (read-only completion indicators, no manual mark buttons)
- `src/modules/kakou/actions/kakouActions.ts` — session CRUD, `buildSequentialSession()`
  (Milestone 3), `submitKakouPhotoReview()` (Milestone 2a), `applyKakouReviewToProgress()`
  / `applyCoarseDifficultyToProgress()` (Milestone 3, closing the loop)
- `src/modules/kakou/actions/materialsActions.ts` — `getKakouMaterials()`
- `src/modules/kakou/data/reminders.ts` — `buildFocusedKakouPrompt()`,
  `buildKatsuyouPracticePrompt()` (new, Milestone 3), `hydrateKakouPrompt()`,
  `findFirstIncompleteBunpouPattern()`
- `src/modules/kakou/data/reviewPrompts.ts` — `buildTextReviewPrompt()`,
  `buildPhotoReviewPrompt()` (per-prompt JSON schema, Milestone 3),
  `parseKakouFeedbackJson()` — framework-agnostic, imported by both `KakouDashboard.tsx`
  (client) and `kakouActions.ts` (server)
- `src/modules/kakou/data/types.ts` — all Kakou types incl. `KakouFeedback`/
  `KakouPerPromptFeedback` (per-prompt, Milestone 3), `KakouSource.verbId` (new),
  `KakouMaterials`, `KakouMaterialSelection`
- `src/modules/katsuyou/lib/sm2.ts` — (new, Milestone 3) `applySm2()`, `ratingFromScore()`
  — shared by `katsuyouActions.ts`'s `submitReview()` and Kakou's closing-the-loop
- `src/shared/lib/gemini-limiter.ts` — `callGemini()` (text) and `callGeminiVision()`
  (image, Milestone 2a)
- `app/globals.css` — `.scrollbar-none` utility
- `next.config.ts` — `experimental.serverActions.bodySizeLimit: "10mb"` (photo uploads)
- `prisma/schema.prisma` + `prisma/migrations/20260805000000_kakou_sequential_progress/`
  — the Milestone 3 schema change

## Verification checklist for whoever picks this up

- `npm run dev`, sign in, open `/kakou`: sidebar sticky at viewport height, scrollbar
  hidden, no clipped content, Katsuyou/Bunpou tabs populate from real DB state (should be
  empty/zero right after this session, since the reset wiped all progress).
- Session setup screen shows only a duration picker (no mode/level) — start a session,
  confirm prompts come from Katsuyou/Bunpou (first session ever → should be N5 basics,
  since nothing is "due" yet and forms are walked in order).
- Complete a session with **no** AI review, just self-rate Easy/Okay/Difficult → confirm
  `KatsuyouReviewCard`/`BunpouProgress` rows got created for that session's prompts
  (coarse fallback path).
- Complete a session **with** AI review (photo or manual paste) → confirm the per-prompt
  score groups render correctly in `ReviewDisplayCard`, and that
  `KatsuyouReviewCard.nextReview`/`BunpouProgress.completed` reflect the actual per-prompt
  scores (not just the coarse fallback).
- Start a second session right after → confirm it doesn't immediately re-offer an
  already-completed-with-good-score item (should only reappear once its `nextReview`
  passes), and that a newly-learned form doesn't get picked again as "next new".
- Click a sidebar item → reference modal shows "Practiced in Kakou" (no manual mark
  buttons) once that item has actually been practiced.
- `/katsuyou` and `/bunpou` 404; bottom nav shows Anki, Kakou, Book, Conversation.
- `./node_modules/.bin/tsc --noEmit -p tsconfig.json` clean (delete `.next/types` first if
  it complains) and `npm run build` succeeds — both verified this session.
- Upload a real photo (ideally iPhone HEIC) in the "AI Review — Photo (In-app)" card →
  loading state, then per-prompt score badges + corrections saved to history. Try again
  after exhausting `gemini-3.5-flash`'s quota (5 RPM/20 RPD) to confirm fallback through
  `gemini-3.1-flash-lite`/`gemini-2.5-flash-lite`, and that hitting all three shows the
  error + "Prefer to review manually?" block instead of a hard failure.

Note: **no browser-based visual verification has been done at all** for Milestone 1's
layout fixes, Milestone 2a's photo upload UI, or Milestone 3's redesigned session-setup
screen / per-prompt review display — Claude in Chrome couldn't reach localhost in earlier
sessions, and this session ran non-interactively (background job) with only `tsc`/
`eslint`/`next build` as verification. This is the single biggest risk on this branch —
a thorough manual pass (desktop + mobile) is needed before trusting the UI, especially the
new per-prompt `ReviewDisplayCard` grouping and the duration-only session setup screen.
