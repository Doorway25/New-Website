# Hostinger VPS deploy — New Education Doorway website

Deploy **this monorepo** (public site + admin CMS + API) on your Hostinger VPS **next to** the projects already running.

VPS: `root@76.13.254.129` (`srv1344373.hstgr.cloud`)

---

## Current projects on this VPS (keep them)

| # | Project | Path / how it runs | Domain | Do not touch |
| - | ------- | ------------------ | ------ | ------------ |
| 1 | **CRM** (old Nest/Next stack) | `/home/nextbigthing/projects/educationdoorway` → Docker Compose → port **5003** | `https://crm.educationdoorway.com` | Never `docker compose down` here |
| 2 | **ApplyPartner** | `/var/www/applyPartner/...` → PM2 + Docker | Nginx `applypartners` | Leave PM2 apps running |

Nginx sites already present:

```text
applypartners
crm.educationdoorway.com.conf
```

This guide adds a **3rd project** only:

| New project | Path | Domains |
| ----------- | ---- | ------- |
| New website + admin + API | `/var/www/doorway` | `web.educationdoorway.com`, `admin.educationdoorway.com` |

### Ports used (avoid conflicts)

| Port | Used by |
| ---- | ------- |
| `3000` | ApplyPartner frontend (PM2) |
| `5003` | CRM OpenResty |
| `4000` | **New** doorway API (PM2) — use this |
| `5432` | System Postgres (for new site DB) — or Docker CRM postgres (internal only) |

---

## Deploy checklist (order)

1. [ ] DNS for `web` + `admin`
2. [ ] Confirm CRM + ApplyPartner still running
3. [ ] Install Node / PM2 / Postgres if missing
4. [ ] Create DB for new site
5. [ ] Upload project to `/var/www/doorway`
6. [ ] Backend `.env` + migrate + seed + PM2
7. [ ] Build website + admin
8. [ ] Add Nginx site (do **not** remove CRM/apply configs)
9. [ ] SSL with Certbot
10. [ ] Smoke test all 3 projects

---

## 1. DNS

Wherever `educationdoorway.com` DNS is managed, add:

```text
A   web     →  76.13.254.129
A   admin   →  76.13.254.129
```

Keep CRM DNS as-is (`crm` should already point to this VPS).

Check:

```bash
ping -c 2 web.educationdoorway.com
ping -c 2 admin.educationdoorway.com
ping -c 2 crm.educationdoorway.com
```

---

## 2. SSH and verify existing projects (do not stop them)

```bash
ssh root@76.13.254.129
```

```bash
# CRM must stay up
cd /home/nextbigthing/projects/educationdoorway
docker compose ps
curl -I http://127.0.0.1:5003

# ApplyPartner must stay up
pm2 list
ls /etc/nginx/sites-enabled
```

Expected:

- CRM containers **Up**, port **5003** returns **200**
- PM2 shows `applypartner-backend` + `applypartner-frontend` **online**
- Nginx: `applypartners`, `crm.educationdoorway.com.conf`

If CRM is down, start it again (**only this stack**):

```bash
cd /home/nextbigthing/projects/educationdoorway
docker compose up -d
```

---

## 3. Install packages (skip what is already installed)

```bash
node -v
npm -v
pm2 -v
nginx -v
psql --version
```

If anything is missing:

```bash
apt update
apt install -y nginx certbot python3-certbot-nginx git curl build-essential postgresql postgresql-contrib

# Node 20 (only if node is missing / too old)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
```

Firewall (safe to re-run):

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 4. Create Postgres database for the NEW site only

```bash
sudo -u postgres psql <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'doorway') THEN
    CREATE USER doorway WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
  END IF;
END
$$;
SELECT 'CREATE DATABASE doorway_website OWNER doorway'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'doorway_website')\gexec
\c doorway_website
GRANT ALL ON SCHEMA public TO doorway;
SQL
```

Use a strong password. This DB name (`doorway_website`) is separate from CRM Docker Postgres.

---

## 5. Upload the new project to `/var/www/doorway`

**Do not** put files into:

- `/home/nextbigthing/projects/educationdoorway` (CRM)
- `/var/www/applyPartner` (ApplyPartner)

### Option A — from Windows (zip, recommended)

On your PC (PowerShell), zip without heavy folders:

```powershell
cd "C:\Users\Thinkbook 15 g4\OneDrive\Desktop"
Compress-Archive -Path "New Website\*" -DestinationPath "doorway-upload.zip" -Force
scp "doorway-upload.zip" root@76.13.254.129:/tmp/
```

On VPS:

```bash
mkdir -p /var/www/doorway
cd /var/www/doorway
apt install -y unzip
unzip -o /tmp/doorway-upload.zip -d /var/www/doorway
# remove local node_modules if uploaded; install fresh on server
rm -rf node_modules admin/node_modules backend/node_modules
ls -la
```

### Option B — Git clone

```bash
mkdir -p /var/www/doorway
cd /var/www/doorway
git clone YOUR_REPO_URL .
```

Expected layout:

```text
/var/www/doorway/
  backend/
  admin/
  src/
  public/
  package.json
  HOSTINGER_DEPLOY.md
  ...
```

---

## 6. Backend API (PM2 name: `doorway-api`)

```bash
cd /var/www/doorway/backend
cp .env.example .env
nano .env
```

Set:

```env
PORT=4000
DATABASE_URL="postgresql://doorway:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/doorway_website?schema=public"
JWT_SECRET="replace-with-long-random-string"
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN="https://web.educationdoorway.com,https://admin.educationdoorway.com"
ADMIN_EMAIL="admin@educationdoorway.com"
ADMIN_PASSWORD="CHANGE_ME_ADMIN_PASSWORD"
YOUTUBE_API_KEY=
```

Then:

```bash
cd /var/www/doorway/backend
npm install
npx prisma migrate deploy
npm run db:seed

# start WITHOUT touching applypartner PM2 apps
pm2 start src/index.js --name doorway-api
pm2 save
pm2 startup
# run the command pm2 prints (once)

pm2 list
curl http://127.0.0.1:4000/api/health
```

`pm2 list` should show **three** apps:

- `applypartner-backend` (keep)
- `applypartner-frontend` (keep)
- `doorway-api` (new)

---

## 7. Build public website + admin

```bash
cd /var/www/doorway
echo 'VITE_API_URL=https://web.educationdoorway.com' > .env
npm install
npm run build
# → /var/www/doorway/dist

cd /var/www/doorway/admin
echo 'VITE_API_URL=https://web.educationdoorway.com' > .env
npm install
npm run build
# → /var/www/doorway/admin/dist
```

---

## 8. Nginx — add new site only (do not delete CRM / ApplyPartner)

```bash
nano /etc/nginx/sites-available/doorway
```

Paste:

```nginx
server {
  listen 80;
  server_name web.educationdoorway.com;
  root /var/www/doorway/dist;
  index index.html;
  client_max_body_size 20M;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /uploads/ {
    proxy_pass http://127.0.0.1:4000/uploads/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 80;
  server_name admin.educationdoorway.com;
  root /var/www/doorway/admin/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Enable **without** removing other sites:

```bash
ln -sf /etc/nginx/sites-available/doorway /etc/nginx/sites-enabled/doorway

# confirm all three still listed
ls -la /etc/nginx/sites-enabled

nginx -t && systemctl reload nginx
```

You should see:

```text
applypartners
crm.educationdoorway.com.conf
doorway
```

---

## 9. SSL for the new hostnames only

```bash
certbot --nginx -d web.educationdoorway.com -d admin.educationdoorway.com
```

Do **not** revoke or recreate CRM certs unless Certbot asks and you know what you are doing.

---

## 10. Smoke test (all projects)

```bash
# New website
curl -I https://web.educationdoorway.com
curl -I https://admin.educationdoorway.com
curl http://127.0.0.1:4000/api/health

# Existing CRM (must still work)
curl -I https://crm.educationdoorway.com
curl -I http://127.0.0.1:5003

# PM2
pm2 list
```

Browser checks:

- [ ] `https://web.educationdoorway.com` — new public site
- [ ] `https://admin.educationdoorway.com` — new admin login
- [ ] `https://crm.educationdoorway.com` — CRM still opens
- [ ] ApplyPartner site still opens

---

## 11. Update the new site later

### A) One-time: connect `/var/www/doorway` to GitHub

Your live folder was uploaded by zip (no `.git`). Convert it once:

```bash
ssh root@76.13.254.129

# backup live env + uploads
mkdir -p /root/doorway-backup
cp /var/www/doorway/backend/.env /root/doorway-backup/backend.env
cp /var/www/doorway/.env /root/doorway-backup/site.env 2>/dev/null || true
cp /var/www/doorway/admin/.env /root/doorway-backup/admin.env 2>/dev/null || true
cp -a /var/www/doorway/backend/uploads /root/doorway-backup/uploads 2>/dev/null || true

# replace folder with a clean git clone
cd /var/www
mv doorway doorway-zip-old
git clone https://github.com/Doorway25/New-Website.git doorway
cd /var/www/doorway

# restore production env files
cp /root/doorway-backup/backend.env /var/www/doorway/backend/.env
echo 'VITE_API_URL=https://web.educationdoorway.com' > /var/www/doorway/.env
echo 'VITE_API_URL=' > /var/www/doorway/admin/.env

# restore uploaded images/logos
mkdir -p /var/www/doorway/backend/uploads
cp -a /root/doorway-backup/uploads/. /var/www/doorway/backend/uploads/ 2>/dev/null || true

# install + migrate + build + restart
cd /var/www/doorway/backend && npm install && npx prisma migrate deploy && pm2 restart doorway-api --update-env
cd /var/www/doorway && npm install && npm run build
cd /var/www/doorway/admin && npm install && npm run build

# verify
curl -s http://127.0.0.1:4000/api/health
curl -sI https://web.educationdoorway.com | head -5
curl -sI https://admin.educationdoorway.com | head -5
```

If everything looks good:

```bash
rm -rf /var/www/doorway-zip-old
```

Private repo? Use a deploy key or:

```bash
git clone https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/Doorway25/New-Website.git doorway
```

---

### B) Every time you update code (normal workflow)

**On your PC**

```bash
cd "C:\Users\Thinkbook 15 g4\OneDrive\Desktop\New Website"
git add .
git commit -m "Describe your change"
git push origin main
```

**On the VPS**

```bash
ssh root@76.13.254.129
cd /var/www/doorway
git pull origin main

cd /var/www/doorway/backend
npm install
npx prisma migrate deploy
pm2 restart doorway-api --update-env

cd /var/www/doorway
npm install
npm run build

cd /var/www/doorway/admin
npm install
npm run build
```

One-liner after `git pull`:

```bash
cd /var/www/doorway && \
  (cd backend && npm install && npx prisma migrate deploy && pm2 restart doorway-api --update-env) && \
  npm install && npm run build && \
  (cd admin && npm install && npm run build)
```

---

### C) Optional: auto-deploy script on the VPS

```bash
cat > /usr/local/bin/doorway-deploy <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/doorway
git pull origin main
cd /var/www/doorway/backend
npm install
npx prisma migrate deploy
pm2 restart doorway-api --update-env
cd /var/www/doorway
npm install
npm run build
cd /var/www/doorway/admin
npm install
npm run build
echo "Deploy done: $(date)"
EOF
chmod +x /usr/local/bin/doorway-deploy
```

Then after each GitHub push:

```bash
ssh root@76.13.254.129 doorway-deploy
```

---

### D) Optional later: GitHub Actions (auto on push)

You can add a workflow that SSHs into the VPS and runs `doorway-deploy` on every push to `main`. Needs:

- GitHub repo secret `VPS_HOST` = `76.13.254.129`
- GitHub repo secret `VPS_SSH_KEY` = private key that can SSH as root

Ask if you want this Actions file added to the repo.

---

## 12. Troubleshooting

| Problem | Fix |
| ------- | --- |
| New site 502 on `/api` | `pm2 restart doorway-api`; `curl http://127.0.0.1:4000/api/health` |
| Admin “Failed to fetch” | Rebuild admin with `VITE_API_URL=https://web.educationdoorway.com` |
| CRM 502 again | `cd /home/nextbigthing/projects/educationdoorway && docker compose up -d` |
| Port 4000 in use | `ss -tlnp \| grep 4000` — change `PORT` in backend `.env` and Nginx `proxy_pass` |
| Wrong site removed | Never delete `crm.educationdoorway.com.conf` or `applypartners` |

Logs:

```bash
pm2 logs doorway-api --lines 80
tail -n 50 /var/log/nginx/error.log
cd /home/nextbigthing/projects/educationdoorway && docker compose logs --tail=50
```

---

## 13. Never do this

```bash
# DANGER — kills CRM
cd /home/nextbigthing/projects/educationdoorway && docker compose down

# DANGER — can kill ApplyPartner
pm2 delete all
pm2 stop applypartner-backend
pm2 stop applypartner-frontend

# DANGER — removes CRM nginx
rm /etc/nginx/sites-enabled/crm.educationdoorway.com.conf
```

Only manage the new app with:

```bash
pm2 restart doorway-api
pm2 logs doorway-api
```

---

## Quick cheat sheet

```bash
ssh root@76.13.254.129

# new site
pm2 restart doorway-api
cd /var/www/doorway && npm run build
cd /var/www/doorway/admin && npm run build

# crm (if needed)
cd /home/nextbigthing/projects/educationdoorway && docker compose up -d

# nginx
ls /etc/nginx/sites-enabled
nginx -t && systemctl reload nginx
```

After deploy you will have **3** live projects:

1. CRM → `crm.educationdoorway.com`
2. ApplyPartner → existing domain
3. New website → `web` + `admin.educationdoorway.com`
