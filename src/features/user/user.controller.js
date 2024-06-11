import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel(name, email, hashedPassword, type);
      // const userRepository = new UserRepository();
      // await userRepository.signUp(user);
      await this.userRepository.signUp(user);
      return res.status(201).send(user);
    } catch (error) {
      throw new Error("Internal Server Error", 500);
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
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Invalid credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid credentials");
    }
  }
}
