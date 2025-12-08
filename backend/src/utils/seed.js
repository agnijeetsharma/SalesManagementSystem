
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "../models/Customers.js";
import "../models/Product.js";
import "../models/Employee.js";
import "../models/Sale.js";

import connectDB from "../db/index.js";
import upsertCustomerByCsv from "../repositories/customerRepo.js";
import upsertProductByCsv from "../repositories/productRepo.js";
import upsertEmployeeByCsv from "../repositories/employeeRepo.js";
import Sale from "../models/Sale.js";
import parseCurrency from "./parseCurrency.js";

function normalizeKey(k) {
  if (!k && k !== 0) return k;

  return String(k)
    .replace(/^\uFEFF/, "")
    .trim();
}

const csvFilePath =
  process.argv[2] || path.join(__dirname, "../data/sales.csv");

if (!fs.existsSync(csvFilePath)) {
  console.error("CSV not found at", csvFilePath);
  process.exit(1);
}

async function seed() {
  await connectDB();
  console.log("Connected to DB for seeding");

  await mongoose.connection.db.dropCollection("sales").catch(() => {});
  await mongoose.connection.db.dropCollection("customers").catch(() => {});
  await mongoose.connection.db.dropCollection("products").catch(() => {});
  await mongoose.connection.db.dropCollection("employees").catch(() => {});

  const BATCH_SIZE = 500;
  const batch = [];
  let count = 0;
  let rowIndex = 0;

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  try {
    for await (const rawInputRow of stream) {
      rowIndex++;

      const rawRow = {};
      for (const key of Object.keys(rawInputRow)) {
        const nk = normalizeKey(key);
        const v = rawInputRow[key];
        rawRow[nk] = typeof v === "string" ? v.trim() : v;
      }

      const customer = await upsertCustomerByCsv(rawRow).catch((err) => {
        console.error(`upsertCustomerByCsv failed at row ${rowIndex}`, err);
        return null;
      });

      const product = await upsertProductByCsv(rawRow).catch((err) => {
        console.error(`upsertProductByCsv failed at row ${rowIndex}`, err);
        return null;
      });

      const employee = await upsertEmployeeByCsv(rawRow).catch((err) => {
        console.error(`upsertEmployeeByCsv failed at row ${rowIndex}`, err);
        return null;
      });

      const hasCustomerName =
        (customer && customer.name && String(customer.name).trim() !== "") ||
        (rawRow["Customer name"] && rawRow["Customer name"].trim() !== "") ||
        (rawRow["Customer Name"] && rawRow["Customer Name"].trim() !== "");
      const hasEmployeeName =
        (employee && employee.name && String(employee.name).trim() !== "") ||
        (rawRow["Employee name"] && rawRow["Employee name"].trim() !== "") ||
        (rawRow["Employee Name"] && rawRow["Employee Name"].trim() !== "");

      if (!hasCustomerName) {
        console.warn(
          `WARN: customer name not found (row ${rowIndex}) - TransactionID=${
            rawRow["Transaction ID"] || rawRow.transactionId || ""
          }`
        );
      }
      if (!hasEmployeeName) {
        console.warn(
          `WARN: employee name not found (row ${rowIndex}) - TransactionID=${
            rawRow["Transaction ID"] || rawRow.transactionId || ""
          }`
        );
      }

      const saleDoc = {
        transactionId:
          rawRow["Transaction ID"] || rawRow.transactionId || undefined,
        date: rawRow["Date"]
          ? new Date(rawRow["Date"])
          : rawRow.date
          ? new Date(rawRow.date)
          : null,

        customer: customer ? customer._id : undefined,
        product: product ? product._id : undefined,
        salesperson: employee ? employee._id : undefined,

        customerNameSnapshot: customer
          ? customer.name
          : rawRow["Customer name"] ||
            rawRow["Customer Name"] ||
            rawRow.customerName ||
            "",
        phoneSnapshot: customer
          ? customer.phoneNumber
          : rawRow["Phone Number"] ||
            rawRow["Phone"] ||
            rawRow.phoneNumber ||
            "",
        customerRegionSnapshot: customer
          ? customer.region
          : rawRow["Customer region"] ||
            rawRow["Customer Region"] ||
            rawRow.region ||
            "",

        productCategorySnapshot: product
          ? product.category
          : rawRow["Product Category"] ||
            rawRow["Product category"] ||
            rawRow.category ||
            "",

        quantity: rawRow["Quantity"]
          ? Number(rawRow["Quantity"])
          : rawRow.quantity
          ? Number(rawRow.quantity)
          : 0,
        pricePerUnit: parseCurrency(
          rawRow["Price per Unit"] || rawRow.pricePerUnit
        ),
        totalAmount: parseCurrency(
          rawRow["Total Amount"] || rawRow.totalAmount
        ),
        finalAmount: parseCurrency(
          rawRow["Final Amount"] || rawRow.finalAmount
        ),
        discountPercentage: rawRow["Discount Percentage"]
          ? Number(rawRow["Discount Percentage"])
          : rawRow.discountPercentage
          ? Number(rawRow.discountPercentage)
          : 0,

        paymentMethod: rawRow["Payment Method"] || rawRow.paymentMethod || "",
        orderStatus: rawRow["Order Status"] || rawRow.orderStatus || "",
        deliveryType: rawRow["Delivery Type"] || rawRow.deliveryType || "",
        tags: product
          ? product.tags
          : rawRow["Tags"]
          ? String(rawRow["Tags"])
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],

        raw: rawRow,
      };

      batch.push(saleDoc);
      count++;

      if (batch.length >= BATCH_SIZE) {
        try {
          await Sale.insertMany(batch);
          console.log(`Inserted ${count} rows...`);
        } catch (err) {
          console.error("Batch insert failed:", err);
          throw err;
        } finally {
          batch.length = 0;
        }
      }
    }

    if (batch.length) {
      await Sale.insertMany(batch);
      console.log(`Inserted ${count} rows (final).`);
      batch.length = 0;
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
}

seed();
