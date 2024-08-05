import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";
import validateProduct from "../../middlewares/product.middleware.js";
import { restrictAddProduct } from "../../middlewares/addProduct.middleware.js";

const router = express.Router();

const productController = new ProductController();

router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
// router.post(
//   "/add",
//   restrictAddProduct,
//   upload.single("imageURL"),
//   validateProduct,
//   (req, res) => {
//     productController.addProduct(req, res);
//   }
// );
// router.post("/add", upload.single("imageURL"), validateProduct, (req, res) => {
//   productController.addProduct(req, res);
// });

router.post("/add", upload.single("imageURL"), (req, res) => {
  productController.addProduct(req, res);
});

// router.post("/add", (req, res) => {
//   productController.addProduct(req, res);
// });

router.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res, next);
});
router.get("/averageRating", (req, res, next) => {
  productController.averageRating(req, res, next);
});
router.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
router.post("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
router.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});
router.patch("/update", (req, res) => {
  productController.updateProduct(req, res);
});

export default router;
