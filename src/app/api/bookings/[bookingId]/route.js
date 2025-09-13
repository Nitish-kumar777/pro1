import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // <-- import your auth options
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const role = "admin";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const bookingId = url.pathname.split("/").pop();

    const booking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ 
      message: "Booking deleted successfully",
      booking 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong while deleting the booking" }, 
      { status: 500 }
    );
  }
}