import prisma from "../client";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const getMe = (req: Request, _res: Response, next: NextFunction) => {
  req.params.id = req.user?.id!;
  next();
};

// Get a single user
export const getUser = catchAsync(async (req, res, _next) => {
  const { id } = req.params;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  res.json({
    status: true,
    message: "User Successfully fetched",
    data: user,
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      active: false,
    },
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get all Users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany();

  res.json({
    status: true,
    message: "Users Successfully fetched",
    data: users,
  });
});

// // deleting a user
// export const deleteUser = catchAsync(async (req, res, next) => {
//   const { userid } = req.params;

//   const user = await prisma.user.findFirst({
//     where: {
//       id: userid,
//     },
//   });

//   if (!user) {
//     res.status(401).json({
//       status: false,
//       message: "User not found",
//     });
//   }
//   await prisma.user.delete({
//     where: {
//       id: userid,
//     },
//   }),
//     res.status(204).json({
//       status: true,
//       message: "User Successfully deleted",
//     });
// });

// updating a single user
export const updateUser = catchAsync(async (req, res, next) => {
  // TODO add validation for user update
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return next(new AppError("User not found", 401));
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: req.body,
  });

  res.json({
    status: true,
    message: "User Successfully updated",
    data: updatedUser,
  });
});
