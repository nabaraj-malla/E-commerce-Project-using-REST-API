import mongoose, { mongo } from "mongoose";

export const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  productID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});
