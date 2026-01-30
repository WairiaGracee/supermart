import { Stock, Branch, Product } from '../models/index.js';

// @desc    Get all branches
// @route   GET /api/admin/branches
// @access  Private/Admin
export const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();

    res.status(200).json({
      success: true,
      count: branches.length,
      branches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory for a specific branch
// @route   GET /api/admin/inventory/:branchId
// @access  Private/Admin
export const getBranchInventory = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    const inventory = await Stock.findAll({
      where: { branchId },
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
    });

    res.status(200).json({
      success: true,
      branch: branch.name,
      inventory: inventory.map((item) => ({
        stockId: item.id,
        productName: item.product.name,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        lastRestocked: item.lastRestocked,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inventory across all branches
// @route   GET /api/admin/inventory
// @access  Private/Admin
export const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Stock.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
    });

    // Group by branch
    const grouped = {};
    inventory.forEach((item) => {
      if (!grouped[item.branch.id]) {
        grouped[item.branch.id] = {
          branchId: item.branch.id,
          branchName: item.branch.name,
          items: [],
          totalItems: 0,
        };
      }
      grouped[item.branch.id].items.push({
        stockId: item.id,
        productName: item.product.name,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        lastRestocked: item.lastRestocked,
      });
      grouped[item.branch.id].totalItems += item.quantity;
    });

    res.status(200).json({
      success: true,
      inventory: Object.values(grouped),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize stock for a branch
// @route   POST /api/admin/initialize-stock
// @access  Private/Admin
export const initializeStock = async (req, res, next) => {
  try {
    const { branchId, stocks } = req.body;

    if (!branchId || !stocks || !Array.isArray(stocks)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide branch ID and stocks array',
      });
    }

    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    const createdStocks = [];

    for (const { productId, quantity } of stocks) {
      // Check if stock already exists
      let stock = await Stock.findOne({
        where: {
          branchId,
          productId,
        },
      });

      if (stock) {
        // Update existing stock
        stock.quantity = quantity;
        stock.lastRestocked = new Date();
        await stock.save();
      } else {
        // Create new stock
        stock = await Stock.create({
          branchId,
          productId,
          quantity,
          lastRestocked: new Date(),
        });
      }

      createdStocks.push(stock);
    }

    res.status(201).json({
      success: true,
      message: 'Stock initialized successfully',
      stocks: createdStocks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock a branch (from headquarters)
// @route   POST /api/admin/restock
// @access  Private/Admin
export const restock = async (req, res, next) => {
  try {
    const { branchId, productId, quantity } = req.body;

    if (!branchId || !productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide branch ID, product ID, and quantity',
      });
    }

    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find or create stock record
    let stock = await Stock.findOne({
      where: {
        branchId,
        productId,
      },
    });

    if (!stock) {
      stock = await Stock.create({
        branchId,
        productId,
        quantity,
        lastRestocked: new Date(),
      });
    } else {
      stock.quantity += quantity;
      stock.lastRestocked = new Date();
      await stock.save();
    }

    res.status(200).json({
      success: true,
      message: `${branch.name} restocked with ${quantity} ${product.name}(s)`,
      stock: {
        branchName: branch.name,
        productName: product.name,
        newQuantity: stock.quantity,
        lastRestocked: stock.lastRestocked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock (set quantity directly)
// @route   PUT /api/admin/stock/:stockId
// @access  Private/Admin
export const updateStock = async (req, res, next) => {
  try {
    const { stockId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity',
      });
    }

    const stock = await Stock.findByPk(stockId, {
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }

    stock.quantity = quantity;
    stock.lastRestocked = new Date();
    await stock.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      stock: {
        branchName: stock.branch.name,
        productName: stock.product.name,
        quantity: stock.quantity,
        lastRestocked: stock.lastRestocked,
      },
    });
  } catch (error) {
    next(error);
  }
};
