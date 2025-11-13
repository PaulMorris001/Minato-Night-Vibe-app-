import mongoose from "mongoose";
import dotenv from "dotenv";
import { City, VendorType } from "../models/vendor.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI

const cities = [
  { name: "Boston", state: "Massachusetts" },
  { name: "New York City", state: "New York" },
  { name: "Atlanta", state: "Georgia" },
  { name: "Los Angeles", state: "California" },
  { name: "Houston", state: "Texas" },
  { name: "Chicago", state: "Illinois" },
  { name: "Washington", state: "DC" },
  { name: "Miami", state: "Florida" },
  { name: "New Orleans", state: "Louisiana" },
  { name: "Detroit", state: "Michigan" },
  { name: "San Francisco", state: "California" },
];

const vendorTypes = [
  { name: "Chefs", icon: "chefs" },
  { name: "Restaurants", icon: "restaurants" },
  { name: "Music and Bands", icon: "music" },
  { name: "Bars and Clubs", icon: "clubs" },
  { name: "Casinos", icon: "casino" },
  { name: "Concerts", icon: "concert" },
  { name: "Events", icon: "events" },
  { name: "Transportation", icon: "transport" },
  { name: "Venues", icon: "venues" },
  { name: "Florists", icon: "flowers" },
  { name: "Decorations", icon: "decor" },
  { name: "Desserts", icon: "desserts" },
  { name: "Beverages", icon: "beverages" },
  { name: "Other", icon: "other" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await City.deleteMany();
    await VendorType.deleteMany();

    await City.insertMany(cities);
    await VendorType.insertMany(vendorTypes);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
