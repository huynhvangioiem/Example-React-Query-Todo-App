import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createTodoSchema } from "@/features/todos/schemas";

/**
 * GET /api/todos
 * Get all todos for the authenticated user
 */
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const todos = await prisma.todo.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

/**
 * POST /api/todos
 * Create a new todo for the authenticated user
 */
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validatedData = createTodoSchema.parse(body);

        const todo = await prisma.todo.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                userId: session.user.id,
                completed: false,
            },
        });

        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }
}
