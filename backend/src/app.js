
import "./models/Customers.js";
import "./models/Product.js";
import "./models/Employee.js";
import "./models/Sale.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { salesRoutes as salesRouter } from "./routes/salesRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json({ limit: "19kb" }));
app.use(express.urlencoded({ extended: true, limit: "18kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/sales", salesRouter);
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

export { app };
