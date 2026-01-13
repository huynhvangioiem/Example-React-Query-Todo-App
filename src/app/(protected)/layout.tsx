import { getRequiredSession } from "@/lib/auth-utils";
import { ReactNode } from "react";

/**
 * Protected Layout
 *
 * This layout wraps all routes in the (protected) route group.
 * It ensures that only authenticated users can access these pages.
 * Unauthenticated users are automatically redirected to /login.
 *
 * Any page placed in app/(protected)/ will require authentication.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    // This will redirect to /login if not authenticated
    await getRequiredSession();

    return <>{children}</>;
}
