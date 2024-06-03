import express from "express";
import CartItemsController from "./cart.controller.js";

const cartRouter = express.Router();

const cartItemsController = new CartItemsController();

cartRouter.post("/", cartItemsController.add);
cartRouter.get("/", cartItemsController.get);
cartRouter.put("/update", cartItemsController.update);
cartRouter.delete("/delete", cartItemsController.delete);

export default cartRouter;
