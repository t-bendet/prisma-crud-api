import { z } from "zod";
import { Prisma } from "../generated/client";

const Name = z.string({ message: "Name is required" }).min(1).max(100);
const Email = z
  .string({ message: "Email is required" })
  .email("Please provide a valid email!");
const Password = z.string({ message: "Password is required" }).min(8).max(20);
const PasswordConfirm = z
  .string({ message: "Password is required" })
  .min(8)
  .max(20);

// *  Sign Up

export const UserCreateSchema = z
  .object({
    name: Name,
    email: Email,
    password: Password,
    passwordConfirm: PasswordConfirm,
  })
  .strict() // strict mode
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and PasswordConfirm must match!",
  }) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

// export type UserCreateInput = z.infer<typeof UserCreateSchema>;

// *  Login

export const UserLoginSchema = z
  .object({
    email: Email,
    password: Password,
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>; //

//* UpdateMe
export const UserUpdateMeSchema = z
  .object({
    name: Name.optional(),
    email: Email.optional(),
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>;

export const UserUpdatePasswordSchema = z
  .object({
    passwordCurrent: Password,
    password: Password,
    passwordConfirm: PasswordConfirm,
  })
  .strict()
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and PasswordConfirm must match!",
  }) satisfies z.Schema<Prisma.UserUncheckedUpdateInput>; // strict mode

export type UserPublicInfo = Prisma.UserGetPayload<{
  omit: {
    password: true;
    passwordConfirm: true;
    active: true;
  };
}>;

type x = UserPublicInfo["role"];
export const UserPublicInfoSchema = z
  .object({
    id: z.string(),
    name: Name,
    role: z.enum(["ADMIN", "USER"]),
    email: Email,
    passwordChangedAt: z.date(),
    passwordResetToken: z.string().nullable().optional(),
    passwordResetExpires: z.date().nullable().optional(),
    emailVerified: z.boolean(),
    createdAt: z.date(),
  })
  .strict() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>;
