import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(type, id) {
    return await LikeModel.find({
      likeable: new ObjectId(id),
      types: type,
    })
      .populate("user")
      .populate({ path: "likeable", model: type });
  }

  // in above likeable holds objectId and model holds the collection name

  async likeProduct(userId, productId) {
    try {
      console.log(userId, productId);
      const newLike = new LikeModel({
        user: userId,
        likeable: productId,
        types: "Product",
      });
      await newLike.save();
      console.log("pre and post hook completed");
      return newLike;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500).send("Error in like feature");
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: userId,
        likeable: categoryId,
        types: "Category",
      });
      await newLike.save();
      return newLike;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500).send("Error in like feature");
    }
  }
}
