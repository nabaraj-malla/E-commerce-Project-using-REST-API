import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ObjectId } from "mongodb";
export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    const products = await this.productRepository.getAll();
    console.log(products);
    return res.status(200).send(products);
  }

  async addProduct(req, res) {
    try {
      console.log("req.body", req.body);
      // let { name, desc, price, inStock, imageURL, sizes, categories } =
      //   req.body;
      let { name, desc, price, inStock, sizes, categories } = req.body;
      inStock = parseFloat(inStock);
      price = parseFloat(price);
      const imageURL = req.file.path;
      categories = categories.split(",").map((e) => e.trim());
      sizes = sizes.split(",");
      const newProduct = new ProductModel(
        name,
        desc,
        price,
        inStock,
        imageURL,
        sizes,
        null,
        // null
        categories
      );
      const result = await this.productRepository.add(newProduct);
      res.status(201).send({ success: true, result });
    } catch (error) {
      console.log("error", error);
      throw new ApplicationError("Error in adding data", 400);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (product) {
        return res.status(200).send(product);
      } else {
        return res.status(404).send("id not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);
      const category = req.query.category;
      console.log("category", category);
      let result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("No matching product found", 500);
    }
  }

  async rateProduct(req, res) {
    try {
      const { productID, rating, text } = req.body;
      console.log("productID", typeof productID);
      console.log("mongodb ID", new ObjectId(productID));
      console.log("mongoose objectID", new mongoose.Types.ObjectId(productID));
      const userID = req.userID;
      const result = await this.productRepository.rate(
        userID,
        productID,
        rating,
        text
      );
      return res.status(200).send({ status: "rating added", result });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error in rate product", 400);
    }
  }

  async updateProduct(req, res) {
    try {
      const { productID, updatedCategory } = req.body;
      console.log(updatedCategory);
      await this.productRepository.update(productID, updatedCategory);
      return res.status(200).send("Category updated successfully");
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong with updating product",
        500
      );
    }
  }

  async averagePrice(req, res, next) {
    try {
      const results =
        await this.productRepository.averageProductPricePerCategory();
      return res.status(200).send(results);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in computing aggregation", 500);
    }
  }

  async averageRating(req, res, next) {
    try {
      const productId = req.params.productId;
      console.log("productId", productId);
      const result = await this.productRepository.averageProductRating(
        productId
      );
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in computing average rating", 500);
    }
  }

  async addProductCategory(req, res) {
    try {
      console.log(req.body);
      const { category } = req.body;
      const result = await this.productRepository.newCategory(category);
      return res.status(201).send(result);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in adding new category", 500);
    }
  }
}
