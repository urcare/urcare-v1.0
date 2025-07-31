export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  acquirer_data: Record<string, any>;
  created_at: number;
}

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  userId: string;
}

export interface SubscriptionPaymentData {
  userId: string;
  planSlug: string;
  billingCycle: 'monthly' | 'annual';
  isFirstTime: boolean;
  amount: number;
  currency?: string;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: RazorpayPayment;
    order?: RazorpayOrder;
    subscription?: any;
    refund?: any;
  };
  created_at: number;
}

export interface RazorpayConfig {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

// International Payment Support Types
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  smallestUnit: number;
  isSupported: boolean;
}

export interface RegionalPaymentMethod {
  country: string;
  currency: string;
  methods: string[];
  preferredMethod?: string;
}

export interface InternationalPaymentConfig {
  supportedCurrencies: CurrencyInfo[];
  regionalMethods: RegionalPaymentMethod[];
  defaultCurrency: string;
  exchangeRateAPI?: string;
}

export interface PaymentMethodInfo {
  method: string;
  name: string;
  description: string;
  isInternational: boolean;
  supportedCurrencies: string[];
  processingTime: string;
  fees?: {
    percentage?: number;
    fixed?: number;
  };
}

// Enhanced payment data with international support
export interface InternationalPaymentData extends SubscriptionPaymentData {
  userCountry?: string;
  userCurrency?: string;
  exchangeRate?: number;
  originalAmount?: number;
  originalCurrency?: string;
  paymentMethods?: PaymentMethodInfo[];
} 