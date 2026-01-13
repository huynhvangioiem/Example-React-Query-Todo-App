# 📌 Epic: Fullstack Todo App (Next.js + MySQL)

### **Goal**

> Build a fullstack Todo app using:
>
> -   Next.js (App Router)
> -   MySQL
> -   Prisma
> -   React Query
> -   Zustand
> -   React Hook Form
> -   Zod

---

## 🧱 **Epic 1: Project & Infrastructure Setup**

### 🎫 1.1 Initialize Next.js Project

**Description:**
Set up a Next.js project using App Router with TypeScript, ESLint, and a basic folder structure.

**Acceptance Criteria:**

-   Next.js App Router enabled
-   TypeScript strict mode
-   Folder structure:
    -   `app/`
    -   `app/api/`
    -   `features/`
    -   `lib/`
    -   `store/`
-   App runs with `npm run dev`

---

### 🎫 1.2 Setup MySQL & Prisma

**Description:**
Integrate MySQL database with Prisma ORM.

**Acceptance Criteria:**

-   Prisma installed & configured
-   `.env` contains DB connection
-   Prisma schema includes:
    -   User
    -   Todo
-   Initial migration created & applied
-   Prisma Client usable in Next.js

---

## 🔐 **Epic 2: Authentication (Google OAuth: Backend + Frontend)**

### 🎫 2.1 Auth API: Google Login

**Description:**
Implement Google OAuth-based login using Next.js Route Handlers (no password-based auth).

**Acceptance Criteria:**

-   Google OAuth configured (Client ID/Secret in `.env`)
-   OAuth callback handled via Next.js Route Handler (e.g. `GET /api/auth/google/callback`)
-   On successful Google login:
    -   User record is created/updated in DB (no password stored)
    -   Session cookie or JWT issued and scoped to user
    -   Basic user profile returned (id, name, email, avatar)
-   Returns:
    -   JWT token _or_ session cookie
    -   User info
-   Returns 401 on invalid credentials

---

### 🎫 2.2 Login Page (Frontend)

**Description:**
Build login UI with validation.

**Acceptance Criteria:**

-   Route: `/login`
-   Uses React Hook Form + Zod validation
-   Fields:
    -   `email` (required, valid)
    -   `password` (min length)
-   Shows inline validation errors
-   Disables submit while loading
-   Redirects to `/todos` on success
-   Shows server error on failure

---

### 🎫 2.3 Auth Guard (Protected Routes)

**Description:**
Protect dashboard routes from unauthenticated users.

**Acceptance Criteria:**

-   Unauthenticated access redirects to `/login`
-   Auth check works on refresh
-   Token/session validated on server

---

## 📦 **Epic 3: Todo Backend (API + DB)**

### 🎫 3.1 Todo API: CRUD

**Description:**
Implement CRUD API for todos.

**Acceptance Criteria:**

-   Endpoints:
    -   `GET /api/todos`
    -   `GET /api/todos/:id`
    -   `POST /api/todos`
    -   `PATCH /api/todos/:id`
    -   `DELETE /api/todos/:id`
-   Todos scoped by logged-in user
-   404 if todo not found
-   Input validated with Zod

---

### 🎫 3.2 Todo Query Features

**Description:**
Support query params for listing.

**Acceptance Criteria:**

-   Search by title
-   Filter by completed status
-   Pagination _or_ limit/offset
-   Consistent response format

---

## ⚛️ **Epic 4: Todo Frontend (React Query)**

### 🎫 4.1 Todo List Page

**Description:**
Build Todo list UI with React Query.

**Acceptance Criteria:**

-   Route: `/todos`
-   Fetch todos via React Query
-   Loading skeleton
-   Empty state UI
-   Error state + retry
-   Debounced search input
-   Cache persists on navigation

---

### 🎫 4.2 Todo Detail Page

**Description:**
Show todo details.

**Acceptance Criteria:**

-   Route: `/todos/[id]`
-   Fetch todo by ID
-   Use cache if available
-   Show 404 UI if not found
-   Back navigation supported

---

### 🎫 4.3 Create Todo (Optimistic)

**Description:**
Add new todo with optimistic update.

**Acceptance Criteria:**

-   Form with RHF + Zod
-   Optimistic item added to list
-   Replace temp item on success
-   Rollback on error
-   Invalidate queries if needed

---

### 🎫 4.4 Toggle & Edit Todo (Optimistic)

**Description:**
Update todo fields.

**Acceptance Criteria:**

-   Checkbox toggles completed
-   Edit title/description
-   Optimistic UI update
-   Rollback on failure
-   Detail & list stay in sync

---

### 🎫 4.5 Delete Todo (Optimistic)

**Description:**
Delete todo with confirmation.

**Acceptance Criteria:**

-   Confirm dialog before delete
-   Optimistic remove from list
-   Rollback on failure
-   Redirect from detail page if deleted

---

## 🧠 **Epic 5: Client UI State (Zustand)**

### 🎫 5.1 Theme & Sidebar State

**Description:**
Manage UI-only state.

**Acceptance Criteria:**

-   Zustand store for:
    -   dark/light mode
    -   sidebar collapsed
-   State persisted in localStorage
-   Toggle works instantly
-   No server data stored here

---

## 🧩 **Epic 6: Layout & Routing**

### 🎫 6.1 Dashboard Layout

**Description:**
Create shared layout for authenticated pages.

**Acceptance Criteria:**

-   Sidebar + Topbar layout
-   Nested routes via App Router
-   Active route highlighting
-   Responsive behavior

---

### 🎫 6.2 Error & Loading Boundaries

**Description:**
Improve UX with route-level states.

**Acceptance Criteria:**

-   `loading.tsx` for slow routes
-   `error.tsx` for route errors
-   Global error boundary exists
-   Friendly error messages shown

---

## 🧪 **Epic 7: Quality & DX**

### 🎫 7.1 Type Safety & Validation

**Description:**
Ensure strict typing across the stack.

**Acceptance Criteria:**

-   Zod schemas shared where possible
-   API responses typed
-   No `any`
-   Prisma types used correctly

---

### 🎫 7.2 UX Polish

**Description:**
Improve overall user experience.

**Acceptance Criteria:**

-   Toasts for success/error
-   Disable buttons during submit
-   Accessible labels & keyboard navigation
-   Confirm dialogs trap focus

---

## 🏁 **Definition of Done (Global)**

-   CRUD works end-to-end
-   Optimistic updates implemented
-   Frontend & Backend separated cleanly
-   App survives refresh
-   Code structure is scalable

---

## ➡️ **Next Steps (If Needed)**

-   [ ] Convert each Story into subtask checklist
-   [ ] Draw data flow diagram (Next.js FE ↔ API ↔ Prisma)
-   [ ] Create folder structure + code skeleton for each Epic
