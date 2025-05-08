import { z } from "zod";
import { Prisma } from "../generated/client";

// *  Sign Up
export const UserCreateSchema = z
  .object({
    name: z.string({ message: "Name is required" }).min(1).max(100),
    email: z
      .string({ message: "email is required" })
      .email("Please provide a valid email!"),
    password: z.string({ message: "Password is required" }).min(8).max(20),
    passwordConfirm: z
      .string({ message: "PasswordConfirm is required" })
      .min(8)
      .max(20),
  })
  .strict() // strict mode
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and PasswordConfirm must match!",
  }) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

// export type UserCreateInput = z.infer<typeof UserCreateSchema>;

// *  Login
export const UserLoginSchema = z
  .object({
    email: z.string().email("Please provide a valid email!").optional(),
    password: z
      .string({ message: "Password is required" })
      .min(8)
      .max(20, "Password must be between 8 and 20 characters!"),
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>; //

//* UpdateMe
export const UserUpdateMeSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email("Please provide a valid email!").optional(),
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>; // strict mode

export type UserPublicInfo = Prisma.UserGetPayload<{
  omit: {
    password: true;
    passwordConfirm: true;
    active: true;
  };
}>;

// login
// update password
