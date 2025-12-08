import mongoose from "mongoose";
const { Schema } = mongoose;

const SaleSchema = new Schema(
  {
    transactionId: String,
    date: Date,
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    salesperson: { type: Schema.Types.ObjectId, ref: "Employee" },
    customerNameSnapshot: String,
    phoneSnapshot: String,
    productCategorySnapshot: String,
    quantity: Number,
    totalAmount: Number,
    finalAmount: Number,
    raw: Schema.Types.Mixed,
  },
  { timestamps: true }
);

SaleSchema.index(
  {
    customerNameSnapshot: "text",
    productCategorySnapshot: "text",
    "raw.Customer name": "text",
    "raw.Product Category": "text",
    'raw["Product name"]': "text",
    'raw["Employee name"]': "text",
  },
  {
    name: "sale_text_index",
    default_language: "english",
  }
);

SaleSchema.index({ customerRegionSnapshot: 1 });
SaleSchema.index({ productCategorySnapshot: 1 });
SaleSchema.index({ paymentMethod: 1 });
SaleSchema.index({ date: 1 });

export default mongoose.model("Sale", SaleSchema);
