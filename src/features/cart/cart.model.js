import ProductModel from "../product/product.model.js";

export default class CartItemModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this.id = id;
  }

  static add(productID, userID, quantity) {
    const product = ProductModel.getAll().find((p) => p.id == productID);
    if (!product) {
      return { success: false, msg: "productID not found" };
    }
    const cartItem = new CartItemModel(productID, userID, quantity);
    cartItem.id = cartItems.length + 1;
    cartItems.push(cartItem);
    return { success: true, cartItem: cartItem };
  }

  static get(userID) {
    const result = cartItems.filter((c) => c.userID == userID);
    return result;
  }

  static update(productID, userID, quantity) {
    const cartIndex = cartItems.findIndex(
      (c) => c.userID == userID && c.productID == productID
    );
    if (cartIndex < 0) {
      return { success: false, msg: "cartItem not found" };
    }
    quantity = Number(cartItems[cartIndex].quantity) + Number(quantity);
    const updatedProduct = new CartItemModel(productID, userID, quantity);
    updatedProduct.id = cartItems[cartIndex].id;
    cartItems[cartIndex] = updatedProduct;
    return { success: true, updatedProduct: updatedProduct };
  }

  static delete(cartItemID, userID) {
    const cartIndex = cartItems.findIndex(
      (c) => c.id == cartItemID && c.userID == userID
    );
    if (cartIndex != -1) {
      cartItems.splice(cartIndex, 1);
    } else {
      return "cartID not found";
    }
  }
}

var cartItems = [new CartItemModel(1, 2, 1, 1)];
