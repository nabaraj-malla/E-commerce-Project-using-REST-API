import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // const client = getClient();
    // const session = client.startSession();
    try {
      const db = getDB();
      // session.startTransaction();
      // 1. Get the cartItems and calculate totalAmount
      // let items = await this.getTotalAmount(userId, session);
      // actual code above
      let items = await this.getTotalAmount(userId);
      console.log(items);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);

      // 2. Create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      const collection = db.collection(this.collection);
      // await collection.insertOne(newOrder, { session });
      // actual code above
      await collection.insertOne(newOrder);
      // 3. Reduce the stock
      for (let item of items) {
        db.collection("products").updateOne(
          { _id: item.productID },
          { $inc: { stock: -item.quantity } }
          // { session }
        );
      }

      // throw new Error("Something went wrong");
      // 4. Clear the cart items
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userId),
        }
        // { session }
      );
      // session.commitTransaction();
      // session.endSession();
      return;
    } catch (error) {
      // await session.abortTransaction();
      // await session.endSession();
      console.log(error);
      throw new ApplicationError("Error in getting total rating", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // 1. filter the document based on userId
          {
            $match: { userID: new ObjectId(userId) },
          },
          // 2. Get the product from product collection
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          // 3. unwind the product info
          {
            $unwind: "$productInfo",
          },

          // 4. Calculate totalAmount for each cartItem
          {
            $addFields: {
              totalAmount: { $multiply: ["$quantity", "$productInfo.price"] },
            },
          },
        ]
        // { session }
      )
      .toArray();
    return items;
  }
}
