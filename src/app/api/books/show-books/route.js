import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
    try {
        const books = await prisma.book.findMany();

        const safeBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            totalBook: book.totalBook,
            available: book.available,
            description: book.description,
            imageUrl: book.imageUrl,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
            bookings: book.bookings,
        }));
        return NextResponse.json(safeBooks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch books", details: error.message }, { status: 500 });
    }
}