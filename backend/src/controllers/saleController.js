import { Sale, Stock, Product, Branch } from '../models/index.js';
import { initiateStkPush } from '../services/mpesaService.js';

// @desc    Get available products for a branch
// @route   GET /api/sales/available-products/:branchId
// @access  Private
export const getAvailableProducts = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    // Get all stock for the branch with product details
    const stock = await Stock.findAll({
      where: { branchId },
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
    });

    if (!stock || stock.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products available in this branch',
      });
    }

    // Format response
    const products = stock.map((s) => ({
      stockId: s.id,
      productId: s.product.id,
      productName: s.product.name,
      price: s.product.price,
      availableQuantity: s.quantity,
      branch: s.branch.name,
    }));

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate M-Pesa payment for a purchase
// @route   POST /api/sales/initiate-payment
// @access  Private
export const initiatePayment = async (req, res, next) => {
  try {
    const { branchId, productId, quantity, phoneNumber } = req.body;

    // Validation
    if (!branchId || !productId || !quantity || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check stock availability
    const stock = await Stock.findOne({
      where: {
        branchId,
        productId,
      },
      include: [{ model: Product, as: 'product' }],
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Product not available in this branch',
      });
    }

    if (stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${stock.quantity}`,
      });
    }

    // Calculate total amount
    const totalAmount = stock.product.price * quantity;

    // Create pending sale record
    const sale = await Sale.create({
      customerId: req.user.id,
      branchId,
      productId,
      quantity,
      unitPrice: stock.product.price,
      totalAmount,
      paymentStatus: 'pending',
      paymentMethod: 'mpesa',
    });

    // Initiate M-Pesa STK Push
    try {
      const mpesaResponse = await initiateStkPush(
        phoneNumber,
        totalAmount,
        `SALE-${sale.id}`,
        `Purchase of ${quantity} ${stock.product.name}`
      );

      // Update sale with M-Pesa response data
      sale.mpesaTransactionId = mpesaResponse.CheckoutRequestID;
      await sale.save();

      res.status(200).json({
        success: true,
        message: 'M-Pesa prompt sent to your phone',
        saleId: sale.id,
        checkoutRequestID: mpesaResponse.CheckoutRequestID,
        totalAmount,
      });
    } catch (mpesaError) {
      // Delete the sale if M-Pesa fails
      await sale.destroy();
      throw mpesaError;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm M-Pesa payment and complete purchase
// @route   POST /api/sales/confirm-payment
// @access  Private
export const confirmPayment = async (req, res, next) => {
  try {
    const { saleId, mpesaReceiptNumber } = req.body;

    if (!saleId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sale ID',
      });
    }

    // Find the sale
    const sale = await Sale.findByPk(saleId, {
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    // Check if already completed
    if (sale.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this sale',
      });
    }

    // Check stock availability again
    const stock = await Stock.findOne({
      where: {
        branchId: sale.branchId,
        productId: sale.productId,
      },
    });

    if (!stock || stock.quantity < sale.quantity) {
      // Cancel the sale
      sale.paymentStatus = 'failed';
      await sale.save();

      return res.status(400).json({
        success: false,
        message: 'Insufficient stock to complete this sale',
      });
    }

    // Update payment status
    sale.paymentStatus = 'completed';
    if (mpesaReceiptNumber) {
      sale.mpesaReceiptNumber = mpesaReceiptNumber;
    }
    await sale.save();

    // Deduct from stock
    stock.quantity -= sale.quantity;
    stock.lastRestocked = new Date();
    await stock.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and purchase completed',
      sale: {
        id: sale.id,
        product: sale.product.name,
        quantity: sale.quantity,
        totalAmount: sale.totalAmount,
        branch: sale.branch.name,
        mpesaReceiptNumber: sale.mpesaReceiptNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer purchase history
// @route   GET /api/sales/my-purchases
// @access  Private
export const getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Sale.findAll({
      where: {
        customerId: req.user.id,
        paymentStatus: 'completed',
      },
      include: [
        { model: Product, as: 'product' },
        { model: Branch, as: 'branch' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    M-Pesa callback (for async confirmations)
// @route   POST /api/sales/mpesa-callback
// @access  Public
export const mpesaCallback = async (req, res, next) => {
  try {
    // M-Pesa will send callback data here
    const { Body } = req.body;

    if (!Body || !Body.stkCallback) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data',
      });
    }

    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    if (ResultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];

      // Extract amount and receipt number from callback
      const amountItem = callbackMetadata.find((item) => item.Name === 'Amount');
      const receiptItem = callbackMetadata.find((item) => item.Name === 'MpesaReceiptNumber');
      const phoneItem = callbackMetadata.find((item) => item.Name === 'PhoneNumber');

      // Find and update the sale
      const sale = await Sale.findOne({ where: { mpesaTransactionId: CheckoutRequestID } });

      if (sale) {
        sale.paymentStatus = 'completed';
        if (receiptItem) {
          sale.mpesaReceiptNumber = receiptItem.Value;
        }
        await sale.save();

        // Deduct from stock
        const stock = await Stock.findOne({
          where: {
            branchId: sale.branchId,
            productId: sale.productId,
          },
        });

        if (stock) {
          stock.quantity -= sale.quantity;
          await stock.save();
        }
      }
    } else {
      // Payment failed
      const sale = await Sale.findOne({ where: { mpesaTransactionId: CheckoutRequestID } });
      if (sale) {
        sale.paymentStatus = 'failed';
        await sale.save();
      }
    }

    // Acknowledge callback
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Received',
    });
  } catch (error) {
    console.error('Error in M-Pesa callback:', error);
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Received',
    });
  }
};
