import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async signUp(newUser) {
    try {
      // 1. Get the database
      const db = getDB();
      //2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Insert a document
      await collection.insertOne(newUser);
      return newUser;
    } catch (error) {
      throw new ApplicationError("something went wrong", 500);
    }
  }

  async findByEmail(email) {
    try {
      // 1. Get the database
      const db = getDB();
      //2. Get the collection
      const collection = db.collection(this.collection);
      // 3. find a document
      const user = await collection.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Invalid Credentials", 400);
    }
  }
}

export default UserRepository;
