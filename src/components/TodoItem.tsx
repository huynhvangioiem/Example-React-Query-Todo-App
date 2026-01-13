"use client";

import { Todo } from "@/types/todo";
import { useState, useEffect, useRef } from "react";

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, description: string | null) => void;
}

/**
 * Individual todo item component with actions
 *
 * @param props - Component props
 * @param props.todo - Todo item data
 * @param props.onToggleComplete - Callback for toggling completion status
 * @param props.onDelete - Callback for deleting todo
 * @param props.onEdit - Callback for editing todo
 */
export function TodoItem({ todo, onToggleComplete, onDelete, onEdit }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || "");
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleStartEdit = () => {
        // Reset edit state to current todo values when entering edit mode
        setEditTitle(todo.title);
        setEditDescription(todo.description || "");
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit(todo.id, editTitle.trim(), editDescription.trim() || null);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditDescription(todo.description || "");
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            handleCancel();
        } else if (e.key === "Enter" && e.metaKey) {
            handleSave();
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            {isEditing ? (
                <div className="space-y-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Todo title"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        placeholder="Description (optional)"
                        rows={3}
                    />
                    <div className="flex gap-2 justify-end pt-1">
                        <button
                            onClick={handleCancel}
                            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!editTitle.trim()}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-4">
                    <div className="flex items-center pt-0.5">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => onToggleComplete(todo.id)}
                            className="h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all hover:scale-110"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-lg font-semibold transition-all ${
                                todo.completed ? "line-through text-gray-400" : "text-gray-900"
                            }`}
                        >
                            {todo.title}
                        </h3>
                        {todo.description && (
                            <p
                                className={`mt-1.5 text-sm leading-relaxed transition-all ${
                                    todo.completed ? "line-through text-gray-400" : "text-gray-600"
                                }`}
                            >
                                {todo.description}
                            </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {new Date(todo.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleStartEdit}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all"
                            title="Edit todo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg transition-all"
                            title="Delete todo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
