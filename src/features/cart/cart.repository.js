import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { cartSchema } from "./cart.schema.js";
import mongoose from "mongoose";
export const CartModel = mongoose.model("cart", cartSchema);
import { UserModel } from "../user/user.repositroy.js";

export default class CartRepository {
  async add(productID, userID, quantity) {
    try {
      const result = await CartModel.updateOne(
        {
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
        },
        {
          // $setOnInsert: { _id: id },
          $inc: { quantity: quantity },
        },
        {
          upsert: true,
        }
      );
      console.log("result", result);
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in adding item to cart", 500);
    }
  }

  async get(userID) {
    try {
      const results = await CartModel.find({
        userID: new ObjectId(userID),
      });
      return results;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in getting items from cart", 500);
    }
  }

  async delete(userID, cartItemID) {
    try {
      console.log("delete function");
      console.log(userID, cartItemID);
      const doc = await CartModel.find({
        userID: new ObjectId(userID),
        _id: new ObjectId(cartItemID),
      });

      let result;
      if (doc.length == 0) {
        result = {
          success: false,
          msg: "no cartItem found for user",
        };
        return result;
      }

      console.log("doc", doc);
      await CartModel.deleteOne({
        userID: new ObjectId(userID),
        _id: new ObjectId(cartItemID),
      });
      return (result = {
        success: true,
        msg: "cartItem deleted",
        cartItem: doc,
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in deleting items from cart", 500);
    }
  }
}

// export default class CartRepository {
//   constructor() {
//     this.collection = "cartItems";
//   }

//   async add(productID, userID, quantity) {
//     try {
//       const db = getDB();
//       const collection = db.collection(this.collection);
//       // const id = await this.getNextCounter(db);
//       await collection.updateOne(
//         {
//           productID: new ObjectId(productID),
//           userID: new ObjectId(userID),
//         },
//         {
//           // $setOnInsert: { _id: id },
//           $inc: { quantity: quantity },
//         },
//         {
//           upsert: true,
//         }
//       );
//     } catch (error) {
//       console.log(error);
//       throw new ApplicationError("Error in adding item to cart", 500);
//     }
//   }

//   async get(userID) {
//     try {
//       const db = getDB();
//       const collection = db.collection(this.collection);
//       const results = await collection
//         .find({
//           userID: new ObjectId(userID),
//         })
//         .toArray();
//       return results;
//     } catch (error) {
//       console.log(error);
//       throw new ApplicationError("Error in getting items from cart", 500);
//     }
//   }

//   async delete(userID, cartItemID) {
//     try {
//       const db = getDB();
//       const collection = db.collection(this.collection);
//       await collection.deleteOne({
//         userID: new ObjectId(userID),
//         _id: new ObjectId(cartItemID),
//         // _id: cartItemID,
//       });
//     } catch (error) {
//       console.log(error);
//       throw new ApplicationError("Error in deleting items from cart", 500);
//     }
//   }

//   async getNextCounter(db) {
//     const resultDocument = await db.collection("counters").findOneAndUpdate(
//       {
//         _id: "cartItemId",
//       },
//       {
//         $inc: { value: 1 },
//       },
//       {
//         returnDocument: "after",
//       }
//     );
//     console.log(resultDocument);
//     return resultDocument.value;
//   }

//   // async updateQunatity(userID, cartItemID, newQuantity) {
//   //   try {
//   //     const db = getDB();
//   //     const collection = db.collection(this.collection);
//   //     await collection.updateOne(
//   //       {
//   //         _id: new ObjectId(cartItemID),
//   //         userID: new ObjectId(userID),
//   //       },
//   //       {
//   //         $inc: {
//   //           quantity: newQuantity,
//   //         },
//   //       }
//   //     );
//   //   } catch (error) {
//   //     console.log(error);
//   //     throw new ApplicationError("Error in updating cartItem quantity", 500);
//   //   }
//   // }
// }
