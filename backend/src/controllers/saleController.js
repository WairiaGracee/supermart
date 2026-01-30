import { Sale, Stock, Product, Branch } from '../models/index.js';
import { initiateStkPush } from '../services/mpesaService.js';

// Get available products for a branch
export const getAvailableProducts = async (req, res) => {
  try {
    const { branchId } = req.params;
    const products = await Product.find();
    
    res.json({
      success: true,
      data: { products: products || [] }
    });
  } catch (error) {
    console.error('Error in getAvailableProducts:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate M-Pesa payment - SIMPLIFIED
export const initiatePayment = async (req, res) => {
  try {
    console.log('\n🔵 INITIATING PAYMENT');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from request:', req.user ? `${req.user.name} (${req.user.id})` : 'NO USER');

    const { branchId, productId, quantity, phoneNumber } = req.body;

    // Check authentication
    if (!req.user || !req.user.id) {
      console.log('❌ FAIL: No user authenticated');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated - please login first'
      });
    }

    const userId = req.user.id;

    // Validate inputs
    if (!branchId || !productId || !quantity || !phoneNumber) {
      console.log('❌ FAIL: Missing fields');
      return res.status(400).json({
        success: false,
        message: 'Missing: branchId, productId, quantity, or phoneNumber'
      });
    }

    console.log('✅ Inputs valid');

    // Get product
    console.log('Looking for product:', productId);
    const product = await Product.findById(productId);

    if (!product) {
      console.log('❌ FAIL: Product not found');
      return res.status(404).json({
        success: false,
        message: `Product ${productId} not found`
      });
    }

    console.log('✅ Product found:', product.name, 'Price:', product.price);

    // Calculate
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    console.log('Creating sale with:');
    console.log('  - customer:', userId);
    console.log('  - product:', productId);
    console.log('  - branch:', branchId);
    console.log('  - quantity:', quantity);
    console.log('  - unitPrice:', unitPrice);
    console.log('  - totalAmount:', totalAmount);
    console.log('  - phoneNumber:', phoneNumber);

    // Create and save
    const saleData = {
      customer: userId,
      product: productId,
      branch: branchId,
      quantity: quantity,
      unitPrice: unitPrice,
      totalAmount: totalAmount,
      phoneNumber: phoneNumber,
      paymentStatus: 'pending'
    };

    console.log('Creating Sale object...');
    const sale = new Sale(saleData);

    console.log('Saving to database...');
    const savedSale = await sale.save();

    console.log('✅ SUCCESS: Sale created:', savedSale.id);

    res.json({
      success: true,
      data: {
        saleId: savedSale.id,
        checkoutRequestID: `sandbox-${savedSale.id}`,
        totalAmount: totalAmount
      }
    });

  } catch (error) {
    console.error('\n❌ ERROR IN PAYMENT:');
    console.error('Message:', error.message);
    console.error('Type:', error.name);
    
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(field => {
        console.error(`  - ${field}:`, error.errors[field].message);
      });
    }
    
    console.error('Stack:', error.stack);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const { saleId } = req.body;

    if (!saleId) {
      return res.status(400).json({
        success: false,
        message: 'saleId required'
      });
    }

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    sale.paymentStatus = 'completed';
    sale.paymentDate = new Date();
    await sale.save();

    res.json({
      success: true,
      data: { sale }
    });
  } catch (error) {
    console.error('Error in confirmPayment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get purchases
export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const sales = await Sale.find({ customer: userId })
      .populate('product')
      .populate('branch')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { purchases: sales || [] }
    });
  } catch (error) {
    console.error('Error in getMyPurchases:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// M-Pesa callback
export const mpesaCallback = async (req, res) => {
  try {
    console.log('M-Pesa Callback received');
    res.json({
      success: true,
      message: 'Callback acknowledged'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
