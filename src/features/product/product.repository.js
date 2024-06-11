import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(newProduct) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error in adding new product");
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const results = await collection.find().toArray();
      return results;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong on getAll", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.findOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong on getAll", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }

      if (category) {
        filterExpression.category = category;
      }

      return await collection.find(filterExpression).toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in filter", 400);
    }
  }

  // Approach 1st
  //   async rate(userID, productID, rating) {
  //     try {
  //       const db = getDB();
  //       const collection = db.collection(this.collection);
  //       //   1. find the product
  //       const product = await collection.findOne({
  //         _id: new ObjectId(productID),
  //       });
  //       //   2. Find the rating
  //       const userRating = product?.ratings?.find((r) => r.userID == userID);
  //       if (userRating) {
  //         // 3. Update the rating
  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productID),
  //             "ratings.userID": new ObjectId(userID),
  //           },
  //           {
  //             $set: {
  //               "ratings.$.rating": rating,
  //             },
  //           }
  //         );
  //       } else {
  //         await collection.updateOne(
  //           { _id: new ObjectId(productID) },
  //           { $push: { ratings: { userID: new ObjectId(userID), rating } } }
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       throw new ApplicationError("Something went wrong with database", 500);
  //     }
  //   }

  // Approach 2nd
  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      //   1. Removing existing entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );

      //   2. Add new entry
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      );
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
