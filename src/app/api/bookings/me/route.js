import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DAILY_FINE_AMOUNT = 20; // ₹20 per day fine

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });

    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // Skip calculation if already returned
        if (booking.status === "returned") {
          return booking;
        }

        const returnDeadline = new Date(booking.createdAt);
        returnDeadline.setMonth(returnDeadline.getMonth() + 1);

        const today = new Date();
        const diffTime = returnDeadline - today;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let fine = 0;
        let status = "active";

        if (diffDays < 0) {
          fine = Math.abs(diffDays) * DAILY_FINE_AMOUNT; // ₹20 per overdue day
          status = "overdue";
        } else {
          status = "active";
        }

        // Update DB only if values have changed
        if (
          booking.fine !== fine ||
          booking.daysRemaining !== diffDays ||
          booking.status !== status
        ) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              fine,
              daysRemaining: diffDays,
              status,
            },
          });
        }

        return {
          ...booking,
          returnDeadline: returnDeadline.toISOString(),
          fine,
          daysRemaining: diffDays,
          status,
        };
      })
    );

    return NextResponse.json({ bookings: updatedBookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong while fetching bookings" },
      { status: 500 }
    );
  }
}