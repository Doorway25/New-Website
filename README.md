# Education Doorway

Public website, Express API, React admin panel, and PostgreSQL — for managing study-abroad content and SEO.

## Monorepo layout

```
/
├── docker-compose.yml   # Local Postgres
├── backend/             # Express + Prisma API (:4000)
├── admin/               # React admin panel (:5174)
└── src/                 # Public Vite website (:5173)
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

Default users (from seed / `.env`):

| Role   | Email                         | Password     | Access                                                |
| ------ | ----------------------------- | ------------ | ----------------------------------------------------- |
| Admin  | `admin@educationdoorway.com`  | `Admin123!`  | Full CMS + settings + users                           |
| Editor | `editor@educationdoorway.com` | `Editor123!` | Content only (no user management; settings read-only) |

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

Log in with a seed account:

| Role   | Email                         | Password     |
| ------ | ----------------------------- | ------------ |
| Admin  | `admin@educationdoorway.com`  | `Admin123!`  |
| Editor | `editor@educationdoorway.com` | `Editor123!` |

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

## Hostinger VPS deploy (`web.educationdoorway.com`)

Recommended hostnames:

| Hostname                     | Serves                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `web.educationdoorway.com`   | Public website + `/api` + `/uploads` (proxied to Node) |
| `admin.educationdoorway.com` | Admin panel (static Vite build)                        |

Before deploy: VPS must be **active** (not suspended), and DNS for those hostnames must point to the VPS IP (`A` record).

1. Install **Node 20+**, **Nginx**, **Certbot**, and **Postgres** (or run Postgres via Docker on the VPS).
2. Clone the repo and create production env files:
   - `backend/.env` — `DATABASE_URL`, `JWT_SECRET`, `PORT=4000`, and  
     `CORS_ORIGIN=https://web.educationdoorway.com,https://admin.educationdoorway.com`
   - Root `.env` + `admin/.env` — `VITE_API_URL=https://web.educationdoorway.com`  
     (same origin as the public site so `/api` works without a separate API domain)
3. Database:

```bash
cd backend
npm install
npx prisma migrate deploy
npm run db:seed   # once
```

4. Run the API with **PM2**:

```bash
cd backend
npm install -g pm2
pm2 start src/index.js --name doorway-api
pm2 save
pm2 startup
```

5. Build static apps (with production `VITE_API_URL` set):

```bash
# website → /var/www/doorway/dist
npm install && npm run build

# admin → /var/www/doorway/admin/dist
cd admin && npm install && npm run build
```

6. Nginx example:

```nginx
# Public site + API
server {
  server_name web.educationdoorway.com;
  root /var/www/doorway/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
  location /uploads/ {
    proxy_pass http://127.0.0.1:4000/uploads/;
  }
}

# Admin
server {
  server_name admin.educationdoorway.com;
  root /var/www/doorway/admin/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

7. DNS (wherever the domain is managed):

```
A   web    → <VPS_IP>
A   admin  → <VPS_IP>
```

8. SSL:

```bash
sudo certbot --nginx -d web.educationdoorway.com -d admin.educationdoorway.com
```

9. After updates: rebuild static assets, `pm2 restart doorway-api`, reload Nginx.

## Tech stack

- Website / Admin: React, Vite, Tailwind (website), React Router, react-helmet-async
- API: Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt
- Local DB: Docker Compose Postgres 16
