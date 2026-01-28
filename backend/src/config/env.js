import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
  },
  port: process.env.PORT || 5000,
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    businessShortcode: process.env.MPESA_BUSINESS_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    callbackUrl: process.env.MPESA_CALLBACK_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};