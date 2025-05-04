import { PrismaClient, Prisma } from "./generated/client"; // Adjust the import path based on your project structure
import { z } from "zod";
import bcrypt from "bcrypt";

// export const UserCreateInput = z.object({
//   name: z.string().max(100).describe("User name"),
//   email: z.string().max(1000),
//   phoneNumber: z.string().max(1000),
//   gender: z.string().max(1000),
// }) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        console.log(args.data, "args creates");
        args.data.password;
        // TODO add validation for password,will fail in bcrypt hash before validation function
        try {
          args.data["password"] = await bcrypt.hash(args.data["password"], 12);
        } catch (error) {
          console.log(error);
        }
        args.omit = {
          password: true,
          passwordConfirm: true,
        };
        return query(args);
      },
      async update({ args, query }) {
        // args.data = UserCreateInput.partial().parse(args.data);
        console.log(args, "args update");
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
  // result: {
  // slug
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
