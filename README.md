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

## Technical Walkthrough — How the System Works

### 1. Authentication Flow

```
User submits login form (email + password)
  → POST /api/auth/[...nextauth] (NextAuth Credentials provider)
  → authorize() fetches user from DB via Prisma
  → bcryptjs.compare() checks password hash (cost 12)
  → On success: JWT created with user.id embedded (jwt callback)
  → JWT stored in HttpOnly cookie
  → session callback exposes user.id to server components
  → middleware.ts checks session on every /dashboard/** and /pages/** request
  → Unauthenticated users → redirect to /login
```

### 2. OpenAI API Key Management

The OpenAI API key is **not stored in environment variables**. Instead:

```
User visits /pages/new
  → Client calls GET /api/settings/openai-key
  → API checks User.openaiApiKey in DB
  → If missing → UI shows input form to enter key
  → User submits key → POST /api/settings/openai-key
  → Key saved to User.openaiApiKey column in Neon DB
  → Subsequent generation requests read key from DB (scoped to userId)
```

This means each user provides and manages their own API key, with no shared key on the server.

### 3. Sales Page Generation Pipeline

```
User fills ProductForm (name, description, features[], audience, price, USP, template)
  ↓
Client → POST /api/generate
  ↓
Server:
  1. Validates session (auth())
  2. Validates input with Zod schema
  3. Fetches user's openaiApiKey from DB
  4. Calls generateSalesPage(input, apiKey) in lib/ai.ts
  ↓
lib/ai.ts:
  1. Instantiates OpenAI client with user's key
  2. Builds a structured prompt with all product details
  3. Calls gpt-4o-mini with response_format: { type: "json_object" }
  4. temperature: 0.8 for creative variation
  ↓
OpenAI returns structured JSON:
  {
    headline, subHeadline, productDescription,
    benefits[], features[], socialProof[],
    pricing: { price, period, includes[], guarantee },
    cta: { primary, secondary, urgency }
  }
  ↓
Client receives SalesPageContent → rendered live via SalesPagePreview component
```

### 4. Template Rendering System

Three templates are implemented as React sub-components inside `components/sales-page-preview.tsx`:

| Template | Style | Best For |
|----------|-------|----------|
| **Modern** | Gradient hero, card-based sections, indigo/purple palette | SaaS, digital products |
| **Bold** | Dark hero, high contrast, accent colors | Courses, coaching, memberships |
| **Classic** | Clean editorial, serif-inspired, minimal | Agencies, consulting, B2B |

Each template receives the same `SalesPageContent` object and renders it differently. The HTML export (`lib/export.ts`) inlines all CSS so the file is fully self-contained.

### 5. Section-by-Section Regeneration

```
User clicks "Regenerate" on a specific section (e.g. "Headline")
  ↓
Client → POST /api/generate/section
  body: { input: ProductInput, section: "headline", currentContent: SalesPageContent }
  ↓
Server:
  1. Validates section name against VALID_SECTIONS whitelist
  2. Fetches openaiApiKey from DB
  3. Calls regenerateSection(input, section, currentContent, apiKey)
  ↓
lib/ai.ts → buildSectionPrompt():
  - Sends only the section-specific instruction
  - Includes current headline as context
  - temperature: 0.9 for higher creativity
  ↓
Returns only the updated section field → merged into current content via setContent()
```

This avoids regenerating the whole page (saves API cost and time) while keeping all other sections intact.

### 6. Data Persistence

```
SalesPage table stores:
  - productName, description, features (JSON text), targetAudience, price, usp
  - template selection
  - content (JSON text — full SalesPageContent object)
  - userId (foreign key — all queries filter by userId for isolation)
  - createdAt, updatedAt

All CRUD routes (/api/pages/**) enforce:
  → session check (auth())
  → where: { id, userId } — users can only access their own pages
```

### 7. HTML Export

```
GET /api/pages/:id/export
  ↓
Server fetches page from DB (scoped to userId)
  ↓
lib/export.ts → generateHtmlExport(productName, content, template)
  → Builds a complete <!DOCTYPE html> document
  → All CSS inlined in <style> tag (no external dependencies)
  → Template-specific styles applied
  ↓
Response: Content-Disposition: attachment; filename="..."
  → Browser downloads standalone .html file
  → File works offline, can be hosted on any static host
```

### 8. Request Lifecycle (End-to-End)

```
Browser → Next.js middleware (CSRF + session check)
  → App Router (RSC for data fetching, Client Components for interactivity)
    → API Route (Zod validation → Auth check → DB query via Prisma → OpenAI call)
      → Neon PostgreSQL (serverless, connection pooling via ?pgbouncer=true)
      → OpenAI gpt-4o-mini (JSON mode, ~15-30s response time)
  ← JSON response → Client state update → React re-render
```

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
