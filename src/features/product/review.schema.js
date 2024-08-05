import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
