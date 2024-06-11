import { ObjectId } from "mongodb";

export default class CartItemModel {
  constructor(productID, userID, quantity) {
    this.productID = new ObjectId(productID);
    this.userID = new ObjectId(userID);
    this.quantity = quantity;
  }
}
