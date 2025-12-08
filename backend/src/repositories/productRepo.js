
import Product from "../models/Product.js";

async function upsertProductByCsv(row = {}) {
  const get = (keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return undefined;
  };

  const productId = get(["Product ID","productId","product_id"]);
  const name = get(["Product Name","Product name","productName","Name"]);
  const brand = get(["Brand","brand"]);
  const category = get(["Product Category","Product category","category"]);
  const tagsRaw = get(["Tags","tags"]);

  const filter = productId ? { productId } : (name ? { name } : {});

  const update = {
    $set: {
      productId: productId || undefined,
      name: name || '',
      brand: brand || '',
      category: category || '',
      tags: tagsRaw ? String(tagsRaw).split("|").map(s => s.trim()).filter(Boolean) : []
    }
  };

  return Product.findOneAndUpdate(filter, update, { upsert: true, new: true }).exec();
}

export default upsertProductByCsv;
