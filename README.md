## Todo App – Fullstack Starter

This project is a **Next.js fullstack Todo application** with infrastructure and tooling pre-configured, ready for feature development.

### Tech Stack

- **Framework**: Next.js 16.1.1 (App Router) with TypeScript (strict mode)
- **Database**: MySQL 8.0 via Docker Compose
- **ORM**: Prisma 7.2.0
- **State Management**:
    - React Query (TanStack Query) for server state
    - Zustand for UI-only state
- **Forms & Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS 4
- **React**: 19.2.3

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

### Project Setup

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Create `.env` file** in the root directory:

    ```env
    # Database Configuration
    MYSQL_ROOT_PASSWORD=rootpassword
    MYSQL_DATABASE=todoapp
    MYSQL_USER=todoapp_user
    MYSQL_PASSWORD=todoapp_password
    MYSQL_PORT=3306

    # Database Connection String (for Prisma)
    DATABASE_URL="mysql://todoapp_user:todoapp_password@localhost:3306/todoapp"
    ```

3. **Start MySQL container:**

    ```bash
    docker-compose up -d
    ```

4. **Run Prisma migrations:**

    ```bash
    npx prisma migrate dev
    ```

    This will:
    - Create the database schema (User and Todo tables)
    - Generate Prisma Client in `src/generated/prisma`

5. **Verify database connection:**

    ```bash
    docker-compose ps
    ```

### Database Schema

The Prisma schema includes:

- **User** model:
    - `id` (UUID), `email` (unique), `password` (hashed), `name` (optional)
    - One-to-many relationship with Todos

- **Todo** model:
    - `id` (UUID), `title`, `description` (optional), `completed` (boolean)
    - Foreign key to User (`userId`)
    - Indexed on `userId` and `completed`

### Prisma Client

Prisma Client is configured as a singleton pattern in `src/lib/prisma.ts` to prevent connection pool exhaustion in development (hot-reload) and production.

**Usage:**

```typescript
import { prisma } from "@/lib/prisma";

// Use prisma in API routes or server components
const todos = await prisma.todo.findMany();
```

### Scripts

- **`npm run dev`**: Start the development server on `http://localhost:3000`
- **`npm run build`**: Create a production build
- **`npm run start`**: Run the production build
- **`npm run lint`**: Run ESLint

### Docker Commands

- **Stop MySQL container:**

    ```bash
    docker-compose down
    ```

- **Stop and remove volumes (⚠️ deletes all data):**

    ```bash
    docker-compose down -v
    ```

### Project Structure

```
src/
├── app/              # Next.js App Router (routes & layouts)
│   ├── api/         # API route handlers (to be created)
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── features/        # Domain logic (hooks, API calls, schemas) - to be created
├── lib/             # Shared infrastructure
│   └── prisma.ts    # Prisma Client singleton
├── store/           # Zustand stores (UI state only) - to be created
└── generated/       # Generated Prisma Client
    └── prisma/
```

### Current State

✅ **Infrastructure Ready:**

- Next.js App Router with TypeScript (strict mode)
- MySQL database configured with Docker Compose
- Prisma schema with User and Todo models
- Initial migration created and ready to apply
- Prisma Client singleton pattern implemented
- All dependencies installed (React Query, Zustand, React Hook Form, Zod, Tailwind CSS)

🚧 **To Be Built:**

- Authentication (login, protected routes)
- Todo CRUD API endpoints
- Todo UI components and pages
- React Query hooks for data fetching
- Zustand stores for UI state (theme, sidebar, etc.)

### Architecture Guidelines

- **App Router only** (no Pages Router)
- **API routes** via Next.js Route Handlers (`app/api/**/route.ts`)
- **Database access** ONLY through Prisma client (`src/lib/prisma.ts`)
- **Server state** handled by React Query (NOT Zustand)
- **UI state** (theme, sidebar) handled by Zustand
- **Forms** use React Hook Form + Zod validation
- **Type safety** throughout (no `any` types)

### Next Steps

See `Ticket.md` for the full development roadmap and epic breakdown.
