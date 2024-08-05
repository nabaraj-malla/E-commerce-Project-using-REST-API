import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("reivew", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);
// const CategoryModel = mongoose.model("category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      console.log(productData);
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();
      // updating category collection
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        {
          $push: { productID: new ObjectId(savedProduct._id) },
        }
      );

      return savedProduct;
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error in adding new product");
    }
  }

  async getAll() {
    try {
      const results = await ProductModel.find();
      return results;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong on getAll", 500);
    }
  }

  async get(id) {
    try {
      const result = await ProductModel.findById(id);
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong on getAll", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);

      // Approach final
      // let filterExpression = new Object();
      // if (minPrice) {
      //   filterExpression.price = { $gte: minPrice };
      // }

      // if (category) {
      //   filterExpression = { $or: [{ category: category }, filterExpression] };
      // }
      // return await collection.find(filterExpression).toArray();
      // Approach 1st
      // let filterExpression = {};
      // if (minPrice) {
      //   filterExpression.price = { $gte: parseFloat(minPrice) };
      // }
      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }

      // if (category) {
      //   filterExpression.category = category;
      // }

      // return await collection.find(filterExpression).toArray();

      // Approach 2nd
      const conditions = new Array();
      if (minPrice !== undefined && !isNaN(parseFloat(minPrice))) {
        conditions.push({ price: { $gte: parseFloat(minPrice) } });
      }

      if (maxPrice !== undefined && !isNaN(parseFloat(maxPrice))) {
        conditions.push({ price: { $lte: parseFloat(maxPrice) } });
      }

      if (category !== undefined && category !== null) {
        conditions.push({ category: { $eq: category } });
      }

      if (conditions.length == 0) {
        return [];
      }
      // Construct the query using $and if there are conditions
      // const query = { $and: conditions };
      // return await collection.find(query).toArray();
      // return await collection
      //   .find({ $and: conditions })
      //   .project({ name: 1, price: 1, _id: 0, ratings: { $slice: [1, 2] } })
      //   .toArray();

      return await ProductModel.find({ $and: conditions }).select({
        name: 1,
        price: 1,
        _id: 0,
      });
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
  async rate(userID, productID, rating, text) {
    try {
      // 1. Check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("product not found");
      }

      // 2. Get the existing review
      var result;
      const userReview = await ReviewModel.findOne({
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        userReview.text = text;
        result = await userReview.save();
      } else {
        const newReview = new ReviewModel({
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
          rating: rating,
          text: text,
        });
        result = await newReview.save();
      }

      console.log(result);
      // updating product review
      await ProductModel.updateOne(
        { _id: result.productID },
        {
          $push: { reviews: result._id },
        }
      );

      // const db = getDB();
      // const collection = db.collection(this.collection);
      // //   1. Removing existing entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productID),
      //   },
      //   {
      //     $pull: { ratings: { userID: new ObjectId(userID) } },
      //   }
      // );
      // //   2. Add new entry
      // await collection.updateOne(
      //   { _id: new ObjectId(productID) },
      //   { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      // );
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async update(productID, updatedCategory) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $set: {
            category: updatedCategory,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong with updating product",
        500
      );
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const results = await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
          {
            $sort: { averagePrice: 1 },
          },
        ])
        .toArray();
      return results;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in computing aggregation", 500);
    }
  }
  async averageProductRating() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const results = await collection
        .aggregate([
          { $unwind: "$ratings" },
          {
            $group: {
              _id: "$name",
              averageRating: { $avg: "$ratings.rating" },
            },
          },
        ])
        .toArray();
      return results;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in computing average rating", 500);
    }
  }
}

export default ProductRepository;
