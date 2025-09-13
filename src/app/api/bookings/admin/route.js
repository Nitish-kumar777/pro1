// app/api/bookings/admin/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");
    const status = searchParams.get("status");

    // Build where clause based on query parameters
    let whereClause = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (bookId) {
      whereClause.bookId = bookId;
    }
    
    if (status && status !== "all") {
      if (status === "returned") {
        whereClause.status = "returned";
      } else {
        // For active/overdue, we'll filter after fetching
        whereClause.status = { not: "returned" };
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Additional filtering for active/overdue status
    let filteredBookings = bookings;
    if (status === "active" || status === "overdue") {
      const today = new Date();
      filteredBookings = bookings.filter(booking => {
        const returnDate = new Date(booking.createdAt);
        returnDate.setMonth(returnDate.getMonth() + 1);
        const isOverdue = returnDate < today;
        return status === "overdue" ? isOverdue : !isOverdue;
      });
    }

    return NextResponse.json({ bookings: filteredBookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong while fetching bookings" },
      { status: 500 }
    );
  }
}