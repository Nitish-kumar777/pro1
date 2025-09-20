import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug") || name.toLowerCase().replace(/\s+/g, "-");
    const imageFile = formData.get("image");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl = null;

    // ✅ Upload image to Cloudinary if provided
    if (imageFile && typeof imageFile.arrayBuffer === "function") {
      const arraybuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arraybuffer);
      
      // Convert buffer to base64 string
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: "library_categories"
        }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }).end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    // ✅ Create category in DB
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { books: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}