"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";

/**
 * UserMenu Component
 *
 * Displays the authenticated user's avatar, name, and a sign-out button.
 * Typically placed in the app header/navbar.
 */
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
            <span className="text-sm font-medium text-gray-700">{user.name ?? user.email}</span>
            <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors
                   px-3 py-1 rounded-md hover:bg-gray-100"
            >
                Sign out
            </button>
        </div>
    );
}
