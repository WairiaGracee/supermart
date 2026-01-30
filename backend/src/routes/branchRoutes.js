import express from 'express';
import Branch from '../models/Branch.js';

const router = express.Router();

// @desc    Get all branches (public - for registration)
// @route   GET /api/branches
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const branches = await Branch.find().select('_id name location');

    res.status(200).json({
      success: true,
      count: branches.length,
      branches,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
