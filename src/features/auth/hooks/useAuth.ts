"use client";

import { useSession, signIn, signOut } from "next-auth/react";

/**
 * Client-side authentication hook
 *
 * Provides access to the current user, authentication status,
 * and sign-in/sign-out functions.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isLoading, isAuthenticated, signIn, signOut } = useAuth();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!isAuthenticated) return <button onClick={signIn}>Sign In</button>;
 *
 *   return (
 *     <div>
 *       <p>Welcome {user.name}</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    /** The authenticated user object, or null if not authenticated */
    user: session?.user ?? null,
    /** True while checking authentication status */
    isLoading: status === "loading",
    /** True if user is authenticated */
    isAuthenticated: status === "authenticated",
    /** Initiate Google sign-in flow */
    signIn: () => signIn("google"),
    /** Sign out and redirect to login page */
    signOut: () => signOut({ callbackUrl: "/login" }),
  };
}
