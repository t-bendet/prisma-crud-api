import prisma from "../client";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  // @ts-ignore
  req.params.id = req.user.id;
  next();
};

// Get a single user
export const getUser = catchAsync(async (req, res, next) => {
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

// // Creating a user
// export const createUser = catchAsync(async (req, res, next) => {
//   const user = await prisma.user.create({
//     data: req.body,
//   });
//   res.status(201).json({
//     status: true,
//     message: "User Successfully Created",
//     data: user,
//   });
// });

// // Get all Users
// export const getUsers = catchAsync(async (req, res, next) => {
//   const users = await prisma.user.findMany();

//   res.json({
//     status: true,
//     message: "Users Successfully fetched",
//     data: users,
//   });
// });

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

// // updating a single user
// export const updateUser = catchAsync(async (req, res, next) => {
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

//   const updatedUser = await prisma.user.update({
//     where: {
//       id: userid,
//     },
//     data: req.body,
//   });

//   res.json({
//     status: true,
//     message: "User Successfully updated",
//     data: updatedUser,
//   });
// });
