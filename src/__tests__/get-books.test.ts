import request from "supertest";
import { app } from "../api";
import { prisma } from "./test-utils/prisma-client";
import { createUser } from "./test-utils/create-user";
import { environmentService } from "../infrastructure/EnvironmentService";
import { createBook } from "./test-utils/create-book";
import { Book } from "../domain/book/Book";

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



describe("GET /books", () => {

    test("Returns a response with status code 200 and the paginated books.", async () => {

        const createdUser = await createUser();
        for (let i= 0; i<20; i++) {

            await createBook({
                ownerId: createdUser.body.id,
                title: `Test book ${i}`,
            })
        }

       const response = await request(app)
       .get("/books?page=1&limit=10")

       expect(response.status).toBe(200)
       expect(response.body.data).toHaveLength(10);
       expect(response.body.meta.page).toBe(1);
       expect(response.body.meta.limit).toBe(10);
       expect(response.body.meta.total).toBe(20);

    })
  
});

//SEARCH PARAM AUTHOR 

describe("GET /books", () => {
    test("Returns a response with status code 200 and the books corresponding to search params (author) ", async() => {
         
        const createdUser = await createUser();
        const book1   =    await createBook({
                    title: "The Hobbit",
                    description:"A fantasy novel long enough to satisfy the validation rules.",
                    author: "J.R.R. Tolkien",
                    price: 19.99,
                    genre: "FANTASY",
                    ownerId:createdUser.body.id,

        })
    

        const book2 = await createBook({
                        title: "The Fellowship of the Ring",
                        description:
                            "A fantasy adventure long enough to satisfy the validation rules.",
                        author: "J.R. Tolkien",
                        price: 24.99,
                        genre: "FANTASY",
                        ownerId: createdUser.body.id,
                        });

        const book3 = await createBook({
                    title: "Harry Potter and the Philosopher's Stone",
                    description:
                        "A magical adventure long enough to satisfy the validation rules.",
                    author: "J.K. Rowling",
                    price: 18.99,
                    genre: "FANTASY",
                    ownerId: createdUser.body.id,
                    });

       const response = await request(app)
      
       .get("/books")
       .query({
        page:1,
        limit:10,
        search:"tolk"
       })

    //    console.log(response.body.data)

       const responseBooks = response.body.data.map((responseBook:Book) => responseBook.id)

       expect(response.status).toBe(200)
       expect(response.body.data).toHaveLength(2);
       expect(response.body.meta.total).toBe(2)
       expect(responseBooks).toContain(book1.id)
       expect(responseBooks).toContain(book2.id)
       expect(responseBooks).not.toContain(book3.id)
    
   

    })
})


describe("GET /books", () => {
    test("Returns a response with status code 200 and the books corresponding to search params (title) ", async() => {
         
        const createdUser = await createUser();
        const book1   =    await createBook({
                    title: "The Hobbit",
                    description:"A fantasy novel long enough to satisfy the validation rules.",
                    author: "J.R.R. Tolkien",
                    price: 19.99,
                    genre: "FANTASY",
                    ownerId:createdUser.body.id

        })

        const book2 = await createBook({
                        title: "The Fellowship of the Ring",
                        description:
                            "A fantasy adventure long enough to satisfy the validation rules.",
                        author: "J.R. Tolkien",
                        price: 24.99,
                        genre: "FANTASY",
                        ownerId: createdUser.body.id,
                        });

        const book3 = await createBook({
                    title: "Harry Potter and the Philosopher's Stone",
                    description:
                    "A magical adventure long enough to satisfy the validation rules.",
                    author: "J.K. Rowling",
                    price: 18.99,
                    genre: "FANTASY",
                    ownerId: createdUser.body.id,
                    });

       const response = await request(app)
      
       .get("/books")
       .query({
        page:1,
        limit:10,
        search:"potter"
       })

       const responseBooks = response.body.data.map((responseBook:Book) => responseBook.id)

       expect(response.status).toBe(200)
       expect(response.body.data).toHaveLength(1);
       expect(response.body.meta.total).toBe(1)
       expect(responseBooks).toContain(book3.id)
       expect(responseBooks).not.toContain(book1.id)
       expect(responseBooks).not.toContain(book2.id)
    
   

    })
})


//SEARCH PARAM TITLE



