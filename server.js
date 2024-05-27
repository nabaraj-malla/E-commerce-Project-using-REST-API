import express, { json } from "express";
import ProductRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import bodyParser from "body-parser";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

const server = express();
// server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));
const PORT = 9003;

// Routes
server.use("/api/products", jwtAuth, ProductRouter);
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  return res.send("Welcome to Ecommerce APIs");
});

server.listen(PORT, () => {
  console.log(`server is listening at Port no. ${PORT}`);
});
