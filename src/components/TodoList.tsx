"use client";

import { Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, description: string | null) => void;
}

/**
 * List component for displaying all todos
 *
 * @param props - Component props
 * @param props.todos - Array of todo items to display
 * @param props.onToggleComplete - Callback for toggling completion status
 * @param props.onDelete - Callback for deleting todo
 * @param props.onEdit - Callback for editing todo
 */
export function TodoList({ todos, onToggleComplete, onDelete, onEdit }: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="flex justify-center">
                    <div className="relative">
                        <svg
                            className="h-16 w-16 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="h-4 w-4 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">No todos yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start by adding your first task above</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo, index) => (
                <div
                    key={todo.id}
                    className="animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <TodoItem
                        todo={todo}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                </div>
            ))}
        </div>
    );
}
