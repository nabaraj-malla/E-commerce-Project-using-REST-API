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
  },
  password: String,
  address: {
    type: String,
    // province: {
    //   type: String,
    // },
    // city: {
    //   type: String,
    // },
  },
  type: {
    type: String,
    enum: ["Customer", "Vendor", "Admin"],
  },
});
