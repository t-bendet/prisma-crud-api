import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    passwordConfirm: z.string().min(8).max(20),
    role: z.enum(["ADMIN", "USER"]).default("USER"), // default value
  })
  .strict(); // strict mode

//strict prevents the schema from validating payloads with properties not in the schema

export const updateUserSchema = createUserSchema.partial(); //creates a partial schema from createUserSchema were all properties are optional
