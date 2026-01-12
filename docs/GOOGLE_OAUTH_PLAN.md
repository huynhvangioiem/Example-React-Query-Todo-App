# Google OAuth Login Implementation Plan

## Overview

Implement Google OAuth authentication for the Todo app using **NextAuth.js v4** with the Google provider. Users will sign in exclusively via Google (no password-based auth).

## Prerequisites

- [ ] Google Cloud Console project with OAuth 2.0 credentials
- [ ] Environment variables configured

---

## Phase 1: Google Cloud Setup

### 1.1 Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Todo App
   - Scopes: `email`, `profile`, `openid`
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

### 1.2 Environment Variables

Create/update `.env.local`:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/todoapp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Phase 2: NextAuth.js Configuration

### 2.1 Create Auth Configuration

**File: `src/lib/auth.ts`**

```typescript
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow Google sign-in
      if (account?.provider !== "google") return false;

      // Upsert user in database
      await prisma.user.upsert({
        where: { googleId: account.providerAccountId },
        update: {
          email: user.email!,
          name: user.name,
          avatarUrl: user.image,
        },
        create: {
          email: user.email!,
          googleId: account.providerAccountId,
          name: user.name,
          avatarUrl: user.image,
        },
      });

      return true;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { googleId: token.sub },
          select: { id: true },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      // Persist Google ID in token
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
```

### 2.2 Create API Route Handler

**File: `src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 2.3 Extend NextAuth Types

**File: `src/types/next-auth.d.ts`**

```typescript
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

---

## Phase 3: Auth Provider Setup

### 3.1 Create Session Provider

**File: `src/components/providers/AuthProvider.tsx`**

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 3.2 Update Root Layout

**File: `src/app/layout.tsx`**

Wrap the app with `AuthProvider`:

```typescript
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Phase 4: Login Page

### 4.1 Create Login Page

**File: `src/app/login/page.tsx`**

```typescript
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in to Todo App
        </h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3
                     border border-gray-300 rounded-lg hover:bg-gray-50
                     transition-colors"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      {/* Google icon SVG path */}
    </svg>
  );
}
```

---

## Phase 5: Protected Routes & Auth Utilities

### 5.1 Server-Side Auth Helper

**File: `src/lib/auth-utils.ts`**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
```

### 5.2 Client-Side Auth Hook

**File: `src/features/auth/hooks/useAuth.ts`**

```typescript
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    signIn: () => signIn("google"),
    signOut: () => signOut({ callbackUrl: "/login" }),
  };
}
```

### 5.3 Protected Layout (Optional)

**File: `src/app/(protected)/layout.tsx`**

```typescript
import { getRequiredSession } from "@/lib/auth-utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredSession(); // Redirects to /login if not authenticated
  return <>{children}</>;
}
```

---

## Phase 6: Update API Routes for Auth

### 6.1 Example: Protected Todo API

**File: `src/app/api/todos/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Validate with Zod...

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      description: body.description,
      userId: session.user.id,
    },
  });

  return NextResponse.json(todo, { status: 201 });
}
```

---

## Phase 7: UI Components

### 7.1 User Menu Component

**File: `src/components/UserMenu.tsx`**

```typescript
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.image && (
        <Image
          src={user.image}
          alt={user.name ?? "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span>{user.name}</span>
      <button
        onClick={() => signOut()}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
```

---

## Implementation Checklist

### Setup
- [ ] Create Google Cloud OAuth credentials
- [ ] Add environment variables to `.env.local`

### Backend
- [ ] Create `src/lib/auth.ts` with NextAuth configuration
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Create `src/types/next-auth.d.ts` for type extensions
- [ ] Create `src/lib/auth-utils.ts` for server-side helpers

### Frontend
- [ ] Create `src/components/providers/AuthProvider.tsx`
- [ ] Update `src/app/layout.tsx` with AuthProvider
- [ ] Create `src/app/login/page.tsx`
- [ ] Create `src/features/auth/hooks/useAuth.ts`
- [ ] Create `src/components/UserMenu.tsx`

### Protection
- [ ] Create protected layout at `src/app/(protected)/layout.tsx`
- [ ] Update existing API routes to check auth
- [ ] Ensure all todo operations are scoped to user ID

### Testing
- [ ] Test sign-in flow
- [ ] Test sign-out flow
- [ ] Test protected routes redirect to login
- [ ] Test API returns 401 for unauthenticated requests
- [ ] Test user data persists correctly in database

---

## File Structure After Implementation

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── todos/
│   │       └── route.ts
│   ├── (protected)/
│   │   └── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── providers/
│   │   └── AuthProvider.tsx
│   └── UserMenu.tsx
├── features/
│   └── auth/
│       └── hooks/
│           └── useAuth.ts
├── lib/
│   ├── auth.ts
│   ├── auth-utils.ts
│   └── prisma.ts
├── types/
│   └── next-auth.d.ts
└── generated/
    └── prisma/
```

---

## Production Considerations

1. **Update OAuth redirect URIs** in Google Cloud Console for production domain
2. **Set environment variables** in your hosting platform (Vercel, etc.)
3. **Update `NEXTAUTH_URL`** to production URL
4. **Generate a strong `NEXTAUTH_SECRET`** for production
5. Consider adding **rate limiting** to auth endpoints
6. Add **error tracking** (Sentry, etc.) for auth failures
