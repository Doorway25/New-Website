# Education Doorway Admin

Modern CMS with **sidebar navigation**, profile, full SEO fields, and admin/editor roles.

## Run

```bash
# API (required)
cd backend
npm run dev   # :4000

# Admin UI
cd admin
npm install
npm run dev   # http://localhost:5174
```

## Login

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Admin | `admin@educationdoorway.com` | `Admin123!` | Full CMS, settings, users |
| Editor | `editor@educationdoorway.com` | `Editor123!` | Content + leads; settings view-only |

Open **http://localhost:5174/login** (not the public site on `:5173`).

## Includes

- Sidebar: Dashboard, Leads, Countries, Universities, Programs, Courses/Subjects, Pages, Articles, Events, Stories, Branches, Pillars, etc.
- Profile page (name + password)
- Full SEO on supported entities: meta title/description/keywords, OG, canonical, robots, JSON-LD
- Admin-only Users management
