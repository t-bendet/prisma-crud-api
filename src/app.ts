import express from "express";
import globalErrorHandler from "./middlewares/error.middleware";
import indexRoute from "./routes";
import AppError from "./utils/appError";

const app = express();

app.use(express.json());

app.use("/api/v1", indexRoute);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// TODO apiFeatures
// TODO error controller
// TODO rethink prisma methods compared to mongoose
// TODO handle factory adaption to prisma
// TODO  error controller edge cases(unhandledRejection)
// TODO customizing-errors-with-zod error map
// TODO add validations in zod for schema
// TODO npx prisma db push as part of the build process
// TODO npx prisma db seed as part of the build process

export default app;
