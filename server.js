import express, { json } from "express";
import ProductRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";

const server = express();
// server.use(express.json());
server.use(bodyParser.json());
const PORT = 9003;

// Routes
server.use("/api/products", ProductRouter);

server.get("/", (req, res) => {
  return res.send("Welcome to Ecommerce APIs");
});

server.listen(PORT, () => {
  console.log(`server is listening at Port no. ${PORT}`);
});
