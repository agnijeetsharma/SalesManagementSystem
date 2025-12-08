import mongoose from "mongoose";
import connectDB from "../db/index.js";
import Sale from "../models/Sale.js";
import Customer from "../models/Customers.js";
import Product from "../models/Product.js";

async function run() {
  console.log("Connected - creating indexes...");

  try {
    await Sale.syncIndexes();
    console.log("Sale indexes created.");
    await Customer.syncIndexes();
    console.log("Customer indexes created.");
    await Product.syncIndexes();
    console.log("Product indexes created.");
  } catch (err) {
    console.error("Index creation failed", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
run();
