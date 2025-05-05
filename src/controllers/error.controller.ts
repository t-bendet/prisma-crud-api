// if error name is PrismaClientInitializationError or error instanceof PrismaClientInitializationError
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { env } from "../utils/env";

const handleCastErrorDB = (err: any) => {
  const message = `${err.meta.message} - model: ${err.meta.modelName}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const message = `Duplicate field value: ${err.meta.target}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const messageArray = err.message.split("\n");
  const message = `Invalid input data. -  ${
    messageArray[messageArray.length - 1]
  }`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // console.log(err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

// TODO change any?
// TODO type tagging and predicates for the errors

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // TODO P2025 centerlize not found error? PrismaClientKnownRequestError
  // TODO  add more errors if needed
  // TODO narrow error shapes with ts or zod

  if (env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.code === "P2023") error = handleCastErrorDB(error); // PrismaClientKnownRequestError
    if (error.code === "P2002") error = handleDuplicateFieldsDB(error); // PrismaClientKnownRequestError
    if (error.name === "PrismaClientValidationError")
      error = handleValidationErrorDB(error); //PrismaClientValidationError
    // TODO jwt.verify errors ,test with jwt
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};

//* if we pass 4 parameters express will recognize
//* this as a Error handling  middleware
