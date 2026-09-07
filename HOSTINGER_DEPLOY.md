# Hostinger VPS deploy — Education Doorway

Full production guide for deploying this monorepo on a Hostinger VPS (Ubuntu).

| Hostname | Serves |
| -------- | ------ |
| `web.educationdoorway.com` | Public website + `/api` + `/uploads` (proxied to Node) |
| `admin.educationdoorway.com` | Admin CMS (static Vite build) |

Replace `76.13.254.129` with your VPS IP if it changes.

---

## 0. Before you start

1. VPS must be **active** (not suspended) in Hostinger.
2. You can SSH as root:

```bash
ssh root@76.13.254.129
```

3. DNS for the subdomains must point to this VPS (see [DNS](#1-dns)).

---

## 1. DNS

Wherever `educationdoorway.com` is managed, create:

```
A   web     →  76.13.254.129
A   admin   →  76.13.254.129
```

Optional (if you also want the apex / www on this VPS later):

```
A   @       →  76.13.254.129
A   www     →  76.13.254.129
```

Wait until DNS resolves before requesting SSL:

```bash
# from your PC or VPS
ping web.educationdoorway.com
ping admin.educationdoorway.com
```

---

## 2. Inspect existing projects on the VPS

SSH in, then run:

```bash
hostname
df -h /
free -h

echo "=== /var/www ==="
ls -la /var/www 2>/dev/null || echo "no /var/www"

echo "=== /home ==="
ls -la /home 2>/dev/null

echo "=== Docker ==="
docker ps -a 2>/dev/null || echo "docker not installed"
docker compose ls 2>/dev/null

echo "=== PM2 ==="
pm2 list 2>/dev/null || echo "pm2 not installed"

echo "=== Nginx ==="
ls -la /etc/nginx/sites-enabled 2>/dev/null
ls -la /etc/nginx/conf.d 2>/dev/null

echo "=== Ports ==="
ss -tlnp | head -40
```

Use this to decide what to keep or remove before deploying.

---

## 3. Remove an old project (optional)

Only delete what you recognise.

### Docker Compose app

```bash
cd /path/to/old-project
docker compose down -v
cd ..
rm -rf /path/to/old-project
```

### PM2 Node app

```bash
pm2 list
pm2 stop old-app-name
pm2 delete old-app-name
pm2 save
rm -rf /path/to/old-app
```

### Nginx site

```bash
rm -f /etc/nginx/sites-enabled/old-site
# optional:
# rm -f /etc/nginx/sites-available/old-site
nginx -t && systemctl reload nginx
rm -rf /var/www/old-site
```

### Unused Postgres database

```bash
sudo -u postgres psql -c "\l"
sudo -u postgres psql -c "DROP DATABASE old_db;"
sudo -u postgres psql -c "DROP USER old_user;"
```

---

## 4. Install system packages (Ubuntu)

```bash
apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx git curl ufw build-essential

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm i -g pm2

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## 5. Create Postgres database

```bash
sudo -u postgres psql <<'SQL'
CREATE USER doorway WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE education_doorway OWNER doorway;
GRANT ALL PRIVILEGES ON DATABASE education_doorway TO doorway;
\c education_doorway
GRANT ALL ON SCHEMA public TO doorway;
SQL
```

Use a strong password and keep it for `DATABASE_URL` below.

---

## 6. Upload the project

### Option A — Git clone

```bash
mkdir -p /var/www/doorway
cd /var/www/doorway
git clone YOUR_REPO_URL .
```

### Option B — Upload from Windows (PowerShell)

On your PC (exclude `node_modules` if you can):

```powershell
scp -r "C:\Users\Thinkbook 15 g4\OneDrive\Desktop\New Website\*" root@76.13.254.129:/var/www/doorway/
```

Prefer zipping without `node_modules` / `.git` first, then:

```bash
# on VPS
mkdir -p /var/www/doorway
cd /var/www/doorway
# unzip uploaded archive here
```

Project layout on server should look like:

```
/var/www/doorway/
  backend/
  admin/
  src/
  package.json
  ...
```

---

## 7. Backend environment

```bash
cd /var/www/doorway/backend
cp .env.example .env
nano .env
```

Example production values:

```env
DATABASE_URL="postgresql://doorway:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/education_doorway?schema=public"
JWT_SECRET="replace-with-long-random-string"
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://web.educationdoorway.com,https://admin.educationdoorway.com"
ADMIN_EMAIL="admin@educationdoorway.com"
ADMIN_PASSWORD="CHANGE_ME_ADMIN_PASSWORD"
```

Install, migrate, seed, start with PM2:

```bash
cd /var/www/doorway/backend
npm install
npx prisma migrate deploy
npm run db:seed
pm2 start src/index.js --name doorway-api
pm2 save
pm2 startup
# run the command that `pm2 startup` prints
```

Health check:

```bash
curl http://127.0.0.1:4000/api/health
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs doorway-api
pm2 restart doorway-api
```

---

## 8. Build public website + admin

API URL for the browsers must be the **public** site origin (same host that proxies `/api`):

```bash
cd /var/www/doorway
echo 'VITE_API_URL=https://web.educationdoorway.com' > .env
npm install
npm run build
# output: /var/www/doorway/dist

cd /var/www/doorway/admin
echo 'VITE_API_URL=https://web.educationdoorway.com' > .env
npm install
npm run build
# output: /var/www/doorway/admin/dist
```

---

## 9. Nginx config

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

Enable and reload:

```bash
ln -sf /etc/nginx/sites-available/doorway /etc/nginx/sites-enabled/doorway
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## 10. SSL (Let's Encrypt)

DNS must already point to this VPS:

```bash
certbot --nginx -d web.educationdoorway.com -d admin.educationdoorway.com
```

Auto-renewal is usually installed by Certbot. Test:

```bash
certbot renew --dry-run
```

---

## 11. Smoke test checklist

- [ ] `https://web.educationdoorway.com` loads the public site
- [ ] `https://admin.educationdoorway.com` loads the admin login
- [ ] Admin can sign in with seeded credentials from `backend/.env`
- [ ] Universities / images load (`/uploads/...` works)
- [ ] Contact / counselling form creates a lead
- [ ] `pm2 status` shows `doorway-api` online

---

## 12. Deploy updates later

```bash
cd /var/www/doorway
# git pull   OR re-upload changed files

cd /var/www/doorway/backend
npm install
npx prisma migrate deploy
pm2 restart doorway-api

cd /var/www/doorway
npm install && npm run build

cd /var/www/doorway/admin
npm install && npm run build
```

No Nginx change needed unless domains or paths changed.

---

## 13. Troubleshooting

| Problem | Check |
| ------- | ----- |
| Site not opening | DNS A records → VPS IP; `ufw status`; `systemctl status nginx` |
| Admin “Failed to fetch” | `VITE_API_URL` at **build** time; rebuild admin; `CORS_ORIGIN` in `backend/.env` |
| API 502 | `pm2 status`; `curl http://127.0.0.1:4000/api/health`; `pm2 logs doorway-api` |
| DB errors | `DATABASE_URL`; Postgres running: `systemctl status postgresql` |
| Uploads 404 | Nginx `/uploads/` proxy; files under `backend/uploads/` |
| SSL fails | DNS not propagated yet; port 80 open |

Logs:

```bash
pm2 logs doorway-api --lines 100
journalctl -u nginx -n 50 --no-pager
tail -n 80 /var/log/nginx/error.log
```

---

## 14. Security notes

- Change default admin password after first login.
- Use a strong `JWT_SECRET` and DB password.
- Prefer SSH keys over password login when possible.
- Keep `backend/.env` out of public git remotes.
- Restrict UFW to SSH + HTTP/HTTPS only.

---

## Quick command cheat sheet

```bash
ssh root@76.13.254.129

pm2 status
pm2 restart doorway-api
pm2 logs doorway-api

nginx -t && systemctl reload nginx
certbot renew --dry-run

cd /var/www/doorway && npm run build
cd /var/www/doorway/admin && npm run build
cd /var/www/doorway/backend && npx prisma migrate deploy && pm2 restart doorway-api
```
