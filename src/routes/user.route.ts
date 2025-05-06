import express from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import {
  UserCreateInputSchema,
  UserTempLoginInput,
} from "../schemas/user.schema";

// Users layout Route
const userRouter = express.Router();

// * AUTH ROUTES (open for all)

userRouter.post("/signup", validateSchema(UserCreateInputSchema), signup);
userRouter.post("/login", validateSchema(UserTempLoginInput), login);
userRouter.get("/logout", logout);

// userRouter.post('/forgotPassword', forgotPassword);
// userRouter.patch('/resetPassword/:token', resetPassword);

// // * USER ROUTES (protected)

// userRouter.use(authenticate);

// userRouter.patch('/updateMyPassword', updatePassword);
// userRouter.get('/me', getMe);
// userRouter.patch('/updateMe', updateMe);
// userRouter.delete('/deleteMe', deleteMe);

// // * ADMIN ROUTES (restricted to admin roles)

// userRouter.use(checkAuthorization('admin'));
// userRouter.route('/').get(getAllUsers);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
