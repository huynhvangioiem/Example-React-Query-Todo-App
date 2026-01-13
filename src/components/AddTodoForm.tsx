"use client";

import { useState } from "react";

interface AddTodoFormProps {
    onAdd: (title: string, description: string | null) => void;
}

/**
 * Form component for adding new todos
 *
 * @param props - Component props
 * @param props.onAdd - Callback function to add a new todo
 *
 * @example
 * ```tsx
 * <AddTodoForm onAdd={(title, description) => {
 *   console.log('New todo:', title, description);
 * }} />
 * ```
 */
export function AddTodoForm({ onAdd }: AddTodoFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (title.trim().length < 3) {
            setError("Title must be at least 3 characters");
            return;
        }

        // Add todo
        onAdd(title.trim(), description.trim() || null);

        // Reset form
        setTitle("");
        setDescription("");
        setError("");
        setIsExpanded(false);
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setError("");
        setIsExpanded(false);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError("");
                            }}
                            onFocus={() => setIsExpanded(true)}
                            className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${
                                error
                                    ? "border-red-300 focus:ring-red-500 focus:border-transparent"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                            }`}
                            placeholder="What needs to be done?"
                        />
                        {title && !isExpanded && (
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all"
                                title="Add todo"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                    {error && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </p>
                    )}
                </div>

                {isExpanded && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white transition-all"
                            placeholder="Add more details... (optional)"
                            rows={3}
                        />
                        <div className="flex gap-2 justify-end pt-1">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Add Todo
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
