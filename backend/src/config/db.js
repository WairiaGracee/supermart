import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;