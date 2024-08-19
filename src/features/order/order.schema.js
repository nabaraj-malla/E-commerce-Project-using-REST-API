import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalAmount: Number,
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("order", OrderSchema);
