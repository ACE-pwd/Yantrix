# Yantrix

Yantrix is a next-generation space-tech collaboration platform — built specifically for **space datasets, satellite challenges, AI/ML experimentation, research collaboration, and engineering innovation**.

This repository contains the full-stack Yantrix development environment:

- **Frontend** → React + Vite + TypeScript  
- **Backend** → Node.js + TypeScript + Express  
- **Database** → PostgreSQL + Prisma ORM  
- **DevOps** → Docker + Docker Compose  

---

# Vision

Yantrix aims to become the central ecosystem for:

- Space datasets
- Satellite problem solving
- Orbital simulations
- Space AI models
- Research paper publishing
- Space developer collaboration
- Open-source space tools
- Real-world aerospace innovation

Think:

```txt
Kaggle + Hugging Face + GitHub + ResearchGate
For Space Technology
```

---

# Current Tech Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication

## Database

- PostgreSQL 16

## Infrastructure

- Docker
- Docker Compose

---

# Repository Structure

```text
Yantrix/
├── frontend/
├── backend/
├── docker-compose.yml
├── package.json
├── .env.example
├── README.md
└── .gitignore
```

---

# Features

## Current

- Full Dockerized development environment
- Frontend + Backend + Database
- Login / Signup APIs
- JWT Authentication
- Prisma ORM setup
- PostgreSQL running in Docker

## Planned

- Space dataset publishing
- Dataset versioning
- Research paper hub
- Satellite challenge system
- AI model sharing
- Team collaboration
- Public user profiles

---

# Prerequisites

- Node.js 18+
- npm
- Docker Desktop

Verify:

```bash
node -v
npm -v
docker -v
docker compose version
```

---

# Environment Setup

Create root `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/space_platform?schema=public"
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

VITE_API_BASE_URL=http://localhost:8000/api
```

---

# Quick Start

## Clone

```bash
git clone <repo-url>
cd Yantrix
```

## Run Full Stack

```bash
npm run docker:up
```

or

```bash
docker compose up -d --build
```

---

# URLs

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:8000
```

API:

```txt
http://localhost:8000/api
```

Database:

```txt
localhost:5432
```

---

# Scripts

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
npm run docker:restart
npm run docker:ps
```

---

# Prisma Commands

```bash
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma studio
```

---

# Auth APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

# Development Workflow

## Frontend

Edit:

```txt
frontend/src/
```

## Backend

Edit:

```txt
backend/src/
```

## Prisma

Edit:

```txt
backend/prisma/schema.prisma
```

Then run migration.

---

# Troubleshooting

## Backend logs

```bash
docker compose logs -f backend
```

## Missing tables

```bash
docker compose exec backend npx prisma migrate deploy
```

## Reset DB

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
```

---

# Security

Never commit:

- real `.env`
- production secrets
- database passwords
- JWT secrets

Use `.env.example`.

---

# Contributing

```bash
git checkout -b feature/your-feature
```

Make clean commits and open PR.

---

# License

MIT

---

# Built With Ambition

Yantrix is being built for the future of space engineering, AI, and innovation.
