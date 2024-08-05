import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  inStock: String,
  imageURL: String,
  sizes: {
    type: [String],
    default: [],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
});
