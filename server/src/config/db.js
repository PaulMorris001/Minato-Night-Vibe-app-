import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((error) => {
      console.log("Error connecting to the database: ", error);
    });

}