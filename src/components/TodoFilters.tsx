"use client";

import { TodoFilter } from "@/types/todo";

interface TodoFiltersProps {
    currentFilter: TodoFilter;
    onFilterChange: (filter: TodoFilter) => void;
    counts: {
        all: number;
        active: number;
        completed: number;
    };
}

/**
 * Filter component for todo list
 *
 * @param props - Component props
 * @param props.currentFilter - Currently active filter
 * @param props.onFilterChange - Callback when filter is changed
 * @param props.counts - Count of todos for each filter
 */
export function TodoFilters({ currentFilter, onFilterChange, counts }: TodoFiltersProps) {
    const filters: { value: TodoFilter; label: string; count: number }[] = [
        { value: "all", label: "All", count: counts.all },
        { value: "active", label: "Active", count: counts.active },
        { value: "completed", label: "Completed", count: counts.completed },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
            <div className="flex gap-1">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            currentFilter === filter.value
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md scale-105"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {filter.label}
                            <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all ${
                                    currentFilter === filter.value
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {filter.count}
                            </span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
