import mongoose from 'mongoose';
const EmployeeSchema = new mongoose.Schema({
  salespersonId: { type: String, index: true },
  name: String,
  storeId: String,
  storeLocation: String
}, { timestamps: true });
export default mongoose.model('Employee', EmployeeSchema);
