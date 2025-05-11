import express from "express";
import * as authController from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import * as userSchema from "../schemas/user.schema";
import * as userController from "../controllers/user.controller";

// Users layout Route
const userRouter = express.Router();

// * AUTH ROUTES (open for all)

userRouter.post(
  "/signup",
  validateSchema(userSchema.CreateSchema),
  authController.signup
);

userRouter.post(
  "/login",
  validateSchema(userSchema.LoginSchema),
  authController.login
);

userRouter.get("/logout", authController.logout);

// TODO implement forgot password and reset password
// userRouter.post('/forgotPassword', forgotPassword);
// userRouter.patch('/resetPassword/:token', resetPassword);

// * USER ROUTES (protected)

// TODO validate user added to request object?
userRouter.use(authController.authenticate, async (req, _res, next) => {
  // console.log("User authenticated");
  // console.log((req as AuthorizedRequest).user);
  next();
});

userRouter.patch(
  "/updateMyPassword",
  validateSchema(userSchema.UpdatePasswordSchema),
  authController.updatePassword
);

userRouter.get("/me", userController.getMe, userController.getUser);

userRouter.patch(
  "/updateMe",
  validateSchema(userSchema.UpdateMeSchema),
  userController.updateMe
);

userRouter.delete("/deleteMe", userController.deleteMe);

// * ADMIN ROUTES (restricted to admin roles)

userRouter.use(authController.checkAuthorization("ADMIN"));

userRouter.route("/").get(userController.getAllUsers);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
