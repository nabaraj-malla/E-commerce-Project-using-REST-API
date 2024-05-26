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
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;
    const result = ProductModel.filter(minPrice, maxPrice, category);
    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send("product not matched");
    }
  }
}
