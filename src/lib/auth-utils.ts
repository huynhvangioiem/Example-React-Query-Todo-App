import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

/**
 * Server-side helper to get the current session and require authentication.
 * Redirects to /login if the user is not authenticated.
 *
 * Use this in Server Components and API routes where authentication is required.
 *
 * @returns The authenticated session
 * @throws Redirects to /login if not authenticated
 */
export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

/**
 * Server-side helper to get the current user if authenticated.
 * Returns null if not authenticated (does not redirect).
 *
 * Use this in Server Components where you want to check auth status
 * but don't require authentication.
 *
 * @returns The user object or null
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
