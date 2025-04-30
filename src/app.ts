import express from "express";
import globalErrorHandler from "./controllers/error.controller";
import indexRoute from "./routes";
const app = express();

app.use(express.json());

app.use(indexRoute);

app.use(globalErrorHandler);

// TODO error controller
// TODO customizing-errors-with-zoderrormap

// TODO npx prisma db push as part of the build process
// TODO npx prisma db seed as part of the build process
// TODO prisma seed
// TODO add validations in zod for schema

export default app;
