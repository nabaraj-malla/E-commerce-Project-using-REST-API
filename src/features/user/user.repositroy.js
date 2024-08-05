import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async resetPassword(userID, newPassword) {
    try {
      //   let user = await UserModel.findById(userID);
      //   user.password = newPassword;
      await UserModel.findByIdAndUpdate(userID, { password: newPassword });
      //   user.save();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in password reset", 500);
    }
  }
  async signUp(user) {
    console.log(user);
    try {
      // creating instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        console.log(err);
        throw new ApplicationError("Something went wrong in registration", 500);
      }
    }
  }

  async signin(email, password) {
    try {
      const user = await UserModel.findOne({ email, password });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong in user login", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong in finding email", 500);
    }
  }

  async forgetPassword(email, newPassword) {
    try {
      // await UserModel.findByIdAndUpdate({email}, { password: newPassword });
      await UserModel.findOneAndUpdate({ email }, { password: newPassword });
    } catch (error) {
      console.log(error);
      throw new ApplicationError(400, "Error in forget password");
    }
  }

  async updateDetails(userID, email, type) {
    try {
      const result = await UserModel.findByIdAndUpdate(
        userID,
        {
          email: email,
          type: type,
        },
        {
          returnDocument: "after",
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(400, "Error in forget password");
    }
  }
}
