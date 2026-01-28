import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a customer'],
    },
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
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Please provide unit price'],
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    mpesaTransactionId: {
      type: String,
      sparse: true,
    },
    mpesaReceiptNumber: {
      type: String,
      sparse: true,
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'cash'],
      default: 'mpesa',
    },
    saleDate: {
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

// Index for faster queries
saleSchema.index({ customer: 1, createdAt: -1 });
saleSchema.index({ branch: 1, createdAt: -1 });
saleSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model('Sale', saleSchema);