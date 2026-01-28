import * as reportService from '../services/reportService.js';

// @desc    Get comprehensive sales report
// @route   GET /api/reports/sales-summary
// @access  Private/Admin
export const getSalesSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const report = await reportService.generateSalesReport(startDate, endDate);

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales grouped by product
// @route   GET /api/reports/sales-by-product
// @access  Private/Admin
export const getSalesByProduct = async (req, res, next) => {
  try {
    const { productId, startDate, endDate } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID',
      });
    }

    const report = await reportService.getSalesbyProduct(
      productId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales grouped by branch
// @route   GET /api/reports/sales-by-branch
// @access  Private/Admin
export const getSalesByBranch = async (req, res, next) => {
  try {
    const { branchId, startDate, endDate } = req.query;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide branch ID',
      });
    }

    const report = await reportService.getSalesByBranch(
      branchId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/reports/products
// @access  Private/Admin
export const getProducts = async (req, res, next) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};