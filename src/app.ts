import express from "express";
import globalErrorHandler from "./middlewares/error.middleware";
import indexRoute from "./routes";
import AppError from "./utils/appError";
import { UserPublicInfo } from "./schemas/user.schema";

declare global {
  namespace Express {
    export interface Request {
      user?: UserPublicInfo;
    }
  }
}

const app = express();
app.set("query parser", "extended");

app.use(express.json());

app.use("/api/v1", indexRoute);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// TODO error controller
// TODO  error controller edge cases(unhandledRejection)
// TODO npx prisma db push as part of the build process
// TODO npx prisma db seed as part of the build process

export default app;
