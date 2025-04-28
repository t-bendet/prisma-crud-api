import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

// TODO use with global error handler

/**
 * Zod schema
 */
export const UserCreateInput = z.object({
  name: z.string().max(100),
  email: z.string().max(1000),
  phoneNumber: z.string().max(1000),
  gender: z.string().max(1000),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      create({ args, query }) {
        // console.log({ args });
        console.log("*****");
        args.data = UserCreateInput.parse(args.data);
        console.log(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = UserCreateInput.partial().parse(args.data);
        return query(args);
      },
      updateMany({ args, query }) {
        args.data = UserCreateInput.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }) {
        args.create = UserCreateInput.parse(args.create);
        args.update = UserCreateInput.partial().parse(args.update);
        return query(args);
      },
    },
  },
  result: {
    user: {
      madeUpField: {
        needs: { name: true, gender: true },
        compute(user) {
          // the computation logic
          return `${user.name} ${user.gender}`;
        },
      },
    },
  },
});

export default prisma;
