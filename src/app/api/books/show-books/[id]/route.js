import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: 'Book ID is required.' }, { status: 400 });
    }

    try {
        const book = await prisma.book.findUnique({
            where: { id: Number(id) }
        });

        if (!book) {
            return NextResponse.json({ message: 'Book not found.' }, { status: 404 });
        }
        return NextResponse.json(book, { status: 200 });
    } catch (error) {
        console.error('Error fetching book:', error);
        return NextResponse.json({ message: 'Error fetching book.' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { title, author, isbn, available , totalBook , description , imageUrl } = await request.json();

    if (!id || !title || !author || !isbn || available === undefined || totalBook === undefined || description === undefined || imageUrl === undefined) {
        return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    try {
        const book = await prisma.book.update({
            where: { id: Number(id) },
            data: { title, author, isbn, available, totalBook, description, imageUrl }
        });
        return NextResponse.json(book, { status: 200 });
    } catch (error) {
        console.error('Error updating book:', error);
        return NextResponse.json({ message: 'Error updating book.' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ message: 'Book ID is required.' }, { status: 400 });
    }

    try {
        const book = await prisma.book.findUnique({
            where: { id: Number(id) }
        });
        if (!book) {
            return NextResponse.json({ message: 'Book not found.' }, { status: 404 });
        }

        await prisma.book.delete({
            where: { id: Number(id) }
        });
        return NextResponse.json({ message: 'Book deleted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting book.' }, { status: 500 });
    }
}