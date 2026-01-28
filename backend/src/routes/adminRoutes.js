import express from 'express';
import {
  getAllBranches,
  getBranchInventory,
  getAllInventory,
  initializeStock,
  restock,
  updateStock,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/branches', protect, authorize('admin'), getAllBranches);
router.get('/inventory', protect, authorize('admin'), getAllInventory);
router.get('/inventory/:branchId', protect, authorize('admin'), getBranchInventory);
router.post('/initialize-stock', protect, authorize('admin'), initializeStock);
router.post('/restock', protect, authorize('admin'), restock);
router.put('/stock/:stockId', protect, authorize('admin'), updateStock);

export default router;