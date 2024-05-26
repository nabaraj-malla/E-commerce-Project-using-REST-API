import { body, validationResult } from "express-validator";

const validateProduct = async (req, res, next) => {
  const rules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should be a positive value"),
    body("sizes").notEmpty().withMessage("size is required"),
    body("imageURL").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Image is required");
      }
      return true;
    }),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  var validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.send(validationErrors.array()[0].msg);
  }
  next();
};

export default validateProduct;
