export default class ProductModel {
  constructor(name, desc, price, imageURL, category, sizes) {
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageURL = imageURL;
    this.category = category;
    this.sizes = sizes;
  }
}
