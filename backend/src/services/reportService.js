import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Branch from '../models/Branch.js';

export const generateSalesReport = async (startDate, endDate) => {
  try {
    // Get all completed sales in the date range
    const query = {
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    const sales = await Sale.find(query)
      .populate('product')
      .populate('branch')
      .lean();

    if (!sales || sales.length === 0) {
      return {
        totalSales: 0,
        totalIncome: 0,
        salesByProduct: [],
        salesByBranch: [],
      };
    }

    // Calculate total sales and income
    const totalSales = sales.length;
    const totalIncome = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Group by product
    const productMap = {};
    sales.forEach((sale) => {
      const productName = sale.product.name;
      if (!productMap[productName]) {
        productMap[productName] = {
          productName,
          quantity: 0,
          income: 0,
        };
      }
      productMap[productName].quantity += sale.quantity;
      productMap[productName].income += sale.totalAmount;
    });

    const salesByProduct = Object.values(productMap);

    // Group by branch
    const branchMap = {};
    sales.forEach((sale) => {
      const branchName = sale.branch.name;
      if (!branchMap[branchName]) {
        branchMap[branchName] = {
          branchName,
          quantity: 0,
          income: 0,
        };
      }
      branchMap[branchName].quantity += sale.quantity;
      branchMap[branchName].income += sale.totalAmount;
    });

    const salesByBranch = Object.values(branchMap);

    return {
      totalSales,
      totalIncome,
      salesByProduct,
      salesByBranch,
      dateRange: startDate && endDate ? { startDate, endDate } : null,
    };
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw new Error('Failed to generate sales report');
  }
};

export const getSalesbyProduct = async (productId, startDate, endDate) => {
  try {
    const query = {
      product: productId,
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    const sales = await Sale.find(query).populate('branch').lean();

    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalIncome = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      totalQuantity,
      totalIncome,
      salesCount: sales.length,
      sales,
    };
  } catch (error) {
    console.error('Error getting sales by product:', error);
    throw new Error('Failed to get sales by product');
  }
};

export const getSalesByBranch = async (branchId, startDate, endDate) => {
  try {
    const query = {
      branch: branchId,
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    const sales = await Sale.find(query).populate('product').lean();

    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalIncome = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      totalQuantity,
      totalIncome,
      salesCount: sales.length,
      sales,
    };
  } catch (error) {
    console.error('Error getting sales by branch:', error);
    throw new Error('Failed to get sales by branch');
  }
};

export default {
  generateSalesReport,
  getSalesbyProduct,
  getSalesByBranch,
};