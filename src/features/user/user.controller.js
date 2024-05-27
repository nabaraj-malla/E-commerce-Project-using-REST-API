import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
// import { JsonWebTokenError } from "jsonwebtoken";

export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    return res.status(201).send(user);
  }

  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send("Invalid credentials");
    } else {
      const token = jwt.sign(
        { id: result.id, email: result.email },
        "KdE9vVDUQzaBqmM",
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send(token);
    }
  }
}
