import { Todo } from "@/types/todo";

/**
 * Mock todo data for development and testing
 */
export const mockTodos: Todo[] = [
    {
        id: "1",
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the todo app",
        completed: false,
        createdAt: new Date("2026-01-10T10:00:00Z"),
        updatedAt: new Date("2026-01-10T10:00:00Z"),
    },
    {
        id: "2",
        title: "Review pull requests",
        description: "Check and approve pending PRs from the team",
        completed: true,
        createdAt: new Date("2026-01-11T14:30:00Z"),
        updatedAt: new Date("2026-01-12T09:15:00Z"),
    },
    {
        id: "3",
        title: "Update dependencies",
        description: null,
        completed: false,
        createdAt: new Date("2026-01-12T16:45:00Z"),
        updatedAt: new Date("2026-01-12T16:45:00Z"),
    },
    {
        id: "4",
        title: "Fix bug in authentication flow",
        description: "User reported issue with Google OAuth redirect",
        completed: false,
        createdAt: new Date("2026-01-13T08:20:00Z"),
        updatedAt: new Date("2026-01-13T08:20:00Z"),
    },
    {
        id: "5",
        title: "Deploy to production",
        description: "Deploy the latest changes to production environment",
        completed: true,
        createdAt: new Date("2026-01-09T11:00:00Z"),
        updatedAt: new Date("2026-01-09T15:30:00Z"),
    },
];
