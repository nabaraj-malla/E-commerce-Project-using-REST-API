import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [5, "name can't be less than 5"],
    maxLength: [20, "Name can't be greater than 25 characters"],
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^([a-zA-Z0-9_\-\.]+)@test\.com$/,
      "please enter a valid email address",
    ],
  },
  // password: String,
  password: {
    type: String,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character and minimum length of 8",
    ],
  },
  // address: {
  //   province: {
  //     type: String,
  //   },
  //   city: {
  //     type: String,
  //   },
  // },
  address: String,
  type: {
    type: String,
    enum: ["Customer", "Vendor", "Admin"],
  },
});
