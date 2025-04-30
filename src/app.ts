import express from "express";
import indexRoute from "./routes";
import { PrismaClientInitializationError } from "./generated/client/runtime/library";
const app = express();
import globalErrorHandler from "./controllers/error.controller";

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(indexRoute);

// app.use(
//   (
//     error: any,
//     _req: express.Request,
//     res: express.Response,
//     _next: express.NextFunction
//   ) => {
//     console.log(error.code, "code");
//     console.log(error.stack, "stack");
//     console.log(error.errorCode, "errorCode");
//     console.log(error.retryable, "retryable");
//     console.log(error.name, "name");
//     console.log(error.meta, "meta");
//     console.log(error.message, "message");
//     console.log(error.clientVersion, "clientVersion");
//     console.log(Object.keys(error), "keys");
//     console.log(error instanceof PrismaClientInitializationError, "prototype");
//     console.log(error.constructor.name, "constructor name");

//     res.status(501).json({
//       status: false,
//       message: "An error occurred - " + error,
//       error: error,
//     });
//   }
// );

// Start the express server on the relevant port
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

// TODO use with global error handler
// todo AppError
// TODO error controller

// TODO customizing-errors-with-zoderrormap
// TODO remove password from responses
// TODO How to validate MongoDB connection string

// TODO npx prisma db push as part of the build process
// TODO npx prisma db seed as part of the build process
// TODO prisma seed
// TODO add validations in zod for schema

// with no validation , prisma errors
// console.log(error.name, " error name");
// console.log(error.message, " error message");

// console.log(Object.keys(error));
// console.log(error.issues);
// console.log(error.name, "name");
// console.log(error.errors);
app.use(globalErrorHandler);
