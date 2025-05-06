import { PrismaClient, Prisma } from "./generated/client"; // Adjust the import path based on your project structure
import { UserExtensions } from "./models/user.model";

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends(UserExtensions);

export default prisma;
