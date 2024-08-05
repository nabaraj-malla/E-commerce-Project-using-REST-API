import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userID;
      if (type != "Product" && type != "Category") {
        return res.status(400).send("Invalid type");
      }

      if (type == "Product") {
        const result = await this.likeRepository.likeProduct(userId, id);
        return res.status(201).send(result);
      } else {
        const result = await this.likeRepository.likeCategory(userId, id);
        return res.status(201).send(result);
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500).send("Error in like feature");
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (error) {
      console.log(error);
      throw new ApplicationError(500).send("Error in get Likes feature");
    }
  }
}
