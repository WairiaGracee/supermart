// backend/src/controllers/saleController.js

import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
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

// Initiate M-Pesa payment
export const initiatePayment = async (req, res) => {
  try {
    console.log('\n🔵 INITIATING PAYMENT');

    const { branchId, productId, quantity, phoneNumber } = req.body;

    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated - please login first'
      });
    }

    const userId = req.user.id;

    // Validate inputs
    if (!branchId || !productId || !quantity || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing: branchId, productId, quantity, or phoneNumber'
      });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    const stock = await Stock.findOne({ branch: branchId, product: productId });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${stock?.quantity || 0}`
      });
    }

    // Calculate total
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phoneNumber.toString().replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    }

    console.log('📱 Phone:', formattedPhone);
    console.log('💰 Amount:', totalAmount);

    // Create sale record first
    const sale = new Sale({
      customer: userId,
      product: productId,
      branch: branchId,
      quantity: quantity,
      unitPrice: unitPrice,
      totalAmount: totalAmount,
      phoneNumber: formattedPhone,
      paymentStatus: 'pending'
    });
    const savedSale = await sale.save();

    // Try to initiate M-Pesa STK Push
    try {
      console.log('📲 Sending STK Push...');
      const stkResponse = await initiateStkPush(
        formattedPhone,
        totalAmount,
        `SUPERMART-${savedSale._id.toString().slice(-6).toUpperCase()}`,
        `Payment for ${quantity}x ${product.name}`
      );

      console.log('✅ STK Push Response:', stkResponse);

      // Update sale with checkout request ID
      savedSale.checkoutRequestID = stkResponse.CheckoutRequestID;
      await savedSale.save();

      res.json({
        success: true,
        message: 'M-Pesa prompt sent to your phone. Enter your PIN to complete payment.',
        data: {
          saleId: savedSale._id,
          checkoutRequestID: stkResponse.CheckoutRequestID,
          totalAmount: totalAmount
        }
      });

    } catch (mpesaError) {
      console.error('❌ M-Pesa Error:', mpesaError.message);

      // If M-Pesa fails, still return the sale ID so user can retry
      // Mark as pending for manual confirmation
      res.json({
        success: true,
        message: 'Payment created. If you did not receive a prompt, please try again or pay manually.',
        data: {
          saleId: savedSale._id,
          checkoutRequestID: `pending-${savedSale._id}`,
          totalAmount: totalAmount,
          mpesaError: mpesaError.message
        }
      });
    }

  } catch (error) {
    console.error('❌ ERROR IN PAYMENT:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Confirm payment (manual or callback)
export const confirmPayment = async (req, res) => {
  try {
    const { saleId, mpesaReceiptNumber } = req.body;

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

    // Update stock (reduce quantity)
    const stock = await Stock.findOne({ branch: sale.branch, product: sale.product });
    if (stock) {
      stock.quantity -= sale.quantity;
      await stock.save();
    }

    // Update sale status
    sale.paymentStatus = 'completed';
    sale.paymentDate = new Date();
    if (mpesaReceiptNumber) {
      sale.mpesaReceiptNumber = mpesaReceiptNumber;
    }
    await sale.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully!',
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

// Get user's purchases
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

// M-Pesa callback handler
export const mpesaCallback = async (req, res) => {
  try {
    console.log('\n📥 M-PESA CALLBACK RECEIVED');
    console.log(JSON.stringify(req.body, null, 2));

    const { Body } = req.body;

    if (!Body || !Body.stkCallback) {
      return res.json({ success: true, message: 'Callback acknowledged' });
    }

    const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;

    // Find the sale by checkout request ID
    const sale = await Sale.findOne({ checkoutRequestID: CheckoutRequestID });

    if (!sale) {
      console.log('Sale not found for CheckoutRequestID:', CheckoutRequestID);
      return res.json({ success: true, message: 'Sale not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const receiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;

      // Update stock
      const stock = await Stock.findOne({ branch: sale.branch, product: sale.product });
      if (stock) {
        stock.quantity -= sale.quantity;
        await stock.save();
      }

      // Update sale
      sale.paymentStatus = 'completed';
      sale.mpesaReceiptNumber = receiptNumber;
      sale.paymentDate = new Date();
      await sale.save();

      console.log('✅ Payment completed:', receiptNumber);
    } else {
      // Payment failed
      sale.paymentStatus = 'failed';
      await sale.save();
      console.log('❌ Payment failed:', ResultDesc);
    }

    res.json({ success: true, message: 'Callback processed' });

  } catch (error) {
    console.error('Callback error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
