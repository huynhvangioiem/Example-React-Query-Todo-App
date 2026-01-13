import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./queries";
import { UpdateTodoInput } from "./schemas";
import { Todo } from "@/types/todo";

/**
 * Query key for todos
 */
export const todosKeys = {
    all: ["todos"] as const,
    lists: () => [...todosKeys.all, "list"] as const,
    list: (filters: string) => [...todosKeys.lists(), { filters }] as const,
    details: () => [...todosKeys.all, "detail"] as const,
    detail: (id: string) => [...todosKeys.details(), id] as const,
};

/**
 * Hook to fetch all todos
 *
 * @returns Query result with todos data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: todos, isLoading, error } = useTodos();
 * ```
 */
export function useTodos() {
    return useQuery({
        queryKey: todosKeys.lists(),
        queryFn: fetchTodos,
    });
}

/**
 * Hook to create a new todo
 *
 * @returns Mutation object with mutate function and status
 *
 * @example
 * ```tsx
 * const createMutation = useCreateTodo();
 * createMutation.mutate({ title: 'New todo', description: 'Details' });
 * ```
 */
export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTodo,
        onMutate: async (newTodo) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: todosKeys.lists() });

            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData<Todo[]>(todosKeys.lists());

            // Optimistically update to the new value
            queryClient.setQueryData<Todo[]>(todosKeys.lists(), (old) => {
                const optimisticTodo: Todo = {
                    id: `temp-${Date.now()}`,
                    title: newTodo.title,
                    description: newTodo.description || null,
                    completed: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                return [optimisticTodo, ...(old || [])];
            });

            return { previousTodos };
        },
        onError: (_err, _newTodo, context) => {
            // Rollback to previous value on error
            if (context?.previousTodos) {
                queryClient.setQueryData(todosKeys.lists(), context.previousTodos);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: todosKeys.lists() });
        },
    });
}

/**
 * Hook to update an existing todo
 *
 * @returns Mutation object with mutate function and status
 *
 * @example
 * ```tsx
 * const updateMutation = useUpdateTodo();
 * updateMutation.mutate({ id: '123', data: { completed: true } });
 * ```
 */
export function useUpdateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => updateTodo(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: todosKeys.lists() });

            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData<Todo[]>(todosKeys.lists());

            // Optimistically update
            queryClient.setQueryData<Todo[]>(todosKeys.lists(), (old) => {
                if (!old) return old;
                return old.map((todo) =>
                    todo.id === id ? { ...todo, ...data, updatedAt: new Date() } : todo
                );
            });

            return { previousTodos };
        },
        onError: (_err, _variables, context) => {
            // Rollback on error
            if (context?.previousTodos) {
                queryClient.setQueryData(todosKeys.lists(), context.previousTodos);
            }
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: todosKeys.lists() });
        },
    });
}

/**
 * Hook to delete a todo
 *
 * @returns Mutation object with mutate function and status
 *
 * @example
 * ```tsx
 * const deleteMutation = useDeleteTodo();
 * deleteMutation.mutate('123');
 * ```
 */
export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTodo,
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: todosKeys.lists() });

            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData<Todo[]>(todosKeys.lists());

            // Optimistically remove from list
            queryClient.setQueryData<Todo[]>(todosKeys.lists(), (old) => {
                if (!old) return old;
                return old.filter((todo) => todo.id !== id);
            });

            return { previousTodos };
        },
        onError: (_err, _id, context) => {
            // Rollback on error
            if (context?.previousTodos) {
                queryClient.setQueryData(todosKeys.lists(), context.previousTodos);
            }
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: todosKeys.lists() });
        },
    });
}
