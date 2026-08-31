import { prisma } from "../infrastructure/prisma-client";
import bcrypt from "bcrypt";
const CREDENTIALS = {
  email: "test-user@domain.com",
  password: "RandomPassword123*",
};

async function seedFunction() {
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(CREDENTIALS.password, 10);
  const createdUser = await prisma.user.create({
    data: {
      email: CREDENTIALS.email,
      password: hashedPassword,
    },
  });

  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  for (let i = 0; i < 20; i++) {
    await prisma.book.create({
      data: {
        title: `Seed Book ${i}`,
        description:
          "A seeded fantasy novel long enough to satisfy the validation rules.",
        author: `Author ${i}`,
        price: 10 + i,
        genre: "FANTASY",
        status: "PUBLISHED",
        ownerId: createdUser.id,
        createdAt: tenDaysAgo,
      },
    });
  }

  console.log("Seed completed successfully.");
}

async function main() {
  try {
    await seedFunction();
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
