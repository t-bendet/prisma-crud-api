import { Router } from "express";
import userRouter from "./user.route";

const indexRoute = Router();

indexRoute.use("/users", userRouter);

export default indexRoute;
