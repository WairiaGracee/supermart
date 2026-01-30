import { sequelize } from '../config/db.js';
import Branch from './Branch.js';
import Product from './Product.js';
import User from './User.js';
import Sale from './Sale.js';
import Stock from './Stock.js';

// Set up associations
User.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Branch.hasMany(User, { foreignKey: 'branchId', as: 'users' });

Sale.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
User.hasMany(Sale, { foreignKey: 'customerId', as: 'sales' });

Sale.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Branch.hasMany(Sale, { foreignKey: 'branchId', as: 'sales' });

Sale.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Sale, { foreignKey: 'productId', as: 'sales' });

Stock.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Branch.hasMany(Stock, { foreignKey: 'branchId', as: 'stocks' });

Stock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Stock, { foreignKey: 'productId', as: 'stocks' });

// Sync all models
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export {
  sequelize,
  Branch,
  Product,
  User,
  Sale,
  Stock,
  syncDatabase,
};
