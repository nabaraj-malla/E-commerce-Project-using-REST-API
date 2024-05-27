import { body, validationResult } from "express-validator";

export const validateUser = async (req, res, next) => {
  const rules = [
    body("name").notEmpty().withMessage("name is required"),
    body("email")
      .isEmail()
      .withMessage("Invaid email address")
      .normalizeEmail() // converts to lowercase
      .custom((value) => {
        if (!value.endsWith("@test.com")) {
          throw new Error("email must be from test.com");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("minimum 6 characters is required")
      .custom((value) => {
        if (
          !(value.includes("@") || value.includes("*") || value.includes("#"))
        ) {
          throw new Error("special character is required");
        }
        return true;
      }),
    body("type").notEmpty().withMessage("user type is required"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send(validationErrors.array()[0].msg);
  }
  next();
};
