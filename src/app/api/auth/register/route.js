import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  const { name, email, password } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  // default role = member
  let role = "member"

  // special case: fixed admin email
  if (email === "nitish2kumar91@gmail.com") {
    role = "admin"
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })
console.log("Registered user:", user)
  return NextResponse.json({ id: user.id, email: user.email, role: user.role })
}
