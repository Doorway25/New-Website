# Education Doorway

Public website, Express API, React admin panel, and PostgreSQL — for managing study-abroad content and SEO.

## Monorepo layout

```
/
├── docker-compose.yml      # Local Postgres
├── backend/                # Express + Prisma API (:4000)
├── admin/                  # React admin panel (:5174)
├── src/                    # Public Vite website (:5173)
└── HOSTINGER_DEPLOY.md     # Production deploy on Hostinger VPS
```

## Prerequisites

- Node.js 20+
- Docker Desktop (for local Postgres)

## Local setup

### 1. Start Postgres

```bash
docker compose up -d
```

Defaults: user/password `doorway`, database `education_doorway`, port `5432`.

### 2. API

```bash
cd backend
cp .env.example .env   # if needed
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev            # http://localhost:4000
```

Seed credentials are defined in `backend/.env` / `.env.example` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).

### 3. Public website

```bash
# from repo root
cp .env.example .env   # VITE_API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:5173
```

### 4. Admin panel

```bash
cd admin
cp .env.example .env   # VITE_API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:5174
```

Each entity editor includes an SEO section (meta title/description, Open Graph, canonical, robots, JSON-LD).

## API overview

**Public (no auth)**

- `GET /api/public/settings`, `/home`, `/pages/:slug`
- `GET /api/public/countries`, `/universities`, `/articles`, `/events`, `/stories`, …
- `POST /api/public/leads` — counselling / apply / branch forms

**Admin (JWT)**

- `POST /api/admin/auth/login`
- CRUD under `/api/admin/*` for settings, pages, countries, universities, articles, events, stories, branches, pillars, testimonials, leads
- `POST /api/admin/upload` — images to `backend/uploads/`

## Environment

| Variable                         | Where           | Purpose                         |
| -------------------------------- | --------------- | ------------------------------- |
| `DATABASE_URL`                   | backend         | Postgres connection string      |
| `JWT_SECRET`                     | backend         | Admin token signing             |
| `CORS_ORIGIN`                    | backend         | Comma-separated allowed origins |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | backend         | Seeded admin user               |
| `VITE_API_URL`                   | website + admin | API base URL                    |

## Production deploy

See **[HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md)** for the full Hostinger VPS guide (DNS, Nginx, PM2, SSL, updates, removing old projects).

## Tech stack

- Website / Admin: React, Vite, Tailwind (website), React Router, react-helmet-async
- API: Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt
- Local DB: Docker Compose Postgres 16
