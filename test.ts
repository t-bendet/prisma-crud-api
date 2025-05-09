import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

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

export const userService = {
  async updateUserPassword(
    userId: string,
    newPassword: string,
    newPasswordConfirm: string
  ) {
    if (newPassword !== newPasswordConfirm) {
      throw new Error("Passwords do not match!");
    }

    const hashedPassword = await hashPassword(newPassword);

    return prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordConfirm: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });
  },

  async validatePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  },

  async createPasswordReset(userId: string) {
    const { resetToken, hashedToken, expires } = createPasswordResetToken();

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expires,
      },
    });

    return resetToken;
  },

  async isPasswordChangedAfter(
    userId: string,
    jwtTimestamp: number
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordChangedAt: true },
    });

    if (user?.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );
      return jwtTimestamp < changedTimestamp;
    }

    return false;
  },
};

export default prisma;

// export const login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // * 2) Check if user exists && password is correct
//   const user = await prisma.user.validatePasswordTest(password, email);

//   // * 3) Return new token to client
//   createAndSendToken(user, 200, req, res);
// });

// async validatePasswordTest(candidatePassword: string, email: string) {
//   const user = await prisma.user.findUnique({
//     where: { email },
//     omit: {
//       password: false,
//     },
//   });

//   if (
//     !user ||
//     !(await bcrypt.compare(candidatePassword, user.password))
//   ) {
//     throw new AppError("Incorrect email or password", 401);
//   }
//   const { password, ...userPublicInfo } = user;
//   return userPublicInfo;
// },
