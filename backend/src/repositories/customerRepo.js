
import Customer from "../models/Customers.js";
async function upsertCustomerByCsv(row = {}) {
  const get = (keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return String(row[k]).trim();
    }
    return undefined;
  };

  const customerId = get(["Customer ID","customerId","customer_id","CustomerId"]);
  const name = get(["Customer name","Customer Name","customerName","Name","Name of Customer","Customer"]);
  const phone = get(["Phone Number","Phone","phoneNumber","PhoneNumber","phone"]);
  const region = get(["Customer region","Customer Region","region","Region"]);
  const gender = get(["Gender","gender"]);
  const age = get(["Age","age"]);
  const type = get(["Customer Type","customerType"]);

  const filter = customerId ? { customerId } : (phone ? { phoneNumber: phone } : { name });

  const update = {
    $set: {
      customerId: customerId || undefined,
      name: name || '',
      phoneNumber: phone || '',
      gender: gender || '',
      age: age ? Number(age) : undefined,
      region: region || '',
      type: type || ''
    }
  };

  const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
  return Customer.findOneAndUpdate(filter, update, opts).exec();
}

export default upsertCustomerByCsv;
