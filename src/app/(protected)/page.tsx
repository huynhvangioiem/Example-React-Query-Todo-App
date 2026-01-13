"use client";

import { UserMenu } from "@/components/UserMenu";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoList } from "@/components/TodoList";
import { mockTodos } from "@/data/mockTodos";
import { Todo, TodoFilter } from "@/types/todo";
import { useState, useMemo } from "react";

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>(mockTodos);
    const [filter, setFilter] = useState<TodoFilter>("all");

    /**
     * Filter todos based on current filter selection
     */
    const filteredTodos = useMemo(() => {
        switch (filter) {
            case "active":
                return todos.filter((todo) => !todo.completed);
            case "completed":
                return todos.filter((todo) => todo.completed);
            default:
                return todos;
        }
    }, [todos, filter]);

    /**
     * Calculate counts for filter badges
     */
    const counts = useMemo(
        () => ({
            all: todos.length,
            active: todos.filter((todo) => !todo.completed).length,
            completed: todos.filter((todo) => todo.completed).length,
        }),
        [todos]
    );

    /**
     * Add a new todo
     */
    const handleAddTodo = (title: string, description: string | null) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            description,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setTodos([newTodo, ...todos]);
    };

    /**
     * Toggle todo completion status
     */
    const handleToggleComplete = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          completed: !todo.completed,
                          updatedAt: new Date(),
                      }
                    : todo
            )
        );
    };

    /**
     * Delete a todo
     */
    const handleDeleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    /**
     * Edit a todo
     */
    const handleEditTodo = (id: string, title: string, description: string | null) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, title, description, updatedAt: new Date() } : todo
            )
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
            <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Todo App
                            </h1>
                        </div>
                        <UserMenu />
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Add Todo Form */}
                    <AddTodoForm onAdd={handleAddTodo} />

                    {/* Filters */}
                    <TodoFilters
                        currentFilter={filter}
                        onFilterChange={setFilter}
                        counts={counts}
                    />

                    {/* Todo List */}
                    <TodoList
                        todos={filteredTodos}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTodo}
                        onEdit={handleEditTodo}
                    />

                    {/* Stats */}
                    {todos.length > 0 && (
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-xs">
                                            {counts.active}
                                        </span>
                                    </div>
                                    <span className="text-gray-600">
                                        active {counts.active === 1 ? "task" : "tasks"}
                                    </span>
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-semibold text-xs">
                                            {counts.completed}
                                        </span>
                                    </div>
                                    <span className="text-gray-600">
                                        completed {counts.completed === 1 ? "task" : "tasks"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
