import { PrismaClient, Prisma } from "./generated/client"; // Adjust the import path based on your project structure
import { date, z } from "zod";
import bcrypt from "bcrypt";
import { env } from "./utils/env";

// TODO split extensions into separate files by model

const UserUpdateInput = z
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

// TODO  change this
export type UserReturnType = Prisma.UserGetPayload<{
  omit: {
    password: true;
    passwordConfirm: true;
    active: true;
  };
}>;

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        console.log(args.data);
        // args.data = UserCreateInput.parse(args.data);
        return query(args);
      },
      async update({ args, query }) {
        args.data = UserUpdateInput.parse(args.data);
        return query(args);
      },
      updateMany({ args, query }) {
        // args.data = UserCreateInput.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }) {
        // args.create = UserCreateInput.parse(args.create);
        // args.update = UserCreateInput.partial().parse(args.update);
        return query(args);
      },
    },
  },
  model: {
    user: {
      async signUp(data: UserCreateInput) {
        UserCreateInputSchema.parse({ ...data });
        const hash = await bcrypt.hash(data.password, 12);
        return prisma.user.create({
          data: {
            ...data,
            password: hash,
            passwordConfirm: hash,
          },
        });
      },
    },
  },
  result: {
    user: {
      madeUpField: {
        needs: { name: true, role: true },
        compute(user) {
          console.log(user);
          // the computation logic
          return `${user.name} ${user.role}`;
        },
      },
    },
  },
});

export default prisma;
