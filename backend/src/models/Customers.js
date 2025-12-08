import mongoose from 'mongoose';
const { Schema } = mongoose;
const CustomerSchema = new Schema({
  customerId: String,
  name: String,
  phoneNumber: String,
  gender: String,
  age: Number,
  region: String,
  type: String
}, { timestamps: true });

// text index on name and customerId/phone for searching
CustomerSchema.index({ name: 'text', customerId: 'text', phoneNumber: 'text' }, { name: 'customer_text_index' });

export default mongoose.model('Customer', CustomerSchema);
