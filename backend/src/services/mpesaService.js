import axios from 'axios';

const BASE_URL = (process.env.MPESA_ENVIRONMENT === 'sandbox')
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke';

let accessToken = null;
let tokenExpiry = null;

// Get access token from Daraja API
export const getAccessToken = async () => {
  try {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      return accessToken;
    }

    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3599 * 1000 - 30 * 60 * 1000;

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Initiate STK Push
export const initiateStkPush = async (phoneNumber, amount, accountReference, description) => {
  try {
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[:-]/g, '')
      .split('.')[0];

    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error initiating STK push:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};

// Query STK Push status
export const queryStkStatus = async (businessShortCode, checkoutRequestID) => {
  try {
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[:-]/g, '')
      .split('.')[0];

    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error querying STK status:', error.response?.data || error.message);
    throw new Error('Failed to query M-Pesa payment status');
  }
};

export default {
  getAccessToken,
  initiateStkPush,
  queryStkStatus,
};