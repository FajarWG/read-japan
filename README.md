<img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/de2cfd6a-bb01-482a-88e6-35db82d5c318" />

# Nihongo Flow

A comprehensive Japanese study suite — practice reading short stories with active furigana, master verb conjugations using Kotoba Flex, review vocabulary via SRS flashcards, and prepare lesson cheat sheets.

Built with Next.js, Prisma, and HeroUI. Supports guest mode (no account required) and registered accounts.

---

## Features

- **Kotoba Flex** — Automatic verb conjugation conjugator, rules guide, and interactive flashcard quizzes (covering JLPT N5 - N3)
- **Read Stories** — Browse and read Japanese stories with furigana support and reading tracker
- **Prep Sheets** — Prepare for lessons with dialogs, grammar, vocabulary, and audio playbacks
- **Anki Cards** — Spaced Repetition (SRS) vocabulary card studies
- **Kana Chart** — Complete Hiragana and Katakana charts including Dakuten and Yoon
- **Progress tracking** — Persists per-story reading progress (guest via localStorage, users via database)
- **Auth** — Register / login with username + password; roles: `USER` and `ADMIN`
- **i18n** — UI language toggle: English / Indonesian
- **Dark mode** — System-aware theme with manual toggle

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
GEMINI_API_KEY="..." # optional, untuk fitur AI Chat
```

- `DATABASE_URL_VPS` — PostgreSQL connection string (VPS/Neon/managed Postgres). Nama env ini sengaja **bukan** `DATABASE_URL` agar tidak konflik dengan env standar Vercel/Next.js dan mudah diaudit.
- `JWT_SECRET` — string random untuk sign session JWT.
- `GEMINI_API_KEY` — opsional, hanya untuk fitur AI Chat (Phase 7).

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
app/               # Next.js App Router pages
prisma/            # Prisma schema and migrations
src/
  modules/         # Feature modules (auth, stories, learn, kana, etc.)
  shared/          # Shared components and utilities (db, session, parser)
public/            # Static assets
```

---

## Database Schema

Key models:

- **User** — `id`, `username` (unique), `password` (hashed), `role` (`USER` | `ADMIN`), `createdAt`
- **Story** — `id`, `title`, `content`, `createdAt`
- **LearningProgress** — composite key `(userId, storyId)`, `progress` (float), `completedAt`

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
