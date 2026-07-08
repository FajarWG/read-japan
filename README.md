<img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/de2cfd6a-bb01-482a-88e6-35db82d5c318" />

# Nihongo Flow

A focused Japanese study app built around a handful of things you actually do every day: SRS flashcards, grammar, verb conjugation, pre-class prep, and a personal vocabulary notebook.

**Language:** the interface is English; the *meaning* of Japanese content (sentence translations, word glosses) is in Indonesian. There is no language toggle — this split is intentional.

Built with Next.js, Prisma, and HeroUI.

---

## Features

- **Anki** — Spaced-repetition (SRS) vocabulary flashcards, with a reverse "write the kanji" mode.
- **Bunpou (文法)** — Grammar patterns and particles reference, with sentence-building practice.
- **Katsuyou (活用)** — Verb conjugation guides, examples, and SRS review.
- **Prep** — Pre-class study & cheat sheets: dialogue, grammar, vocabulary, and audio playback.
- **Kotoba (言葉)** — A personal vocabulary notebook: jot down new words you come across (manual or AI import), toggle furigana, and memorize them with an Anki-style SRS.
- **Home dashboard** — Daily study checklist (add/remove tasks, check off per day), streak, a 7-day activity chart, and per-feature stats.
- **Auth** — Register / login with username + password; roles: `USER` and `ADMIN`.
- **Dark mode** — System-aware theme with manual toggle.
- **PWA** — Installable, with an offline fallback.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | HeroUI v3 |
| Database | PostgreSQL (NeonDB) |
| ORM | Prisma 7 |
| Auth | JWT via `jose`, passwords via `bcryptjs` |
| Runtime / Package Manager | Bun |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/fajarwg/nihongo-flow.git
cd nihongo-flow
bun install
```

### 2. Configure environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL_VPS="postgresql://..."
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="..." # optional, used by the Prep AI summary feature
```

- `DATABASE_URL_VPS` — PostgreSQL connection string (VPS/Neon/managed Postgres). This env is deliberately **not** named `DATABASE_URL` to avoid clashing with the standard Vercel/Next.js env and to keep it easy to audit.
- `JWT_SECRET` — random string used to sign the session JWT.
- `GEMINI_API_KEY` — optional; only used by the Prep AI summary generator.

### 3. Set up the database

```bash
bunx prisma migrate deploy
bunx prisma generate --output app/generated/prisma
```

### 4. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/               # Next.js App Router pages + API routes (anki, prep, audio)
prisma/            # Prisma schema and migrations
src/
  modules/         # Feature modules (anki, bunpou, katsuyou, prep, kotoba, dashboard, auth, ...)
  shared/          # Shared components and utilities (db, session, activity, parser)
public/            # Static assets
```

---

## Database Schema

Key models:

- **User** — `id`, `username` (unique), `password` (hashed), `role` (`USER` | `ADMIN`), `createdAt`
- **AnkiProgress** — per-user SRS state per card (`interval`, `ease`, `repetitions`, `dueDate`)
- **KatsuyouReviewCard / KatsuyouLessonProgress** — conjugation SRS state and completed lessons
- **BunpouProgress** — grammar patterns marked complete
- **PrepData** — per-chapter/point lesson content (dialogue, grammar, vocabulary, audio)
- **ActivityLog** — learning events powering the streak and dashboard stats

> Kotoba (the vocabulary notebook) and the daily study checklist are stored client-side in `localStorage`, not the database.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Note

This project was developed through an intensive human-AI collaboration, with approximately 80% of the core execution—including logic design, code generation, and initial drafting—powered by Claude 3.5 Sonnet. While the AI served as the primary engine for technical development, the remaining 20% was dedicated to human oversight, strategic direction, and rigorous quality refinement to ensure the final output aligns perfectly with the project’s specific goals and standards.

*Made by [FajarWG](https://github.com/fajarwg)*
