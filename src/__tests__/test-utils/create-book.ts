import { BookGenre, BookStatus } from "@prisma/client";
import { prisma } from "./prisma-client";

// Creates a book directly in the test database.
// If no valid ownerId is provided > creates user first to satisfy book_ownerId-fkey schema

export async function createBook(
  overrides: {
    title?: string;
    description?: string;
    author?: string;
    price?: number;
    genre?: BookGenre;
    status?: BookStatus;
    ownerId?: number;
    soldAt?: Date | null;
  } = {},
) {
  let ownerId = overrides.ownerId;

  if (!ownerId) {
    const user = await prisma.user.create({
      data: {
        email: `create-book-user-${Date.now()}@domain.com`,
        password: "hashedPassword123*",
      },
    });

    ownerId = user.id;
  }

  return prisma.book.create({
    data: {
      title: "Test Book",
      description:
        "Test book description long enough to satisfy the validation rules.",
      author: "Test Author",
      price: 29.99,
      genre: BookGenre.FANTASY,
      status: BookStatus.PUBLISHED,
      soldAt: null,
      ownerId,
      ...overrides,
    },
  });
}
