import bcrypt from "bcrypt";
import { Prisma } from "../generated/client";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const UserExtensions = Prisma.defineExtension({
  query: {
    user: {
      async create({ args, query }) {
        const hashedPassword = await hashPassword(args.data.password);
        args.data.password = hashedPassword;
        args.data.passwordConfirm = hashedPassword;
        return query(args);
      },
      async update({ args, query }) {
        // if password and password confirm exist ,iit can only be update password route
        if (args.data.password && args.data.passwordConfirm) {
          const hashedPassword = await hashPassword(
            args.data.password as string
          );
          args.data.password = hashedPassword;
          args.data.passwordConfirm = hashedPassword;
          //*  subtract 1 second, because the JWT can be created faster then saving the document,
          //* and then the changedPasswordAfter function will fail the auth process
          args.data.passwordChangedAt = new Date(Date.now() - 1000);
        }
        return query(args);
      },
      // *  soft delete all find methods will not return users marked as not active
      findUnique({ args, query }) {
        args = {
          ...args,
          where: {
            ...args.where,
            active: { not: false },
          },
        };
        return query(args);
      },
      findFirst({ args, query }) {
        args = {
          ...args,
          where: {
            ...args.where,
            active: { not: false },
          },
        };

        return query(args);
      },
      findMany({ args, query }) {
        args = {
          ...args,
          where: {
            ...args.where,
            active: { not: false },
          },
        };
        return query(args);
      },
      findFirstOrThrow({ args, query }) {
        args = {
          ...args,
          where: {
            ...args.where,
            active: { not: false },
          },
        };
        return query(args);
      },
      findUniqueOrThrow({ args, query }) {
        args = {
          ...args,
          where: {
            ...args.where,
            active: { not: false },
          },
        };
        return query(args);
      },
    },
  },
  model: {
    user: {
      validatePassword: async function (
        candidatePassword: string,
        userPassword: string
      ) {
        return await bcrypt.compare(candidatePassword, userPassword);
      },
      isPasswordChangedAfter: async function (
        JWTTimestamp: number,
        passwordChangedAt: Date
      ) {
        if (passwordChangedAt) {
          const changedTimestamp = parseInt(
            (passwordChangedAt.getTime() / 1000).toString(),
            10
          );

          return JWTTimestamp < changedTimestamp;
        }

        // False means NOT changed
        return false;
      },
    },
  },
  result: {
    user: {},
  },
});
