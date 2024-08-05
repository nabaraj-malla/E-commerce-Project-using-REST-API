export default class ProductModel {
  constructor(name, desc, price, inStock, imageURL, sizes, review, categories) {
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.inStock = inStock;
    this.imageURL = imageURL;
    this.sizes = sizes;
    this.review = review;
    this.categories = categories;
  }
}
