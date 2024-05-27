import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. Check if Authorization headers is empty
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }

  // 2. Extract Credentials. [Basic <credentials>] where credentials = jfie84Dfehih239rjnv
  console.log(authHeader);
  const base64Credentials = authHeader.replace("Basic ", "");
  console.log(base64Credentials);

  // 3. Decode credentials
  const decodedCred = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  console.log(decodedCred); // [username:password]
  const creds = decodedCred.split(":");
  console.log(creds);

  const user = UserModel.getAll().find(
    (u) => u.email == creds[0] && u.password == creds[1]
  );

  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect credentials");
  }
};

export default basicAuthorizer;
