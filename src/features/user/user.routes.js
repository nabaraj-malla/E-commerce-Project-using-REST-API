import express from "express";
import UserController from "./user.controller.js";
import { validateUser } from "../../middlewares/validateUser.middleware.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const userRouter = express.Router();

const userController = new UserController();
// userRouter.post("/signup", validateUser, (req, res, next) => {
//   userController.signUp(req, res, next);
// });
userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});
userRouter.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});
userRouter.put("/forgetPassword", (req, res) => {
  userController.forgetPassword(req, res);
});
userRouter.put("/updateDetails", jwtAuth, (req, res) => {
  userController.updateDetails(req, res);
});
// Above we have used arrow function because we have used `this` keyword
// in user controller's constructor to create instance of UserRepository

export default userRouter;
