/**
 * Todo item type definition
 */
export interface Todo {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Filter options for todo list
 */
export type TodoFilter = "all" | "active" | "completed";
