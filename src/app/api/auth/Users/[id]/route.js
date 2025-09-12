import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { role } = await request.json();

  if (!id || !role) {
    return NextResponse.json({ message: 'User ID and role are required.' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}