import { z } from "zod";
import { Prisma } from "../generated/client";

export const UserUpdateInput = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email("Please provide a valid email!").optional(),
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>; // strict mode

export const UserCreateInputSchema = z
  .object({
    name: z.string({ message: "Name is required" }).min(1).max(100),
    email: z
      .string({ message: "email is required" })
      .email("Please provide a valid email!"),
    password: z
      .string()
      .min(8)
      .max(20, "Password must be between 8 and 20 characters!"),
    passwordConfirm: z
      .string()
      .min(8)
      .max(20, "PasswordConfirm must be between 8 and 20 characters!"),
  })
  .strict() // strict mode
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and PasswordConfirm must match!",
  }) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

type UserCreateInput = z.infer<typeof UserCreateInputSchema>;
