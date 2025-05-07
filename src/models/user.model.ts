import prisma from "../client";
import { Prisma } from "../generated/client";
import bcrypt from "bcrypt";

const hashPassword = async (password: string): Promise<string> => {
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
        // args.data = UserUpdateInput.partial().parse(args.data);
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
      deleteMany({ args, query }) {
        return query(args);
      },
    },
  },
  model: {
    user: {
      validatePassword: async function (
        candidatePassword: string,
        userPassword: string
      ): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, userPassword);
      },
    },
  },
  result: {
    user: {},
  },
});
