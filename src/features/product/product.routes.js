import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";
import validateProduct from "../../middlewares/product.middleware.js";

const router = express.Router();

const productController = new ProductController();

// localhost:9003/api/products/
router.get("/", productController.getAllProducts);
router.post(
  "/",
  upload.single("imageURL"),
  validateProduct,
  productController.addProduct
);
router.get("/:id", productController.getOneProduct);
//localhost:9003/api/products/filter?minPrice=100&maxPrice=500&category=Category1
router.post("/filter", productController.filterProducts);

export default router;
