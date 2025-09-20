import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import cloudinary from "@/lib/cloudinary"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const formData = await req.formData()
    const title = formData.get("title")
    const author = formData.get("author")
    const isbn = formData.get("isbn")
    const totalBook = parseInt(formData.get("totalBook")) || 1
    const description = formData.get("description")
    const categoryId = formData.get("categoryId") // ✅ get categoryId
    const file = formData.get("image")

    let imageUrl = null

    if (file && typeof file.arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "library_books" }, (err, result) => {
            if (err) reject(err)
            else resolve(result)
          })
          .end(buffer)
      })

      imageUrl = uploadRes.secure_url
    }

    // Check if the book already exists by ISBN
    const existingBook = await prisma.book.findUnique({
      where: { isbn }
    })

    if (existingBook) {
      return NextResponse.json(
        { error: "A book with this ISBN already exists" }, 
        { status: 400 }
      )
    }

    // Create the book with available field set to true by default
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        totalBook,
        available: true,
        description: description || null,
        categoryId: categoryId || null, // ✅ associate category if provided
        imageUrl: imageUrl || null, // Store the image URL in the database
      },
    })

    return NextResponse.json(book)
  } catch (err) {
    console.error("Book upload error:", err)
    return NextResponse.json(
      { error: "Failed to upload book" }, 
      { status: 500 }
    )
  }
}