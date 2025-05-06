import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// * Middleware to validate request body against a Zod schema

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { success, error } = schema.safeParse(req.body);

    if (!success) {
      return next(
        error.errors.map((t) => `${t.path[0] ?? ""}: ${t.message}`).join(", ")
      );
    }
    next();
  };
