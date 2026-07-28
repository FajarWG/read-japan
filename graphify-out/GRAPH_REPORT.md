# Graph Report - D:/Projects/read-japan  (2026-07-28)

## Corpus Check
- Large corpus: 4724 files · ~1,454,664 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 516 nodes · 822 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- JLPT Exam Prep & Kana Data
- Verb Conjugation (Katsuyou)
- API Routes & Database Access
- User Authentication & Layout
- Project Dependencies
- Developer Configuration
- Gemini API Limits & Bunpou Static Scripts
- TypeScript & Compiler Options
- Dashboard & Study Progress
- Anki & Kanji Tamago Study
- Grammar Study (Bunpou)
- System Overview & Architecture Docs
- Japanese Text Parser & Kana utils
- Request Proxy Routing
- Spaced Repetition System (SRS)
- Database Seeding (Dekiru Stories)
- Offline Support PWA Page
- OpenGraph Image Generation
- Audio Playback Component
- ESLint Rules
- Next.js Config
- PostCSS Styling Config
- User Database Model

## God Nodes (most connected - your core abstractions)
1. `getSession()` - 45 edges
2. `useLanguage()` - 17 edges
3. `createKotobaLookupEntry()` - 16 edges
4. `compilerOptions` - 16 edges
5. `SettingsDropdown()` - 11 edges
6. `Nihongo Flow` - 10 edges
7. `callGemini()` - 9 edges
8. `generateBunpouQuestions()` - 7 edges
9. `PrepContent()` - 7 edges
10. `include` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AnkiPage()` --calls--> `getSession()`  [EXTRACTED]
  app/anki/page.tsx → src/shared/lib/session.ts
- `RootLayout()` --calls--> `getSession()`  [EXTRACTED]
  app/layout.tsx → src/shared/lib/session.ts
- `GET()` --calls--> `getSession()`  [EXTRACTED]
  app/api/anki/custom-cards/route.ts → src/shared/lib/session.ts
- `GET()` --calls--> `getSession()`  [EXTRACTED]
  app/api/anki/route.ts → src/shared/lib/session.ts
- `POST()` --calls--> `getSession()`  [EXTRACTED]
  app/api/kanji-tamago/mnemonic/route.ts → src/shared/lib/session.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Study Features** — readme_feature_anki, readme_feature_bunpou, readme_feature_katsuyou, readme_feature_prep, readme_feature_kotoba [EXTRACTED 1.00]
- **Database Models** — readme_model_user, readme_model_ankiprogress, readme_model_katsuyoureviewcard, readme_model_katsuyoulessonprogress, readme_model_bunpouprogress, readme_model_prepdata, readme_model_activitylog [EXTRACTED 1.00]

## Communities (28 total, 7 thin omitted)

### Community 0 - "JLPT Exam Prep & Kana Data"
Cohesion: 0.05
Nodes (53): DekiruNihongoGroups, KanaEntry, kanaMap, KanaType, ConjugationItem, DialogueItem, examPredictions, ExamSection (+45 more)

### Community 1 - "Verb Conjugation (Katsuyou)"
Cohesion: 0.05
Nodes (45): metadata, react, react, addCardsToReviewQueue(), completeLesson(), getKatsuyouStats(), getReviewQueue(), savePracticeAttempt() (+37 more)

### Community 2 - "API Routes & Database Access"
Cohesion: 0.08
Nodes (32): GET(), GET(), POST(), POST(), GET(), POST(), GET(), POST() (+24 more)

### Community 3 - "User Authentication & Layout"
Cohesion: 0.06
Nodes (32): metadata, geistMono, geistSans, metadata, notoSerifJP, RootLayout(), logoutAction(), AuthContext (+24 more)

### Community 4 - "Project Dependencies"
Cohesion: 0.04
Nodes (43): bcryptjs, dotenv, @heroui/react, @heroui/styles, jose, lucide-react, next, dependencies (+35 more)

### Community 5 - "Developer Configuration"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, sharp, tailwindcss, @tailwindcss/postcss (+29 more)

### Community 6 - "Gemini API Limits & Bunpou Static Scripts"
Cohesion: 0.10
Nodes (25): POST(), BunpouExample, extractJson(), generateChunkWithRetry(), INPUT_SYLLABUS, main(), NewBunpouLesson, NewBunpouPattern (+17 more)

### Community 7 - "TypeScript & Compiler Options"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "Dashboard & Study Progress"
Cohesion: 0.13
Nodes (19): Home(), metadata, ContinueHero(), ContinueHeroProps, FEATURES, DailyTracker(), DEFAULT_HABITS, HabitItem (+11 more)

### Community 9 - "Anki & Kanji Tamago Study"
Cohesion: 0.10
Nodes (20): AnkiPage(), KANJI_N5, KanjiSeed, AnkiContent(), AnkiContentProps, SRSProgress, VocabularyCard, CONFUSION_PAIRS (+12 more)

### Community 10 - "Grammar Study (Bunpou)"
Cohesion: 0.22
Nodes (14): metadata, findPatternById(), generateBunpouQuestions(), getBunpouProgress(), getBunpouQuestions(), getPreviousPatterns(), toggleBunpouProgress(), BunpouDashboard() (+6 more)

### Community 11 - "System Overview & Architecture Docs"
Cohesion: 0.12
Nodes (18): DATABASE_URL_VPS Config, GEMINI_API_KEY Config, Anki Feature, Auth Feature, Bunpou Feature, Dark Mode Feature, Home Dashboard Feature, Katsuyou Feature (+10 more)

### Community 12 - "Japanese Text Parser & Kana utils"
Cohesion: 0.31
Nodes (7): COMBINING_SMALL_KANA, extractKanaUnits(), isKanaCodePoint(), KanaInfo, ParsedUnit, parseJapaneseText(), toRomaji()

### Community 13 - "Request Proxy Routing"
Cohesion: 0.43
Nodes (6): config, isAuthed(), isPublicAsset(), proxy(), PUBLIC_PATHS, SECRET

### Community 14 - "Spaced Repetition System (SRS)"
Cohesion: 0.29
Nodes (3): SrsInput, SrsRating, SrsState

### Community 15 - "Database Seeding (Dekiru Stories)"
Cohesion: 0.60
Nodes (4): BatchStory, createPrismaClient(), isNeonUrl(), main()

## Knowledge Gaps
- **190 isolated node(s):** `metadata`, `metadata`, `metadata`, `geistSans`, `geistMono` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Project Dependencies` to `Verb Conjugation (Katsuyou)`, `Developer Configuration`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **Why does `react` connect `Verb Conjugation (Katsuyou)` to `Project Dependencies`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Exam Prep & Kana Data` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Verb Conjugation (Katsuyou)` be split into smaller, more focused modules?**
  _Cohesion score 0.053763440860215055 - nodes in this community are weakly interconnected._
- **Should `API Routes & Database Access` be split into smaller, more focused modules?**
  _Cohesion score 0.07918367346938776 - nodes in this community are weakly interconnected._
- **Should `User Authentication & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.06471631205673758 - nodes in this community are weakly interconnected._