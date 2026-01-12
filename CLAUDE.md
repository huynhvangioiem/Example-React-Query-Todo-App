# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fullstack Todo application built with Next.js App Router, MySQL, and Prisma. The project uses Google OAuth for authentication (no password-based auth).

## Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint

# Database
docker-compose up -d           # Start MySQL container
docker-compose down            # Stop container
docker-compose down -v         # Stop and delete all data
npx prisma migrate dev         # Run migrations (generates Prisma Client to src/generated/prisma)
npx prisma studio              # Open Prisma database browser
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router only, no Pages Router)
- **Database**: MySQL 8.0 via Docker + Prisma 7 ORM
- **State**: React Query for server state, Zustand for UI-only state
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS 4

### Folder Structure
- `app/` - Routes and layouts (App Router)
- `app/api/` - API Route Handlers (`route.ts` files)
- `features/` - Domain logic (hooks, API calls, Zod schemas)
- `lib/` - Shared infrastructure (Prisma client, auth, query client)
- `store/` - Zustand stores (UI state only)
- `generated/prisma/` - Auto-generated Prisma Client

### Data Flow
- All database access through Prisma client singleton at `src/lib/prisma.ts`
- API routes validate input with Zod, return typed JSON
- Frontend fetches via React Query hooks in `features/`
- Server state in React Query, UI state (theme, sidebar) in Zustand

### Database Models
- **User**: id, email, googleId, name, avatarUrl (Google OAuth only)
- **Todo**: id, title, description, completed, userId (scoped to user)

## Conventions

### Code Style
- TypeScript strict mode, no `any` types
- Validate all API inputs with Zod
- Use `'use client'` directive only when needed
- Async/await, no callbacks
- Prefer small, composable functions
- **JSDoc**: Add comprehensive JSDoc comments to all exported functions, classes, and complex logic
  - Include `@param` for parameters with type and description
  - Include `@returns` for return values with type and description
  - Include `@throws` for functions that can throw errors
  - Add `@example` for non-trivial functions to show usage
  - Include one-line summary describing what the function does

### API Routes
- Implement in `app/api/**/route.ts`
- Return proper HTTP status codes (400, 401, 404)
- All todo operations require authenticated user
- Todos always scoped by logged-in user's ID

### Frontend
- Forms: React Hook Form + Zod resolver
- Use optimistic updates for mutations
- Handle loading, error, and empty states explicitly

### What NOT to Do
- No Redux or storing server data in Zustand
- No direct DB queries outside Prisma client
- No business logic inside React components
