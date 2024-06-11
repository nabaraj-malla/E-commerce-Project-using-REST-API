import CartRepository from "./cart.repository.js";

export default class CartItemsController {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      await this.cartRepository.add(productID, userID, quantity);
      return res.status(201).send("item added");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in adding item to cart", 500);
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const results = await this.cartRepository.get(userID);
      return res.status(200).send(results);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in getting items from cart", 500);
    }
  }

  async delete(req, res) {
    try {
      const userID = req.userID;
      const { cartItemID } = req.body;
      await this.cartRepository.delete(userID, cartItemID);
      return res.status(200).send("item deleted");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error in deleting items from cart", 500);
    }
  }

  // async update(req, res) {
  //   try {
  //     const { cartItemID, newQuantity } = req.body;
  //     const userID = req.userID;
  //     await this.cartRepository.updateQunatity(
  //       userID,
  //       cartItemID,
  //       parseFloat(newQuantity)
  //     );
  //     return res.status(200).send("quantity updated successfully");
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApplicationError("Error in updating cartItem quantity", 500);
  //   }
  // }
}
