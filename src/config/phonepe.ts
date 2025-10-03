/**
 * PhonePe Configuration
 * 
 * This file contains all PhonePe-related configuration including:
 * - Environment settings (UAT vs Production)
 * - API endpoints
 * - Test credentials
 * - Payment method configurations
 */

export interface PhonePeConfig {
  environment: "uat" | "production";
  baseUrl: string;
  merchantId: string;
  keyIndex: string;
  key: string;
  apiKey?: string;
  frontendUrl: string;
  callbackUrl: string;
  redirectUrl: string;
}

export interface TestCredentials {
  card: {
    number: string;
    type: string;
    issuer: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    bankPageOTP: string;
  };
  upi: {
    vpa: string;
    targetApps: string[];
  };
  netbanking: {
    username: string;
    password: string;
  };
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  requiresDetails: boolean;
  detailsType?: "card" | "upi" | "netbanking" | "none";
}

// Environment detection
const isProduction = import.meta.env.VITE_PHONEPE_ENVIRONMENT === "production";

// UAT Configuration - Updated with correct test credentials
const uatConfig: PhonePeConfig = {
  environment: "uat",
  baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  merchantId: "PGTESTPAYUAT",
  keyIndex: "1",
  key: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
  callbackUrl: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
  redirectUrl: `${import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"}/payment/success`,
};

// Production Configuration
const productionConfig: PhonePeConfig = {
  environment: "production",
  baseUrl: "https://api.phonepe.com/apis/pg",
  merchantId: import.meta.env.VITE_PHONEPE_MID || "",
  keyIndex: import.meta.env.VITE_PHONEPE_KEY_INDEX || "1",
  key: import.meta.env.VITE_PHONEPE_KEY || "",
  apiKey: import.meta.env.VITE_PHONEPE_API_KEY,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "",
  callbackUrl: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phonepe-payment-callback`,
  redirectUrl: `${import.meta.env.VITE_FRONTEND_URL}/payment/success`,
};

// Test credentials for UAT environment - Updated with correct PhonePe test data
export const testCredentials: TestCredentials = {
  card: {
    number: "4622943126146407",
    type: "DEBIT_CARD",
    issuer: "VISA",
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: "936",
    bankPageOTP: "123456",
  },
  upi: {
    vpa: "test@upi",
    targetApps: ["phonepe", "gpay", "paytm", "bhim"],
  },
  netbanking: {
    username: "Test",
    password: "Test",
  },
};

// Payment method configurations
export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: "PAY_PAGE",
    name: "All Payment Methods",
    description: "Cards, UPI, Net Banking, Wallets",
    icon: "💳",
    enabled: true,
    requiresDetails: false,
    detailsType: "none",
  },
  {
    id: "UPI_INTENT",
    name: "UPI Intent",
    description: "Pay with UPI apps",
    icon: "📱",
    enabled: true,
    requiresDetails: true,
    detailsType: "upi",
  },
  {
    id: "UPI_COLLECT",
    name: "UPI Collect",
    description: "Pay with UPI ID",
    icon: "🏦",
    enabled: true,
    requiresDetails: true,
    detailsType: "upi",
  },
  {
    id: "UPI_QR",
    name: "UPI QR",
    description: "Scan QR code to pay",
    icon: "📱",
    enabled: true,
    requiresDetails: false,
    detailsType: "none",
  },
  {
    id: "CARD",
    name: "Card Payment",
    description: "Credit/Debit cards",
    icon: "💳",
    enabled: true,
    requiresDetails: true,
    detailsType: "card",
  },
  {
    id: "NET_BANKING",
    name: "Net Banking",
    description: "Direct bank transfer",
    icon: "🏦",
    enabled: true,
    requiresDetails: true,
    detailsType: "netbanking",
  },
];

// Bank codes for net banking
export const bankCodes = [
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
];

// Get current configuration
export const getPhonePeConfig = (): PhonePeConfig => {
  return isProduction ? productionConfig : uatConfig;
};

// Get test credentials (only available in UAT)
export const getTestCredentials = (): TestCredentials | null => {
  return isProduction ? null : testCredentials;
};

// Get payment methods
export const getPaymentMethods = (): PaymentMethodConfig[] => {
  return paymentMethods;
};

// Get bank codes
export const getBankCodes = () => {
  return bankCodes;
};

// Environment utilities
export const isProductionEnvironment = (): boolean => {
  return isProduction;
};

export const isUATEnvironment = (): boolean => {
  return !isProduction;
};

// Validation utilities
export const validatePhonePeConfig = (config: PhonePeConfig): string[] => {
  const errors: string[] = [];

  if (!config.merchantId) {
    errors.push("Merchant ID is required");
  }

  if (!config.key) {
    errors.push("Key is required");
  }

  if (!config.baseUrl) {
    errors.push("Base URL is required");
  }

  if (config.environment === "production") {
    if (!config.apiKey) {
      errors.push("API Key is required for production environment");
    }
    if (!config.frontendUrl) {
      errors.push("Frontend URL is required for production environment");
    }
  }

  return errors;
};

// Get environment-specific settings
export const getEnvironmentSettings = () => {
  const config = getPhonePeConfig();
  const testCreds = getTestCredentials();

  return {
    config,
    testCredentials: testCreds,
    isProduction: isProductionEnvironment(),
    isUAT: isUATEnvironment(),
    validationErrors: validatePhonePeConfig(config),
  };
};

export default {
  getPhonePeConfig,
  getTestCredentials,
  getPaymentMethods,
  getBankCodes,
  isProductionEnvironment,
  isUATEnvironment,
  validatePhonePeConfig,
  getEnvironmentSettings,
};
