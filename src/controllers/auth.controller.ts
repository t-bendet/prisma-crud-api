import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { env } from "../utils/env";
import prisma from "../client";
import { Request, Response } from "express";
import { Prisma } from "../generated/client"; // Adjust the import path based on your project structure
import AppError from "../utils/appError";
export interface CustomRequest extends Request {
  user: Omit<
    Prisma.UserUncheckedCreateInput,
    "password" | "passwordConfirm" | "active"
  >;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

function isPasswordChangedAfter(JWTTimestamp: number, passwordChangedAt: Date) {
  if (passwordChangedAt) {
    const changedTimestamp = parseInt(
      (passwordChangedAt.getTime() / 1000).toString(),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
}

export const createAndSendToken = (
  user: Prisma.UserGetPayload<{
    omit: {
      password: true;
      passwordConfirm: true;
      active: true;
    };
  }>,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      //* milliseconds (*1000)=> seconds (*60)=>
      //* minuets (*60)=> hours (*24)=> days
      //* JWT_COOKIE_EXPIRES_IN: days
      Date.now() + Number(env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      // Date.now() + ms(val) can also work
    ),
    //* cookie will only be sent on encrypted connection(https)
    //* true only if we are on production mode
    // secure: env.NODE_ENV === "production",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    //* cookie can not be accessed or modified by the browser
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    statusText: "success",
    data: {
      user,
      token,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      passwordConfirm,
    },
  });

  createAndSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // * 2) Check if user exists && password is correct
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    omit: {
      password: false,
    },
  });

  if (!(await prisma.user.validatePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // * 3) Return new token to client
  createAndSendToken(user, 200, req, res);
});

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ statusText: "success" });
};

export const authenticate = catchAsync(async (req, res, next) => {
  // * 1) Getting token and check if it's there
  const { authorization } = req.headers;
  let token;
  if (authorization?.startsWith("Bearer")) {
    token = authorization.replace("Bearer ", "");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You ar not logged in! Please log in to again access", 401)
    );
  }

  //* 2) Validate Token
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  // //* 3) check if user still exists
  const currentUser = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: decoded.id },
  });
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists",
        401
      )
    );
  }
  // //* 4) check if user changed password after the token was issued
  const hasPasswordChanged = isPasswordChangedAfter(
    decoded.iat!,
    currentUser.passwordChangedAt
  );
  if (hasPasswordChanged) {
    return next(
      new AppError(
        "User recently changed password! Please log in to again",
        401
      )
    );
  }

  (req as CustomRequest).user = currentUser;

  return next();
});
