# SalesGen AI — AI-Powered Sales Page Generator

> Transform raw product information into complete, high-converting sales pages using GPT-4o.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Prisma · PostgreSQL (Neon) · NextAuth v5 · OpenAI · Tailwind CSS · Vercel

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | Register / Login / Logout with JWT sessions (NextAuth v5 Credentials) |
| **Product Form** | Structured input: name, description, features, audience, price, USP |
| **AI Generation** | Full sales page via GPT-4o-mini with headlines, benefits, features, testimonials, pricing, CTA |
| **Live Preview** | Styled preview inside a browser-chrome frame, exactly like the real page |
| **3 Templates** | Modern (gradient), Bold (dark), Classic (editorial) |
| **Saved Pages** | Full CRUD — save, view, edit, delete your sales pages |
| **Section Regen** | Regenerate individual sections without touching the rest |
| **HTML Export** | Download a fully standalone HTML file ready to host anywhere |

---

## Project Structure

```
.
├── app/
│   ├── (auth)/login|register    # Auth pages
│   ├── (dashboard)/             # Protected routes
│   │   ├── dashboard/           # Dashboard with page listing
│   │   └── pages/
│   │       ├── new/             # Create new page
│   │       └── [id]/            # Edit, Preview pages
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── register/            # User registration
│       ├── generate/            # Full page + section generation
│       └── pages/               # CRUD + export endpoints
├── components/
│   ├── ui/                      # Radix-based UI primitives
│   ├── product-form.tsx          # Multi-field product input form
│   ├── sales-page-preview.tsx    # 3-template live preview renderer
│   ├── sales-page-card.tsx       # Dashboard page card
│   └── section-regenerate.tsx   # Per-section AI regen panel
├── lib/
│   ├── ai.ts                    # OpenAI prompt engineering
│   ├── db.ts                    # Prisma singleton
│   ├── export.ts                # HTML export generator
│   └── utils.ts                 # Helpers
├── prisma/schema.prisma          # DB schema
├── types/index.ts                # Shared TypeScript types
└── auth.ts / middleware.ts       # NextAuth config + route protection
```

---

## Local Development

### 1. Clone & Install

```bash
git clone <your-repo>
cd bedaie-test
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# PostgreSQL — get a free DB at https://neon.tech
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Key — https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."
```

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Step 1: Create a PostgreSQL Database (Neon — Free)

1. Go to [neon.tech](https://neon.tech) → Create account → New Project
2. Copy the **Connection String** (the `postgresql://...` URL)

### Step 2: Get OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new key — make sure you have credits (GPT-4o-mini is very cheap)

### Step 3: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or use the Vercel dashboard:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select your repository

### Step 4: Set Environment Variables in Vercel

In your Vercel project dashboard → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32-byte string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |
| `OPENAI_API_KEY` | Your OpenAI API key |

### Step 5: Run Database Migration

After deployment, in Vercel's terminal or locally with the production DATABASE_URL:

```bash
npm run db:push
```

Or add this to the Vercel build command:
```
prisma generate && prisma db push && next build
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (runs `prisma generate`) |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:generate` | Regenerate Prisma client |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/generate` | Generate full sales page via AI |
| POST | `/api/generate/section` | Regenerate a single section |
| GET | `/api/pages` | List user's saved pages |
| POST | `/api/pages` | Save a new page |
| GET | `/api/pages/:id` | Get a single page |
| PUT | `/api/pages/:id` | Update a page |
| DELETE | `/api/pages/:id` | Delete a page |
| GET | `/api/pages/:id/export` | Download page as HTML |

---

## Bonus Features Implemented

- [x] **Export as HTML** — standalone file, no dependencies
- [x] **3 Design Templates** — Modern, Bold, Classic
- [x] **Section-by-section regeneration** — 8 sections, regenerate individually

---

## Security Notes

- Passwords are hashed with `bcryptjs` (cost factor 12)
- All API routes validate session via NextAuth `auth()`
- All DB queries scope to `userId` to prevent cross-user access
- Input validation with `zod` on all endpoints
- No sensitive data exposed to client
