## Todo App – Fullstack Application

A fully functional **Next.js fullstack Todo application** with Google OAuth authentication, MySQL database, and React Query for state management.

### Tech Stack

- **Framework**: Next.js 16.1.1 (App Router) with TypeScript (strict mode)
- **Authentication**: Google OAuth via NextAuth.js
- **Database**: MySQL 8.0 via Docker Compose
- **ORM**: Prisma 7.2.0
- **State Management**: React Query (TanStack Query) for server state with optimistic updates
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

2. **Set up Google OAuth:**
    - Go to [Google Cloud Console](https://console.cloud.google.com/)
    - Create a new project or select an existing one
    - Enable Google+ API
    - Go to "Credentials" and create OAuth 2.0 Client ID
    - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
    - Copy the Client ID and Client Secret

3. **Create `.env` file** in the root directory:

    ```env
    # Database Configuration
    MYSQL_ROOT_PASSWORD=rootpassword
    MYSQL_DATABASE=todoapp
    MYSQL_USER=todoapp_user
    MYSQL_PASSWORD=todoapp_password
    MYSQL_PORT=3306

    # Database Connection String (for Prisma)
    DATABASE_URL="mysql://todoapp_user:todoapp_password@localhost:3306/todoapp"

    # NextAuth Configuration
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-random-secret-here"  # Generate with: openssl rand -base64 32

    # Google OAuth
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```

4. **Start MySQL container:**

    ```bash
    docker-compose up -d
    ```

5. **Run Prisma migrations:**

    ```bash
    npx prisma migrate dev
    ```

    This will:
    - Create the database schema (User and Todo tables)
    - Generate Prisma Client in `src/generated/prisma`

6. **Start the development server:**

    ```bash
    npm run dev
    ```

7. **Open the app:**

    Navigate to [http://localhost:3000](http://localhost:3000) and sign in with your Google account.

### Features

- **Authentication**: Google OAuth sign-in with automatic user creation
- **Todo Management**: Create, read, update, and delete todos
- **Real-time Updates**: Optimistic UI updates for instant feedback
- **Filtering**: View all, active, or completed todos
- **Inline Editing**: Edit todos directly in the list
- **User Scoped**: Each user only sees their own todos
- **Responsive Design**: Works on desktop and mobile devices

### Database Schema

The Prisma schema includes:

- **User** model:
    - `id` (UUID), `email` (unique), `googleId` (unique), `name`, `avatarUrl`
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
├── app/                      # Next.js App Router (routes & layouts)
│   ├── (protected)/         # Protected routes (require auth)
│   │   ├── layout.tsx       # Protected layout wrapper
│   │   └── page.tsx         # Home/Todo page
│   ├── api/                 # API route handlers
│   │   ├── auth/           # NextAuth endpoints
│   │   └── todos/          # Todo CRUD endpoints
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout with providers
├── components/              # React components
│   ├── providers/          # Context providers
│   ├── AddTodoForm.tsx     # New todo form
│   ├── TodoList.tsx        # Todo list container
│   ├── TodoItem.tsx        # Individual todo item
│   ├── TodoFilters.tsx     # Filter buttons
│   └── UserMenu.tsx        # User menu with sign out
├── features/               # Domain logic
│   ├── auth/              # Auth hooks
│   └── todos/             # Todo hooks, queries, schemas
├── lib/                    # Shared infrastructure
│   ├── prisma.ts          # Prisma Client singleton
│   ├── auth.ts            # NextAuth config
│   ├── auth-utils.ts      # Auth utilities
│   └── query-client.ts    # React Query config
├── types/                  # TypeScript types
└── generated/              # Generated Prisma Client
    └── prisma/
```

For more detailed architecture and conventions, see [CLAUDE.md](CLAUDE.md).
