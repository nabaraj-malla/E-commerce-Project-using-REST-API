import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types",
  },
  types: {
    type: String,
    enum: ["Product", "Category"],
  },
})
  .pre("save", (next) => {
    console.log("new like coming in");
    next();
  })
  .post("save", (doc, next) => {
    console.log("Like is saved");
    console.log(doc);
    next();
  })
  .pre("find", (next) => {
    console.log("try getting all the likes");
    next();
  })
  .post("find", (doc, next) => {
    console.log("got all the likes");
    console.log(doc);
    next();
  });
