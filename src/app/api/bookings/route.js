import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reserve a book
export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();

    // Book check with totalBook field
    const book = await prisma.book.findUnique({ 
      where: { id: bookId } 
    });
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    
    // Check if book is available based on totalBook count
    if (book.totalBook === 0 || !book.available) {
      return NextResponse.json({ error: "Book not available" }, { status: 400 });
    }

    // User fetch
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          bookId,
          status: "reserved"
        },
      });

      // Update user's bookings
      await tx.user.update({
        where: { id: user.id },
        data: { 
          bookings: { connect: { id: booking.id } } 
        },
      });

      // Calculate new totalBook count
      const newTotalBook = book.totalBook - 1;
      
      // Update book availability and totalBook count
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: { 
          totalBook: newTotalBook,
          available: newTotalBook > 0 // Set available to false only when totalBook reaches 0
        },
      });

      return { booking, updatedBook };
    });

    return NextResponse.json({ 
      booking: result.booking,
      message: `Book reserved successfully. ${result.updatedBook.totalBook} copies remaining.`
    });

  } catch (err) {
    console.error("Reservation error:", err);
    return NextResponse.json(
      { error: "Something went wrong while reserving the book" }, 
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check book availability
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        available: true,
        totalBook: true
      }
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      available: book.available,
      totalBook: book.totalBook,
      status: book.totalBook > 0 ? "Available" : "Out of stock"
    });

  } catch (err) {
    console.error("Availability check error:", err);
    return NextResponse.json(
      { error: "Something went wrong while checking availability" }, 
      { status: 500 }
    );
  }
}