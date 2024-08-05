export const restrictAddProduct = (req, res, next) => {
  const userType = req.type;
  console.log(userType);
  if (userType == "merchant") {
    next();
  } else {
    return res.send("user must be merchant");
  }
  console.log(userType);
};
