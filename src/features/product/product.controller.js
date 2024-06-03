import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.getAll();
    return res.status(200).send(products);
  }

  addProduct(req, res) {
    const { name, price, sizes } = req.body;
    const newProduct = {
      name: name,
      price: parseFloat(price),
      sizes: sizes.split(","),
      imageURL: req.file.filename,
    };

    const createdRecord = ProductModel.add(newProduct);
    res.status(201).send(createdRecord);
  }

  getOneProduct(req, res) {
    const id = req.params.id;
    const product = ProductModel.getOne(id);
    if (product) {
      return res.status(200).send(product);
    } else {
      return res.status(404).send("id not found");
    }
  }

  filterProducts(req, res) {
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const category = req.query.category;
    let result = ProductModel.filter(minPrice, maxPrice, category);
    return res.status(200).send(result);
  }

  rateProduct(req, res) {
    const userID = req.query.userID;
    const productID = req.query.productID;
    const rating = req.query.rating;
    // try {
    ProductModel.rating(userID, productID, rating);
    // } catch (err) {
    // return res.status(400).send(err.message);
    // }
    return res.status(200).send("rating added");
  }
}
