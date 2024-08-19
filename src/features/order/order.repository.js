import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { OrderModel } from "./order.schema.js";
import { CartModel } from "../cart/cart.repository.js";
import mongoose from "mongoose";
// import ProductModel from "../product/product.model.js";
import { ProductModel } from "../product/product.repository.js";

export default class OrderRepository {
  // constructor() {
  //   this.collection = "orders";
  // }

  async placeOrder(userId) {
    let { totalPrice, cartProducts } = await this.getTotalAmount(userId);

    console.log("totalPrice", totalPrice);
    console.log("cartProducts", cartProducts);

    // 1. create a new order document
    const newOrder = new OrderModel({
      userID: new mongoose.Types.ObjectId(userId),
      totalAmount: totalPrice,
    });

    await newOrder.save();

    // 2. get all products

    // const productsOnly = new Array();

    // cartProducts.forEach((cartProduct) => {
    //   productsOnly.push(cartProduct.productID);
    // });

    // console.log("productsOnly", productsOnly);

    // 3. Reduce the stock
    for (let cartProduct of cartProducts) {
      await ProductModel.updateOne(
        { _id: new mongoose.Types.ObjectId(cartProduct.productID._id) },
        {
          $inc: { inStock: -cartProduct.quantity },
        }
      );
    }

    // 4. delete cartItem
    await CartModel.deleteMany({
      userID: new mongoose.Types.ObjectId(userId),
    });

    // 5. return new Order
    return newOrder;
  }

  async getTotalAmount(userId) {
    const cartItems = await CartModel.find({
      userID: new mongoose.Types.ObjectId(userId),
    });

    let productQuantities = new Array();
    cartItems.forEach((cartItem) => {
      productQuantities.push(cartItem.quantity);
    });

    console.log("cartItems", cartItems);
    console.log("productQuantities", productQuantities);

    let productPrices = new Array();
    const cartProducts = await CartModel.find({
      userID: new mongoose.Types.ObjectId(userId),
    }).populate("productID");

    console.log("cartProducts", cartProducts);

    cartProducts.forEach((cartProduct) => {
      productPrices.push(cartProduct.productID.price);
    });

    console.log("productPrices", productPrices);

    // calculating total amount
    let totalPrice = 0;
    for (let i = 0; i < productQuantities.length; i++) {
      for (let j = 0; j < productPrices.length; j++) {
        totalPrice += productQuantities[i] * productPrices[j];
        i++;
      }
    }
    console.log("totalPrice", totalPrice);
    return { totalPrice, cartProducts };
  }

  // async placeOrder(userId) {
  //   // const client = getClient();
  //   // const session = client.startSession();
  //   try {
  //     const db = getDB();
  //     // session.startTransaction();
  //     // 1. Get the cartItems and calculate totalAmount
  //     // let items = await this.getTotalAmount(userId, session);
  //     // actual code above
  //     let items = await this.getTotalAmount(userId);
  //     console.log(items);
  //     const finalTotalAmount = items.reduce(
  //       (acc, item) => acc + item.totalAmount,
  //       0
  //     );
  //     console.log(finalTotalAmount);

  //     // 2. Create an order record
  //     const newOrder = new OrderModel(
  //       new ObjectId(userId),
  //       finalTotalAmount,
  //       new Date()
  //     );
  //     const collection = db.collection(this.collection);
  //     // await collection.insertOne(newOrder, { session });
  //     // actual code above
  //     await collection.insertOne(newOrder);
  //     // 3. Reduce the stock
  //     for (let item of items) {
  //       db.collection("products").updateOne(
  //         { _id: item.productID },
  //         { $inc: { stock: -item.quantity } }
  //         // { session }
  //       );
  //     }

  //     // throw new Error("Something went wrong");
  //     // 4. Clear the cart items
  //     await db.collection("cartItems").deleteMany(
  //       {
  //         userID: new ObjectId(userId),
  //       }
  //       // { session }
  //     );
  //     // session.commitTransaction();
  //     // session.endSession();
  //     return;
  //   } catch (error) {
  //     // await session.abortTransaction();
  //     // await session.endSession();
  //     console.log(error);
  //     throw new ApplicationError("Error in getting total rating", 500);
  //   }
  // }

  // async getTotalAmount(userId, session) {
  //   const db = getDB();
  //   const items = await db
  //     .collection("cartItems")
  //     .aggregate(
  //       [
  //         // 1. filter the document based on userId
  //         {
  //           $match: { userID: new ObjectId(userId) },
  //         },
  //         // 2. Get the product from product collection
  //         {
  //           $lookup: {
  //             from: "products",
  //             localField: "productID",
  //             foreignField: "_id",
  //             as: "productInfo",
  //           },
  //         },
  //         // 3. unwind the product info
  //         {
  //           $unwind: "$productInfo",
  //         },

  //         // 4. Calculate totalAmount for each cartItem
  //         {
  //           $addFields: {
  //             totalAmount: { $multiply: ["$quantity", "$productInfo.price"] },
  //           },
  //         },
  //       ]
  //       // { session }
  //     )
  //     .toArray();
  //   return items;
  // }
}
