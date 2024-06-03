import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(id, name, desc, price, imageURL, category, sizes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageURL = imageURL;
    this.category = category;
    this.sizes = sizes;
  }

  static getAll() {
    return products;
  }

  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static getOne(id) {
    const product = products.find((product) => product.id == id);
    if (product) {
      return product;
    } else {
      return null;
    }
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });
    if (result.length === 0) {
      throw new ApplicationError("product don't matched", 404);
    }
    return result;
  }
  static rating(userID, productID, rating) {
    // 1. validating user
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      throw new ApplicationError("user not found", 404);
    }
    // 1. validating product
    const product = products.find((p) => p.id == productID);
    if (!product) {
      // return "product not found";
      throw new ApplicationError("product not found", 400);
    }

    // 3. check if ratings array exist if not create a new ratings array
    if (!product.ratings) {
      product.ratings = new Array();
      product.ratings.push({ userID: userID, rating: rating });
    } else {
      // 4. Check if particular user's rating already available
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );

      // 5. if available update
      if (existingRatingIndex != -1) {
        product.ratings[existingRatingIndex] = {
          userID: userID,
          rating: rating,
        };
      } else {
        // 6.if no existing rating, then add new rating
        product.ratings.push({ userID: userID, rating: rating });
      }
    }
  }
}

export var products = [
  new ProductModel(
    1,
    "Atomic Habits",
    "A supremely practical and useful book.",
    300,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Category1"
  ),

  new ProductModel(
    2,
    "Ikigai",
    "The Japanese secret to a long and happy life",
    340,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Category2",
    ["S", "M", "XL"]
  ),

  new ProductModel(
    3,
    "Deep Work",
    "RULES FOR FOCUSED SUCCESS IN A DISTRACTED WORLD",
    280,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category3",
    ["S", "M", "L"]
  ),
];
