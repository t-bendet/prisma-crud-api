import { PrismaClient } from "./generated/client"; // Adjust the import path based on your project structure
import { UserExtensions } from "./models/user.model";

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient({
  omit: {
    user: { password: true, passwordConfirm: true, active: true },
  },
}).$extends(UserExtensions);

export default prisma;
