import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
const jwtAuth = (req, res, next) => {
  // 1. Read token
  console.log(req.headers);
  const token = req.headers["authorization"];

  // 2. if no token, return the error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // 3. Check if token is valid
  try {
    const secretKey = process.env.JWT_SECRET;
    console.log("secretKey", secretKey);
    const payload = jwt.verify(token, secretKey);
    req.userID = payload.userID;
    req.type = payload.type;
    console.log("payload", payload);
  } catch (error) {
    // 4. Return error
    return res.status(401).send("Unauthorized");
  }
  //5. call next middleware
  next();
};

export default jwtAuth;
