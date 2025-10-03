/**
 * PhonePe Test Credentials
 * 
 * Official test credentials from PhonePe documentation:
 * MID: PHONEPEPGUAT
 * Key Index: 1
 * Key: c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
 */

export const PHONEPE_TEST_CREDENTIALS = {
  // Official PhonePe UAT credentials
  merchant: {
    mid: "PHONEPEPGUAT",
    keyIndex: "1",
    key: "c817ffaf-8471-48b5-a7e2-a27e5b7efbd3",
    baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  },

  // Test card details from official documentation
  card: {
    number: "4622943126146407",
    type: "DEBIT_CARD",
    issuer: "VISA",
    expiryMonth: 12,
    expiryYear: 2023,
    cvv: "936",
  },

  // Test UPI details
  upi: {
    vpa: "test@upi",
    targetApps: ["phonepe", "gpay", "paytm", "bhim"],
  },

  // Test Net Banking details
  netbanking: {
    username: "Test",
    password: "Test",
    bankCode: "SBI", // State Bank of India
  },

  // Test OTP for bank page
  otp: {
    bankPageOtp: "123456",
  },

  // Available test banks for Net Banking
  banks: [
    { code: "SBI", name: "State Bank of India" },
    { code: "HDFC", name: "HDFC Bank" },
    { code: "ICICI", name: "ICICI Bank" },
    { code: "AXIS", name: "Axis Bank" },
    { code: "KOTAK", name: "Kotak Mahindra Bank" },
    { code: "PNB", name: "Punjab National Bank" },
    { code: "BOI", name: "Bank of India" },
    { code: "BOB", name: "Bank of Baroda" },
    { code: "CANARA", name: "Canara Bank" },
    { code: "UNION", name: "Union Bank of India" },
  ],

  // Test amounts (in INR)
  amounts: {
    min: 1, // ₹1
    max: 100000, // ₹1,00,000
    test: [1, 10, 100, 1000, 10000], // Common test amounts
  },

  // Test scenarios
  scenarios: {
    success: {
      description: "Successful payment",
      amount: 100,
      expectedStatus: "PAYMENT_SUCCESS",
    },
    failure: {
      description: "Failed payment",
      amount: 200,
      expectedStatus: "PAYMENT_ERROR",
    },
    pending: {
      description: "Pending payment",
      amount: 300,
      expectedStatus: "PAYMENT_PENDING",
    },
  },

  // UAT Simulator URLs
  simulator: {
    baseUrl: "https://developer.phonepe.com/v1/docs/uat-simulator-1",
    testApp: "https://developer.phonepe.com/v1/docs/setting-up-test-account",
  },

  // Test merchant transaction IDs
  merchantTransactionIds: {
    success: "TXN_SUCCESS_" + Date.now(),
    failure: "TXN_FAILURE_" + Date.now(),
    pending: "TXN_PENDING_" + Date.now(),
  },

  // Test callback URLs
  callbackUrls: {
    success: "https://your-domain.com/payment/success",
    failure: "https://your-domain.com/payment/failure",
    pending: "https://your-domain.com/payment/pending",
  },

  // Test redirect URLs
  redirectUrls: {
    success: "https://your-domain.com/payment/success",
    failure: "https://your-domain.com/payment/failure",
  },

  // Test user details
  user: {
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210",
    address: {
      street: "Test Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
  },

  // Test subscription plans
  plans: {
    basic: {
      id: "basic",
      name: "Basic Plan",
      price: 99,
      currency: "INR",
      duration: "monthly",
    },
    premium: {
      id: "premium", 
      name: "Premium Plan",
      price: 299,
      currency: "INR",
      duration: "monthly",
    },
    annual: {
      id: "annual",
      name: "Annual Plan", 
      price: 2999,
      currency: "INR",
      duration: "annual",
    },
  },

  // Test payment methods
  paymentMethods: {
    upi: {
      intent: "UPI_INTENT",
      collect: "UPI_COLLECT", 
      qr: "UPI_QR",
    },
    card: {
      debit: "DEBIT_CARD",
      credit: "CREDIT_CARD",
    },
    netbanking: "NET_BANKING",
    wallet: "WALLET",
    paypage: "PAY_PAGE",
  },

  // Test device context
  deviceContext: {
    deviceOS: "WEB",
    deviceOSVersion: "Chrome/120.0.0.0",
    sdkVersion: "1.0.0",
    sdkType: "JAVASCRIPT",
  },

  // Test environment indicators
  environment: {
    isUAT: true,
    isProduction: false,
    simulatorEnabled: true,
    testMode: true,
  },
};

export default PHONEPE_TEST_CREDENTIALS;
