# Contributing to Yantrix

Thank you for contributing to Yantrix.

Yantrix is a space-tech collaboration platform focused on datasets, AI/ML, satellite challenges, research, and engineering innovation.

---

# Contribution Workflow

## 1. Fork Repository

Fork the Yantrix repository to your GitHub account.

## 2. Clone Your Fork

```bash
git clone <your-fork-url>
cd Yantrix
```

## 3. Install Root Dependencies

```bash
npm install
```

## 4. Setup Environment

```bash
cp .env.example .env
```

Update values if needed.

## 5. Start Project

Recommended:

```bash
npx orbit start
```

This starts frontend, backend, database, opens browser, and launches Orbit shell.

## 6. Create Branch

```bash
git checkout -b feature/your-feature-name
```

## 7. Make Changes

Please follow:

- Existing folder structure
- Existing code style
- Meaningful naming conventions
- Clean commits

## 8. Test Changes

Use Orbit or Docker commands.

## 9. Commit

```bash
git add .
git commit -m "feat: your change summary"
```

## 10. Push

```bash
git push origin feature/your-feature-name
```

## 11. Open Pull Request

Include:

- What changed
- Why changed
- Screenshots (if UI)
- Test steps

---

# Orbit CLI Commands

## Core

```bash
npx orbit start
npx orbit stop
npx orbit restart
npx orbit status
npx orbit logs
```

## Logs

```bash
npx orbit logs backend
npx orbit logs frontend
npx orbit logs postgres
```

## Prisma / Database

```bash
npx orbit migrate
npx orbit migrate init
npx orbit migrate:deploy
npx orbit studio
npx orbit db
npx orbit reset
```

## Shell Access

```bash
npx orbit shell backend
npx orbit shell frontend
npx orbit shell db
```

---

# Docker Manual Commands

## Start Full Project

```bash
docker compose up -d --build
```

## Stop Project

```bash
docker compose down
```

## View Running Containers

```bash
docker compose ps
```

## Logs

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## Restart

```bash
docker compose restart
docker compose restart backend
docker compose restart frontend
```

---

# Prisma Commands

```bash
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma migrate dev --name migration_name
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma migrate status
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma studio
```

---

# Shell Access

```bash
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec postgres sh
```

---

# PostgreSQL CLI

```bash
docker compose exec postgres psql -U postgres -d space_platform
```

---

# Testing

## Backend Health

```bash
curl http://localhost:8000/health
```

## Frontend

Open:

```txt
http://localhost:5173
```

## API

```bash
curl http://localhost:8000/api
```

---

# Common Fixes

## Missing Tables

```bash
npx orbit migrate:deploy
```

or

```bash
docker compose exec backend npx prisma migrate deploy
```

## Invalid Token

Clear browser local storage and login again.

## Reset Full Database

```bash
npx orbit reset
```

or

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
```

## Containers Stuck

```bash
docker compose down
docker compose up -d --build
```

---

# Code Expectations

Please aim for:

- Clean readable code
- Small focused PRs
- Reusable components
- Consistent naming
- No unnecessary package additions

---

# Labels You May See

```txt
frontend
backend
database
docker
enhancement
bug
good first issue
help wanted
```

---

# Thank You

Every contribution helps build Yantrix into a serious platform for future space engineering and innovation.
