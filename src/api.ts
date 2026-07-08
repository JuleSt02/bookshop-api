import express from "express";
import { booksRouter } from "./ui/book/routes/book-routes";
import { userRouter } from "./ui/user/routes/user-routes";
import { errorHandlerMiddleWare } from "./ui/shared/middlewares/error-middleware";

const app = express();

app.use(express.json());

app.use("/books", booksRouter);

app.use("/authentication", userRouter);

//always last to cath any error during the flow
app.use(errorHandlerMiddleWare);

export { app };
