# Handoff — Kakou merge (Katsuyou + Bunpou → Kakou)

Status as of commit `e594dcb` + uncommitted layout fixes on top (this session commits them too).
Written so work can continue from a different machine without re-deriving context.

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

## Milestone 2 — NOT STARTED (planned, not built)

1. **In-app AI scoring.** Kakou's scoring today is 100% manual: app builds a big prompt
   (`buildTextReviewPrompt`/`buildPhotoReviewPrompt` in `KakouDashboard.tsx`), user copies
   it to an external ChatGPT/Claude/Gemini, then pastes the JSON response back
   (`handleJsonSubmit` → `saveKakouAiFeedback`). Plan: replace with an in-app call to
   Gemini, reusing the exact pattern Bunpou's old question-generator used —
   `callGemini(systemPrompt, history, userMessage)` from
   `src/shared/lib/gemini-limiter.ts` (handles model fallback + rate limiting across
   `gemini-3.5-flash` → `gemini-3.1-flash-lite` → `gemini-2.5-flash-lite`, auth via
   `GEMINI_API_KEY` env var).
   - **User explicitly wants a fallback**: because the Gemini key is on the free tier,
     when the in-app call fails/is rate-limited, fall back to the existing manual
     copy-paste flow rather than erroring out. Don't remove
     `buildTextReviewPrompt`/`buildPhotoReviewPrompt`/`handleJsonSubmit` — keep them as the
     fallback path.
   - Needs deciding: does the user type/paste what they wrote, or upload a photo of
     handwriting (Gemini vision)? `buildPhotoReviewPrompt` already exists for the photo
     case, but no UI currently captures a photo upload — that'd be new.
2. **Close the loop: SRS auto-update from AI review.** Once in-app scoring exists, use the
   AI's per-sentence assessment (or overall score) to call the Katsuyou SRS scheduler
   (`submitReview()` in `katsuyouActions.ts`, modified SM-2) and/or toggle
   `BunpouProgress` automatically for whatever pattern/form the session's prompts were
   about — instead of the sidebar's due-badges just sitting frozen (current gap above).
   This requires reliably knowing which verb/form or pattern a given prompt was about;
   today that's only tracked via `KakouPrompt.source` (set when a session was started via
   the sidebar's "Practice in Kakou" deep link) — Daily Mix's static 44-prompt bank mostly
   doesn't carry this, so may need the prompt bank or `pickPrompts()` to attach `source`
   more consistently first.
3. **Smarter Daily Mix selection.** Current heuristic in `pickPrompts()`/
   `createKakouSession()` just grabs the *first* due Katsuyou form or *first* incomplete
   Bunpou pattern — no weighting by how overdue/weak something is. Could read
   `KatsuyouReviewCard.nextReview`/`easeFactor` more thoroughly once SRS updates are
   flowing again (item 2).

## Key files

- `src/modules/kakou/components/KakouDashboard.tsx` — main page component,
  `KakouLayout` wrapper (sidebar + modal), two JSX branches (active session / dashboard)
- `src/modules/kakou/components/KakouSidebar.tsx` — sidebar (Katsuyou + Bunpou panes)
- `src/modules/kakou/components/MaterialReferenceModal.tsx` — reference content modal
- `src/modules/kakou/actions/kakouActions.ts` — session CRUD, `pickPrompts()`
- `src/modules/kakou/actions/materialsActions.ts` — `getKakouMaterials()`
- `src/modules/kakou/data/reminders.ts` — `buildFocusedKakouPrompt()`,
  `hydrateKakouPrompt()`, `findFirstIncompleteBunpouPattern()`
- `src/modules/kakou/data/types.ts` — all Kakou types incl. `KakouMaterials`,
  `KakouMaterialSelection`
- `src/shared/lib/gemini-limiter.ts` — the `callGemini()` helper to reuse for Milestone 2
- `app/globals.css` — `.scrollbar-none` utility (newly defined)

## Verification checklist for whoever picks this up

- `npm run dev`, sign in, open `/kakou`: sidebar sticky at viewport height, scrollbar
  hidden, no clipped content, Katsuyou/Bunpou tabs populate from real DB state.
- Click a sidebar item → reference modal opens with correct content; "Practice this in
  Kakou" starts a focused session.
- Daily Mix session occasionally includes a due/weak item.
- Manual copy-paste AI review flow still works end-to-end (unaffected by this milestone).
- `/katsuyou` and `/bunpou` 404; bottom nav shows Anki, Kakou, Book, Conversation.
- `./node_modules/.bin/tsc.exe --noEmit -p tsconfig.json` clean (delete `.next/types`
  first if it complains about the deleted routes — that's a stale generated file, not a
  real error).

Note: browser-based visual verification wasn't done by the assistant in the session that
built Milestone 1 (Claude in Chrome extension blocked localhost access); the layout bugs
fixed this session (clipping, page-scroll-on-Bunpou-tab, visible scrollbar) were all
reported by the user testing manually, not caught proactively. Worth a thorough manual
pass on both desktop and mobile widths before trusting the layout further.
