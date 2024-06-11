import { MongoClient } from "mongodb";

let url = process.env.DB_URL;
console.log("url", url);

var client;
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance.db();
      createCounter(client);
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDB = () => {
  return client;
};

export const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({
      _id: "cartItemId",
      value: 0,
    });
  }
};

// var client;
// export const connectToMongoDB = async () => {
//   try {
//     clientInstance = await MongoClient.connect(url);
//     client = clientInstance.db()
//     console.log("connect to Mongodb successfully");
//   } catch (error) {
//     console.log(error);
//   }
// };
