import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req, { params }) {
  try {
    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name } = body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete Category
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
