import express from "express";
import globalErrorHandler from "./controllers/error.controller";
import indexRoute from "./routes";
import AppError from "./utils/appError";

const app = express();

app.use(express.json());

app.use("/api/v1", indexRoute);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// TODO recreate all of user and auth functionality with prisma
// TODO handle factory adaption to prisma
// TODO  error controller edge cases(unhandledRejection)
// TODO customizing-errors-with-zod error map
// TODO add validations in zod for schema
// TODO npx prisma db push as part of the build process
// TODO npx prisma db seed as part of the build process
// TODO prisma seed

export default app;
