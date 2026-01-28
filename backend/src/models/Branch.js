import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide branch name'],
      unique: true,
      trim: true,
      enum: ['Nairobi HQ', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret'],
    },
    location: {
      type: String,
      required: [true, 'Please provide branch location'],
    },
    isHeadquarter: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Branch', branchSchema);