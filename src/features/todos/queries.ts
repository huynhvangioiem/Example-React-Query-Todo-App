import { Todo } from "@/types/todo";
import { CreateTodoInput, UpdateTodoInput } from "./schemas";

/**
 * Fetch all todos for the authenticated user
 *
 * @returns Promise resolving to array of todos
 * @throws Error if fetch fails or user is unauthorized
 */
export async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch("/api/todos");

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch todos");
    }

    return response.json();
}

/**
 * Create a new todo
 *
 * @param data - Todo creation data
 * @returns Promise resolving to the created todo
 * @throws Error if creation fails
 */
export async function createTodo(data: CreateTodoInput): Promise<Todo> {
    const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create todo");
    }

    return response.json();
}

/**
 * Update an existing todo
 *
 * @param id - Todo ID
 * @param data - Todo update data
 * @returns Promise resolving to the updated todo
 * @throws Error if update fails
 */
export async function updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
    const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update todo");
    }

    return response.json();
}

/**
 * Delete a todo
 *
 * @param id - Todo ID
 * @returns Promise resolving when deletion is complete
 * @throws Error if deletion fails
 */
export async function deleteTodo(id: string): Promise<void> {
    const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete todo");
    }
}
