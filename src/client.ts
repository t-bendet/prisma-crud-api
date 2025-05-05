import { PrismaClient, Prisma } from "./generated/client"; // Adjust the import path based on your project structure
import { z } from "zod";
import bcrypt from "bcrypt";
import { env } from "./utils/env";

export const UserCreateInput = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Please provide a valid email!"),
    password: z
      .string()
      .min(8)
      .max(20, "Password must be between 8 and 20 characters!"),
    passwordConfirm: z
      .string()
      .min(8)
      .max(20, "PasswordConfirm must be between 8 and 20 characters!"),
    role: z.enum(["ADMIN", "USER"]).default("USER"), // default value
  })
  .strict() // strict mode
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and PasswordConfirm must match!",
  }) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

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
const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      passwordConfirm: true,
      active: true,
    },
  },
  errorFormat: "colorless",
  log: env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [],
}).$extends({
  query: {
    user: {
      async create({ args, query }) {
        // console.log(args.data, "args creates");
        args.data = UserCreateInput.parse(args.data);
        args.data.password;
        // TODO add validation for password,will fail in bcrypt hash before validation function
        try {
          const hash = await bcrypt.hash(args.data["password"], 12);
          args.data["password"] = hash;
          args.data["passwordConfirm"] = hash;
        } catch (error) {
          // console.log(error);
        }

        return query(args);
      },
      async update({ args, query }) {
        // args.data = UserCreateInput.partial().parse(args.data);
        // console.log(args, "args update");
        if (typeof args.data.password === "string") {
          args.data.password = await bcrypt.hash(args.data["password"], 12);
        }

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
      async signUp(
        name: string,
        email: string,
        password: string,
        passwordConfirm: string
      ) {
        const hash = await bcrypt.hash(password, 12);
        return prisma.user.create({
          data: {
            email,
            password: hash,
            passwordConfirm: hash,
            name,
          },
        });
      },
    },
  },
  // result: {
  //   user: {
  //     madeUpField: {
  //       needs: { name: true, role: true },
  //       compute(user) {
  //         console.log(user);
  //         // the computation logic
  //         return `${user.name} ${user.role}`;
  //       },
  //     },
  //   },
  // },
});

export default prisma;
