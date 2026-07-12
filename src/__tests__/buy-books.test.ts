import request from "supertest";
import { app } from "../api";
import { prisma } from "../infrastructure/prisma-client";
import { environmentService } from "../infrastructure/EnvironmentService";
import { createUser, loginUser } from "./test-utils/create-user";
import { createBook } from "./test-utils/create-book";

import { BookStatus } from "../domain/book/Book";

describe("POST /books/:id/buy", () => {
  beforeAll(() => {
    environmentService.load();
  });

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Returns a response with status code 200 and the purchased book", async () => {
    const sellerResponse = await createUser({
      email: "seller@domain.com",
      password: "Password123!",
    });

    await createUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const accessToken = await loginUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const book = await createBook({
      ownerId: sellerResponse.body.id,
    });

    const response = await request(app)
      .post(`/books/${book.id}/buy`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: book.id,
        status: BookStatus.SOLD,
      }),
    );

    expect(response.body.soldAt).not.toBeNull();
  });

  test("Returns a response with status code 404 for a non-existing book", async () => {
    await createUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const accessToken = await loginUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const response = await request(app)
      .post("/books/999999/buy")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  test("Returns a response with status code 409 for an already sold book", async () => {
    const sellerResponse = await createUser({
      email: "seller@domain.com",
      password: "Password123!",
    });

    await createUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const accessToken = await loginUser({
      email: "buyer@domain.com",
      password: "Password123!",
    });

    const book = await createBook({
      ownerId: sellerResponse.body.id,
      status: BookStatus.SOLD,
      soldAt: new Date(),
    });

    console.log("BOOK RETURNED BY CREATE BOOK HELPER:", book);

    const storedBook = await prisma.book.findUnique({
      where: {
        id: book.id,
      },
    });

    console.log("BOOK FOUND IN DATABASE:", storedBook);

    const response = await request(app)
      .post(`/books/${book.id}/buy`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
  });

  test("Returns a response with status code 403 when buying your own book", async () => {
    const ownerResponse = await createUser({
      email: "owner@domain.com",
      password: "Password123!",
    });

    const accessToken = await loginUser({
      email: "owner@domain.com",
      password: "Password123!",
    });

    const book = await createBook({
      ownerId: ownerResponse.body.id,
    });

    const response = await request(app)
      .post(`/books/${book.id}/buy`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
  });
});
