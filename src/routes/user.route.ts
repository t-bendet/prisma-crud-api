import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

// Users layout Route
const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUsers)
  .post(validateSchema(createUserSchema), createUser);

userRouter
  .route("/:userid")
  .get(getUser)
  .delete(deleteUser)
  .patch(validateSchema(updateUserSchema), updateUser);

export default userRouter;
