# AE Website Backend

A clean and beginner-friendly backend setup using:
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

## Folder Structure

```
backend/
  prisma/
    schema.prisma
  src/
    config/
      env.ts
      prisma-client.ts
    features/
      users/
        users.controller.ts
        users.routes.ts
        users.service.ts
    middlewares/
      error-handler.ts
      not-found.ts
    routes/
      index.ts
    app.ts
    server.ts
  .env.example
  package.json
  tsconfig.json
```

## Setup Steps

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your real PostgreSQL credentials.

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Create tables in your database:

```bash
npm run db:push
```

6. Run the project in development:

```bash
npm run dev
```

## API Endpoints

- `GET /` - welcome message
- `GET /api/health` - health check
- `GET /api/users` - list users
- `POST /api/users` - create user (`name`, `email`)

## Naming Convention Used

- Folders: lowercase and clear names (`features`, `middlewares`, `config`)
- Files: kebab-case (`error-handler.ts`, `prisma-client.ts`)
- Code symbols: camelCase (`usersService`, `startServer`)

## Backend Mirror Repo Sync

This backend can be mirrored to a separate Git repository while still living in this monorepo.

### Manual Sync

From the `backend/` folder:

```bash
export BACKEND_MIRROR_REPO_URL="git@github.com:your-org/your-backend-repo.git"
export BACKEND_MIRROR_BRANCH="main"
yarn sync:mirror
```

The script copies `backend/` contents to the target repo root and pushes only when changes exist.

### Automatic Sync (GitHub Actions)

Workflow file: `.github/workflows/backend-mirror-sync.yml`

Create these repository secrets in the monorepo:

- `BACKEND_MIRROR_REPO`: target repo path, for example `your-org/your-backend-repo`
- `BACKEND_MIRROR_TOKEN`: GitHub token with push access to target repo
- `BACKEND_MIRROR_BRANCH` (optional): defaults to `main`

When any `backend/**` file changes and you push, the workflow syncs backend content to the separate repo automatically.
