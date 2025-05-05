import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { env } from "../utils/env";
import prisma, { UserReturnType } from "../client";
import { Request, Response } from "express";

const signToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const createAndSendToken = (
  user: UserReturnType,
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
    secure: env.NODE_ENV === "production",
    // TODO what is this?
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
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
