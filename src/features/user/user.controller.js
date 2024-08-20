import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
// import OldUserRepository from "./user.repository.old.js";
import UserRepository from "./user.repositroy.js";
import bcrypt from "bcrypt";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res) {
    try {
      console.log(req.body);
      const { newPassword } = req.body;
      console.log("newPassword", newPassword);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const userID = req.userID;
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("password is updated");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in password reset", 500);
    }
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, address, type } = req.body;
      console.log(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel(name, email, hashedPassword, address, type);
      await this.userRepository.signUp(user);
      return res.status(201).send({ status: true, user: user });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect credentials");
      } else {
        // compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          console.log("password matched");
          const token = jwt.sign(
            { userID: user._id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            {
              expiresIn: "5h",
            }
          );
          const loginResult = {
            login: "success",
            token: token,
          };
          return res.status(200).send(loginResult);
        } else {
          return res.status(400).send("Invalid credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid credentials");
    }
  }

  async forgetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.forgetPassword(email, hashedNewPassword);
      return res.status(200).send({ status: true, newPassword: newPassword });
    } catch (error) {
      console.log(error);
      throw new ApplicationError(400, "Error in forget password");
    }
  }

  async updateProfile(req, res) {
    try {
      // const { name, type, province, city } = req.query;
      const { name, type, address } = req.query;
      // console.log(name, type, province, city);
      const userID = req.userID;
      console.log(userID);
      // const address = {
      //   province: province,
      //   city,
      // };
      const result = await this.userRepository.updateProfile(
        userID,
        name,
        type,
        address
      );
      return res.status(200).send({ status: true, updatedUser: result });
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500, "Error in updating user details");
    }
  }
}
