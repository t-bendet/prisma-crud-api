import { Router } from "express";
import userRouter from "./user.route";

// Index

// TODO change this syntex
const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "Welcome User" });
});

indexRoute.use("/users", userRouter);

export default indexRoute;
