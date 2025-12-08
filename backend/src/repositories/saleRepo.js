
import Sale from '../models/Sale.js'
export async function findWithPagination({ filter, projection = {}, sort = { date: -1 }, skip = 0, limit = 10, populate = [], populateFields = {} }) {
  const query = Sale.find(filter, projection).sort(sort).skip(skip).limit(limit);
  for (const path of populate) {
    const sel = populateFields[path] || '';
    query.populate(path, sel);
  }
  const [total, items] = await Promise.all([
    Sale.countDocuments(filter),
    query.lean()
  ]);
  return { total, items };
}
