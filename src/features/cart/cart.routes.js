import express from "express";
import CartItemsController from "./cart.controller.js";

const cartRouter = express.Router();

const cartItemsController = new CartItemsController();

cartRouter.post("/", (req, res) => {
  cartItemsController.add(req, res);
});
cartRouter.get("/cartItems", (req, res) => {
  cartItemsController.get(req, res);
});
// cartRouter.put("/update", (req, res) => {
//   cartItemsController.update(req, res);
// });
cartRouter.delete("/delete", (req, res) => {
  cartItemsController.delete(req, res);
});

export default cartRouter;
