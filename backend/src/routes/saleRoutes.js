import express from 'express';
import {
  getAvailableProducts,
  initiatePayment,
  confirmPayment,
  getMyPurchases,
  mpesaCallback,
} from '../controllers/saleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes for customers
router.get('/available-products/:branchId', protect, getAvailableProducts);
router.post('/initiate-payment', protect, initiatePayment);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/my-purchases', protect, getMyPurchases);

// M-Pesa callback (public but should be secured in production)
router.post('/mpesa-callback', mpesaCallback);

export default router;