import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });

    // Add return deadline to each booking (1 month from creation)
    const bookingsWithDeadline = bookings.map(booking => {
      const returnDeadline = new Date(booking.createdAt);
      returnDeadline.setMonth(returnDeadline.getMonth() + 1);
      
      return {
        ...booking,
        returnDeadline: returnDeadline.toISOString()
      };
    });

    return NextResponse.json({ bookings: bookingsWithDeadline });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong while fetching bookings" }, 
      { status: 500 }
    );
  }
}