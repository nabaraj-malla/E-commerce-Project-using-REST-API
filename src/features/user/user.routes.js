import express from "express";
import UserController from "./user.controller.js";
import { validateUser } from "../../middlewares/validateUser.middleware.js";

const userRouter = express.Router();

const userController = new UserController();
userRouter.post("/signup", validateUser, (req, res) => {
  userController.signUp(req, res);
});
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});
// Above we have used arrow function because we have used `this` keyword
// in user controller's constructor to create instance of UserRepository

export default userRouter;
