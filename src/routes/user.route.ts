import express from "express";
import {
  signup,
  login,
  logout,
  authenticate,
  updatePassword,
  updateMe,
} from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  UserCreateSchema,
  UserLoginSchema,
  UserUpdatePasswordSchema,
  UserUpdateMeSchema,
} from "../schemas/user.schema";
import { getMe, getUser } from "../controllers/user.controller";

// Users layout Route
const userRouter = express.Router();

// * AUTH ROUTES (open for all)

userRouter.post("/signup", validateSchema(UserCreateSchema), signup);
userRouter.post("/login", validateSchema(UserLoginSchema), login);
userRouter.get("/logout", logout);

// userRouter.post('/forgotPassword', forgotPassword);
// userRouter.patch('/resetPassword/:token', resetPassword);

// * USER ROUTES (protected)

// TODO validate user added to request object?
userRouter.use(authenticate, async (req, _res, next) => {
  // console.log("User authenticated");
  // console.log((req as AuthorizedRequest).user);
  next();
});

userRouter.patch(
  "/updateMyPassword",
  validateSchema(UserUpdatePasswordSchema),
  updatePassword
);
userRouter.get("/me", getMe, getUser);

userRouter.patch("/updateMe", validateSchema(UserUpdateMeSchema), updateMe);
// userRouter.delete('/deleteMe', deleteMe);

// * ADMIN ROUTES (restricted to admin roles)

// userRouter.use(checkAuthorization('admin'));
// userRouter.route('/').get(getAllUsers);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
