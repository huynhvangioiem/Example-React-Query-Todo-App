import { z } from "zod";

/**
 * Schema for creating a new todo
 */
export const createTodoSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters"),
    description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional()
        .nullable(),
});

/**
 * Schema for updating an existing todo
 */
export const updateTodoSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters")
        .optional(),
    description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional()
        .nullable(),
    completed: z.boolean().optional(),
});

/**
 * Type for creating a todo
 */
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

/**
 * Type for updating a todo
 */
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
