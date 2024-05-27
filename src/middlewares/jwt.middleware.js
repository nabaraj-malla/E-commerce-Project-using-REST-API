import jwt from "jsonwebtoken";

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
    const payload = jwt.verify(token, "KdE9vVDUQzaBqmM");
    console.log("payload", payload);
  } catch (error) {
    // 4. Return error
    return res.status(401).send("Unauthorized");
  }
  //5. call next middleware
  next();
};

export default jwtAuth;
