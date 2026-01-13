import { QueryClient } from "@tanstack/react-query";

/**
 * Create a new QueryClient instance with default configuration
 *
 * @returns Configured QueryClient instance
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get the QueryClient instance for browser
 * Creates a singleton instance in the browser
 *
 * @returns QueryClient instance
 */
export function getQueryClient() {
    if (typeof window === "undefined") {
        // Server: always create a new QueryClient
        return makeQueryClient();
    } else {
        // Browser: reuse the same QueryClient
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
