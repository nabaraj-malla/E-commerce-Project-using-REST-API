import dotenv from "dotenv";
import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url = process.env.MONGO_URL;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Mongodb connected using mongoose");
    await addCategories();
  } catch (error) {
    console.log("Error while connecting to DB");
    console.log(error);
  }
};

async function addCategories() {
  const CategoryModel = mongoose.model("category", categorySchema);
  const categories = await CategoryModel.find();
  if (!categories || categories.length == 0) {
    await CategoryModel.insertMany([
      { name: "Books" },
      { name: "Sports" },
      { name: "Eectronics" },
      { name: "Clothing" },
      { name: "Summer" },
    ]);
  }
}
