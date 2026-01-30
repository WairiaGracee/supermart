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
      console.log('🔄 Using cached M-Pesa token');
      return accessToken;
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();

    console.log('🔑 M-Pesa Auth Debug:');
    console.log('  Consumer Key length:', consumerKey?.length);
    console.log('  Consumer Secret length:', consumerSecret?.length);
    console.log('  Consumer Key starts with:', consumerKey?.substring(0, 10));
    console.log('  Environment:', process.env.MPESA_ENVIRONMENT);
    console.log('  Base URL:', BASE_URL);

    if (!consumerKey || !consumerSecret) {
      throw new Error('Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    console.log('  Auth header length:', auth.length);

    const url = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
    console.log('  Request URL:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    console.log('✅ M-Pesa token received');
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3599 * 1000 - 30 * 60 * 1000;

    return accessToken;
  } catch (error) {
    console.error('❌ Error getting access token:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  Message:', error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Initiate STK Push


export const initiateStkPush = async (phoneNumber, amount, accountReference, description) => {
  try {
    const token = await getAccessToken();

    // Generate timestamp in format YYYYMMDDHHmmss
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    console.log('📅 Timestamp:', timestamp);

    const shortcode = process.env.MPESA_SHORTCODE?.trim();
    const passkey = process.env.MPESA_PASSKEY?.trim();

    console.log('🏪 Shortcode:', shortcode);
    console.log('🔐 Passkey length:', passkey?.length);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    console.log('🔑 Password length:', password.length);

    const callbackUrl = process.env.MPESA_CALLBACK_URL?.trim();

    console.log('📞 Phone:', phoneNumber);
    console.log('💵 Amount:', Math.ceil(amount));
    console.log('🔗 Callback URL:', callbackUrl);

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ STK Push successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating STK push:', JSON.stringify(error.response?.data, null, 2) || error.message);
    throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment');
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
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
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