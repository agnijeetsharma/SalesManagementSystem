import { findWithPagination } from "../repositories/saleRepo.js";
import Sale from "../models/Sale.js";
import Customer from "../models/Customers.js";
import Product from "../models/Product.js";

function toArray(v) {
  if (!v) return [];
  if (Array.isArray(v))
    return v
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseTagsParam(v) {
  if (!v) return [];
  if (Array.isArray(v))
    return v
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  return [String(v).trim()];
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function buildDateRange(from, to) {
  if (!from && !to) return undefined;

  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) {
    const d = new Date(to);
    d.setHours(23, 59, 59, 999);
    range.$lte = d;
  }

  return range;
}

export async function searchSales(params = {}) {
  const {
    q,
    customerRegions,
    genders,
    ageMin,
    ageMax,
    productCategories,
    tags,
    paymentMethods,
    dateFrom,
    dateTo,
    sortBy = "date",
    sortDir = "desc",
    page = 1,
    pageSize = 10,
    include,
  } = params;

  const filter = {};

  const regions = toArray(customerRegions);
  const cats = toArray(productCategories);
  const pay = toArray(paymentMethods);
  const tagArr = parseTagsParam(tags);
  const genArr = toArray(genders);

  const minAge = toNumber(ageMin);
  const maxAge = toNumber(ageMax);

  if (q?.trim()) {
    const r = new RegExp(q.trim(), "i");
    filter.$or = [
      { transactionId: r },
      { customerNameSnapshot: r },
      { phoneSnapshot: r },
      { productCategorySnapshot: r },
    ];
  }
  const customerFilter = {};

  if (regions.length) {
    customerFilter.region = { $in: regions };
  }

  if (genArr.length) {
    customerFilter.gender = { $in: genArr };
  }

  if (minAge !== undefined || maxAge !== undefined) {
    const ageFilter = {};
    if (minAge !== undefined) ageFilter.$gte = minAge;
    if (maxAge !== undefined) ageFilter.$lte = maxAge;
    customerFilter.age = ageFilter;
  }

  if (Object.keys(customerFilter).length) {
    const customers = await Customer.find(customerFilter).select("_id");
    const customerIds = customers.map((c) => c._id);
    if (!customerIds.length) {
      return {
        total: 0,
        page: 1,
        pageSize: Number(pageSize) || 10,
        totalPages: 0,
        items: [],
        facets: {
          regions: [],
          categories: [],
          tags: [],
          payments: [],
        },
      };
    }
    filter.customer = { $in: customerIds };
  }

  const productFilter = {};

  if (cats.length) {
    productFilter.category = { $in: cats };
  }

  if (tagArr.length) {
    productFilter.tags = { $in: tagArr };
  }

  if (Object.keys(productFilter).length) {
    const products = await Product.find(productFilter).select("_id");
    const productIds = products.map((p) => p._id);
    if (!productIds.length) {
      return {
        total: 0,
        page: 1,
        pageSize: Number(pageSize) || 10,
        totalPages: 0,
        items: [],
        facets: {
          regions: [],
          categories: [],
          tags: [],
          payments: [],
        },
      };
    }
    filter.product = { $in: productIds };
  }

  if (pay.length) {
    filter["raw.Payment Method"] = { $in: pay };
  }

  const dateRange = buildDateRange(dateFrom, dateTo);
  if (dateRange) filter.date = dateRange;

  const sort = {};
  if (sortBy === "quantity") {
    sort.quantity = sortDir === "asc" ? 1 : -1;
  } else if (sortBy === "customerName") {
    sort.customerNameSnapshot = sortDir === "asc" ? 1 : -1;
  } else {
    sort.date = sortDir === "asc" ? 1 : -1;
  }

  const p = Math.max(1, Number(page) || 1);
  const size = Math.min(100, Math.max(1, Number(pageSize) || 10));
  const skip = (p - 1) * size;

  const projection = {
    transactionId: 1,
    date: 1,
    customerNameSnapshot: 1,
    phoneSnapshot: 1,
    productCategorySnapshot: 1,
    quantity: 1,
    totalAmount: 1,
    finalAmount: 1,
    raw: 1,
    customer: 1,
    product: 1,
    salesperson: 1,
  };

  const populate = include
    ? String(include)
        .split(",")
        .map((s) => s.trim())
    : ["customer", "product", "salesperson"];

  const populateFields = {
    customer: "customerId name phoneNumber gender age region",
    product: "productId name category tags",
    salesperson: "salespersonId name",
  };

  const { total, items } = await findWithPagination({
    filter,
    projection,
    sort,
    skip,
    limit: size,
    populate,
    populateFields,
  });

  const [regionsFacet, categoriesFacet, tagsFacet, paymentsFacet] =
    await Promise.all([
      Customer.distinct("region"),
      Product.distinct("category"),
      Product.distinct("tags"),
      Sale.distinct("raw.Payment Method"),
    ]);

  const facets = {
    regions: regionsFacet.filter(Boolean),
    categories: categoriesFacet.filter(Boolean),
    tags: tagsFacet.filter(Boolean),
    payments: paymentsFacet.filter(Boolean),
  };

  return {
    total,
    page: p,
    pageSize: size,
    totalPages: Math.ceil(total / size),
    items,
    facets,
  };
}
