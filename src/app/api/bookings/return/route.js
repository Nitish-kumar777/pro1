import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // <-- import your auth options
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, bookId } = await req.json();

    // Start a transaction to update both booking and book
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status to returned
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "returned", returnedAt: new Date() },
      });

      // Update book availability and increment totalBook
      const book = await tx.book.update({
        where: { id: bookId },
        data: { 
          available: true,
          totalBook: { increment: 1 }
        },
      });

      return { booking, book };
    });

    return NextResponse.json({ 
      message: "Book returned successfully",
      booking: result.booking 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong while returning the book" }, 
      { status: 500 }
    );
  }
}