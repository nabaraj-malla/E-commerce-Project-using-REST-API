import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

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
      let { name, price, sizes } = req.body;
      price = parseFloat(price);
      const imageURL = req.file.filename;
      sizes = sizes.split(",");
      const newProduct = new ProductModel(
        name,
        undefined,
        price,
        imageURL,
        undefined,
        sizes
      );
      const result = await this.productRepository.add(newProduct);
      res.status(201).send(result);
    } catch (error) {
      throw new ApplicationError("Invaid credentials", 400);
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
      const { productID, rating } = req.body;
      const userID = req.userID;
      await this.productRepository.rate(userID, productID, rating);
      return res.status(200).send("rating added");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error in rate product", 400);
    }
  }
}
