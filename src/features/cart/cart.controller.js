import CartItemModel from "./cart.model.js";

export default class CartItemsController {
  add(req, res) {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    console.log("add method", productID, userID, quantity);
    const result = CartItemModel.add(productID, userID, quantity);
    if (result.success) {
      return res.status(201).send(result);
    } else {
      return res.status(401).send(result);
    }
    // return res.status(201).send({ msg: "cartItem added", product });
  }

  get(req, res) {
    const userID = req.userID;
    const result = CartItemModel.get(userID);
    return res.status(200).send(result);
  }

  update(req, res) {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    const result = CartItemModel.update(productID, userID, quantity);
    if (result.success) {
      return res.status(200).send(result);
    } else {
      return res.status(400).send(result);
    }
  }

  delete(req, res) {
    const userID = req.userID;
    const { cartItemID } = req.query;
    console.log(cartItemID);
    const error = CartItemModel.delete(cartItemID, userID);
    if (error) {
      return res.status(404).send(error);
    } else {
      return res.status(200).send("Cart item removed successfully");
    }
  }
}
