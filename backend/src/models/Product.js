import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      unique: true,
      enum: ['Coke', 'Fanta', 'Sprite'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    description: {
      type: String,
      default: 'Soft drink',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);