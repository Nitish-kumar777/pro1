import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user from session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { bookId } = await req.json();

    // Check if already saved
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        bookId,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already in favorites" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        bookId,
      },
    });

    return NextResponse.json({ message: "Book saved!", favorite });
  } catch (error) {
    console.error("Save Favorite Error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ favorites: [] }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { book: true },
      },
    },
  });

  return NextResponse.json({ favorites: user?.favorites || [] });
}