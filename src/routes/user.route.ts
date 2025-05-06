import express from "express";
import { signup } from "../controllers/auth.controller";

// Users layout Route
const userRouter = express.Router();

// * AUTH ROUTES (open for all)

userRouter.post("/signup", signup);
// userRouter.post("/login", login);
// userRouter.get("/logout", logout);

// userRouter.route("/").get(getUsers);

// userRouter.route("/:userid").get(getUser).delete(deleteUser).patch(updateUser);

export default userRouter;

// TODO  validation
// email - email shape
//  role - enum
//  password - min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
// confirm password - same as password
