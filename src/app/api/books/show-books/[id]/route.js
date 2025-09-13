import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";


const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'book ID is required.' }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ message: 'book not found.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}



export async function PUT(request, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "book ID is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    let imageUrl = body.imageUrl;

    // If imageUrl is base64, upload to Cloudinary
    if (imageUrl && imageUrl.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(imageUrl, {
        folder: "library_books",
      });
      imageUrl = uploadRes.secure_url;
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        description: body.description,
        imageUrl,
        totalBook: Number(body.totalBook),
        available: body.available,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'book ID is required.' }, { status: 400 });
  }

  try {
    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}