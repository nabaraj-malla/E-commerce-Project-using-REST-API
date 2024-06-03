import express, { json } from "express";
import cors from "cors";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import ProductRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import bodyParser from "body-parser";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import logError from "./src/middlewares/errorLogger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";

const server = express();

// CORS policy configuration
server.use(cors());
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));

// swagger
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
// Routes
server.use(loggerMiddleware);

server.use("/api/products", jwtAuth, ProductRouter);
server.use("/api/users", userRouter);
server.use("/api/carts", jwtAuth, cartRouter);

server.get("/", (req, res) => {
  return res.send("Welcome to Ecommerce APIs");
});

// Error handler Middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  } else {
    logError(req.url, err);
    res.status(500).send("Something went wrong");
  }
});

// Middleware to handle 404 request
server.use((req, res) => {
  return res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:9003/api-docs"
    );
});

const PORT = 9003;
server.listen(PORT, () => {
  console.log(`server is listening at Port no. ${PORT}`);
});
