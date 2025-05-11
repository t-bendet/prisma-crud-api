import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export const createPasswordResetToken = (): {
  resetToken: string;
  hashedToken: string;
  expires: Date;
} => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { resetToken, hashedToken, expires };
};

export const createPasswordReset = async (userId: string) => {
  const { resetToken, hashedToken, expires } = createPasswordResetToken();

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    },
  });

  return resetToken;
};

export default prisma;
