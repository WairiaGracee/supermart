import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Please provide a branch'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 0,
      default: 0,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique branch-product combination
stockSchema.index({ branch: 1, product: 1 }, { unique: true });

export default mongoose.model('Stock', stockSchema);