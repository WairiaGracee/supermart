import express from 'express';
import {
  getSalesSummary,
  getSalesByProduct,
  getSalesByBranch,
  getProducts,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/sales-summary', protect, authorize('admin'), getSalesSummary);
router.get('/sales-by-product', protect, authorize('admin'), getSalesByProduct);
router.get('/sales-by-branch', protect, authorize('admin'), getSalesByBranch);
router.get('/products', protect, authorize('admin'), getProducts);

export default router;