import request from "supertest";
import { app } from "../api";
import { prisma } from "./test-utils/prisma-client";
import { createUser, loginUser } from "./test-utils/create-user";
import { environmentService } from "../infrastructure/EnvironmentService";

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

//Create book
describe("POST /books", () => {
  test("Returns a response with status code 201 and the created book", async () => {
    const createdUser = await createUser();

    console.log("CREATED USER RESPONSE:", createdUser.body);

    const token = await loginUser();
    console.log(token);

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "The Hobbit",
        description:
          "A fantasy novel long enough to satisfy the validation rules.",
        author: "J.R.R. Tolkien",
        price: 19.99,
        genre: "FANTASY",
      });

    console.log(response.status);
    console.log(response.body);
    expect(response.status).toBe(201);
  });
});

//Non-authenticated user
describe("POST /books", () => {
  test("Returns a response with status code 401 for a non-authenticated user", async () => {
    const response = await request(app).post("/books").send({
      title: "The Hobbit",
      description:
        "A fantasy novel long enough to satisfy the validation rules.",
      author: "J.R.R. Tolkien",
      price: 19.99,
      genre: "FANTASY",
    });

    expect(response.status).toBe(401);
  });
});

//Invalid book data

describe("POST /books", () => {
  test("Returns a response with status code 400 for invalid book data", async () => {
    await createUser();
    const token = await loginUser();

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "A",
        description: "Too short",
        author: "Bob",
        price: -10,
        genre: "INVALID_GENRE",
      });

    expect(response.status).toBe(400);
  });
});
