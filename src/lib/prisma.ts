import { PrismaClient } from "../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma Client Singleton Pattern
 *
 * Prevents multiple Prisma Client instances in development (hot-reload) and production.
 * This is critical because:
 * 1. Each PrismaClient instance creates its own connection pool
 * 2. Multiple instances can exhaust database connections
 * 3. In Next.js development, hot-reloading can create new instances without cleanup
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-issues
 */

// Type-safe global storage for Prisma Client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Create MariaDB adapter with connection URL
 * The mariadb driver works with MySQL databases as well
 */
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

/**
 * Prisma Client singleton instance
 *
 * - In development: Stored in globalThis to survive hot-reloads
 * - In production: Created fresh on each serverless function invocation
 * - Prisma 7: Uses driver adapter for database connections
 *
 * @see https://www.prisma.io/docs/orm/overview/databases/database-drivers
 */
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });

// Store in globalThis in development to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma Client
 * Useful for cleanup in tests or graceful shutdowns
 */
export async function disconnectPrisma(): Promise<void> {
    await prisma.$disconnect();
}

// Optional: Handle process termination gracefully
if (typeof process !== "undefined") {
    process.on("beforeExit", async () => {
        await prisma.$disconnect();
    });
}
