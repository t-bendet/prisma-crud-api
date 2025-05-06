import { ZodSchema } from "zod";
import catchAsync from "../utils/catchAsync";

// * Middleware to validate request body against a Zod schema

export const validateSchema = (schema: ZodSchema) =>
  catchAsync(async (req, _res, next) => {
    schema.parse(req.body);
    next();
  });
