
import Employee from "../models/Employee.js";

async function upsertEmployeeByCsv(row = {}) {
  const get = (keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return undefined;
  };

  const salespersonId = get(["Salesperson ID","salespersonId","salesperson_id","Employee ID"]);
  const name = get(["Employee name","Employee Name","employeeName","Name","Salesperson"]);
  const storeId = get(["Store ID","storeId"]);
  const storeLocation = get(["Store Location","Store location","storeLocation"]);

  const filter = salespersonId ? { salespersonId } : (name ? { name } : {});

  const update = {
    $set: {
      salespersonId: salespersonId || undefined,
      name: name || '',
      storeId: storeId || '',
      storeLocation: storeLocation || ''
    }
  };

  return Employee.findOneAndUpdate(filter, update, { upsert: true, new: true }).exec();
}

export default upsertEmployeeByCsv;
