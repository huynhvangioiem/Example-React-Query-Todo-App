"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { getQueryClient } from "@/lib/query-client";

/**
 * Query provider component that wraps the app with React Query
 *
 * @param props - Component props
 * @param props.children - Child components
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
