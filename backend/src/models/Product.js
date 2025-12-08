import mongoose from 'mongoose';
const { Schema } = mongoose;
const ProductSchema = new Schema({
  productId: String,
  name: String,
  category: String,
  tags: [String],
}, { timestamps: true });

ProductSchema.index({ name: 'text', category: 'text', tags: 'text' }, { name: 'product_text_index' });
ProductSchema.index({ category: 1 });
export default mongoose.model('Product', ProductSchema);
