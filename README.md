# 📚 Library Online Booking System

A full-stack **Library Management & Online Booking System** built with **Next.js 14, Prisma, and MongoDB**.  
Students/Members can search, reserve, and manage books online. Librarians/Admins can manage books, categories, users, and bookings.

---

## 🚀 Features

### 👨‍🎓 For Members/Students
- 🔐 Authentication (NextAuth.js with credentials)
- 🔍 Search books by title, author, ISBN, or category etc
- 📖 Reserve books (check availability in real time)
- ❤️ Favorite books
- 👤 User dashboard with bookings & favorites etc
- ✏️ Update profile (name, email, profile picture via Cloudinary)

### 👩‍💼 For Admin/Librarian
- 📚 Add / Update / Delete books
- 🏷️ Manage categories
- ✅ Approve/Reject reservations
- 📊 Track issued/returned books
- 💰 Fine calculation for late returns 

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: Next.js API Routes
- **Database**: MongoDB + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Uploads**: [Cloudinary](https://cloudinary.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📂 Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String?
  email     String   @unique
  password  String?
  role      String   @default("member")
  imageUrl  String?
  bookings  Booking[]
  favorites Favorite[]
}

model Book {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  author      String
  isbn        String   @unique
  totalBook   Int
  available   Boolean  @default(true)
  description String?
  imageUrl    String?
  categoryId  String?   @db.ObjectId
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bookings  Booking[]
  favorites Favorite[]
}

model Category {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   @unique
  slug      String   @unique
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  books     Book[]
  favorites Favorite[]
}

model Booking {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @db.ObjectId
  bookId       String   @db.ObjectId
  status       String
  dueDate      DateTime?
  createdAt    DateTime @default(now())
  returnedAt   DateTime?
  fine         Int      @default(0)
  daysRemaining Int     @default(30)

  user   User @relation(fields: [userId], references: [id])
  book   Book @relation(fields: [bookId], references: [id])
}

model Favorite {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  bookId    String   @db.ObjectId
  createdAt DateTime @default(now())

  user   User @relation(fields: [userId], references: [id])
  book   Book @relation(fields: [bookId], references: [id])
}
