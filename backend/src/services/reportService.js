import { Op } from 'sequelize';
import { Sale, Product, Branch } from '../models/index.js';

export const generateSalesReport = async (startDate, endDate) => {
  try {
    // Build where clause for completed sales in the date range
    const whereClause = {
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      whereClause.saleDate = {};
      if (startDate) {
        whereClause.saleDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.saleDate[Op.lte] = end;
      }
    }

    const sales = await Sale.findAll({
      where: whereClause,
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
      raw: false,
    });

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
    const totalIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);

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
      productMap[productName].income += parseFloat(sale.totalAmount);
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
      branchMap[branchName].income += parseFloat(sale.totalAmount);
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
    const whereClause = {
      productId,
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      whereClause.saleDate = {};
      if (startDate) {
        whereClause.saleDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.saleDate[Op.lte] = end;
      }
    }

    const sales = await Sale.findAll({
      where: whereClause,
      include: [{ model: Branch, as: 'branch' }],
      raw: false,
    });

    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);

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
    const whereClause = {
      branchId,
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      whereClause.saleDate = {};
      if (startDate) {
        whereClause.saleDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.saleDate[Op.lte] = end;
      }
    }

    const sales = await Sale.findAll({
      where: whereClause,
      include: [{ model: Product, as: 'product' }],
      raw: false,
    });

    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);

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
