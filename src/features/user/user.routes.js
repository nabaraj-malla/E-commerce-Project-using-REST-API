import express from "express";
import UserController from "./user.controller.js";
import { validateUser } from "../../middlewares/validateUser.middleware.js";

const userRouter = express.Router();

const userController = new UserController();
userRouter.post("/signup", validateUser, userController.signUp);
userRouter.post("/signin", userController.signIn);

export default userRouter;
