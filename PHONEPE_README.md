# PhonePe Integration for URCare

This directory contains all the necessary files for integrating PhonePe payment gateway with the URCare subscription system.

## 📁 File Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts                          # CORS headers utility
│   ├── phonepe-payment-initiate/
│   │   └── index.ts                         # Payment initiation function
│   ├── phonepe-payment-callback/
│   │   └── index.ts                         # Payment callback handler
│   ├── phonepe-payment-status/
│   │   └── index.ts                         # Payment status checker
│   ├── phonepe-refund/
│   │   └── index.ts                         # Refund processor
│   ├── phonepe-refund-callback/
│   │   └── index.ts                         # Refund callback handler
│   ├── phonepe-vpa-validate/
│   │   └── index.ts                         # UPI VPA validator
│   └── phonepe-payment-options/
│       └── index.ts                         # Payment options retriever
└── migrations/
    └── 025_create_phonepe_functions.sql     # Database functions migration

src/
├── services/
│   └── phonepeService.ts                    # Frontend service class
├── components/
│   └── PhonePePaymentForm.tsx              # React payment form component
└── tests/
    └── phonepeIntegration.test.ts           # Integration tests

deploy-phonepe-functions.sh                  # Linux/Mac deployment script
deploy-phonepe-functions.ps1                 # Windows PowerShell deployment script
PHONEPE_INTEGRATION_GUIDE.md                 # Comprehensive integration guide
```

## 🚀 Quick Start

### 1. Deploy Functions

**For Windows:**

```powershell
.\deploy-phonepe-functions.ps1
```

**For Linux/Mac:**

```bash
./deploy-phonepe-functions.sh
```

### 2. Set Environment Variables

In your Supabase dashboard, add these environment variables:

```bash
PHONEPE_MERCHANT_ID=PHONEPEPGUAT
PHONEPE_KEY_INDEX=1
PHONEPE_SALT_KEY=c817ffaf-8471-48b5-a7e2-a27e5b7efbd3
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Update Frontend Environment

Create/update `.env.local`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FRONTEND_URL=http://localhost:3000
```

## 💳 Payment Flow

1. **User selects plan** → Frontend calls `PhonePeService.initiatePayment()`
2. **Payment initiated** → User redirected to PhonePe payment page
3. **Payment completed** → PhonePe calls callback function
4. **Subscription created** → User gets access to premium features

## 🔧 Usage Examples

### Basic Payment Initiation

```typescript
import { PhonePeService } from "./services/phonepeService";

const payment = await PhonePeService.initiatePayment({
  user_id: "user-uuid",
  plan_id: "plan-uuid",
  billing_cycle: "monthly",
  amount: 99.0,
  payment_method: "card",
});

// Redirect user to payment URL
window.location.href = payment.payment_url;
```

### VPA Validation

```typescript
const validation = await PhonePeService.validateVPA({
  vpa: "user@paytm",
});

if (validation.valid) {
  console.log("VPA is valid");
}
```

### Payment Status Check

```typescript
const status = await PhonePeService.checkPaymentStatus({
  merchant_transaction_id: "TXN_1234567890_abc123",
});

console.log("Payment status:", status.payment.status);
```

### Refund Processing

```typescript
const refund = await PhonePeService.processRefund({
  payment_id: "payment-uuid",
  refund_amount: 99.0,
  reason: "Customer requested refund",
});
```

## 🧪 Testing

### Test Credentials

**PhonePe Test Credentials:**

- MID: `PHONEPEPGUAT`
- Key Index: `1`
- Key: `c817ffaf-8471-48b5-a7e2-a27e5b7efbd3`

**Test Card Details:**

- Card Number: `4622943126146407`
- Card Type: `DEBIT_CARD`
- Card Issuer: `VISA`
- Expiry Month: `12`
- Expiry Year: `2023`
- CVV: `936`
- Bank Page OTP: `123456`

**Test Netbanking:**

- Username: `Test`
- Password: `Test`

### Running Tests

```bash
npm test phonepeIntegration.test.ts
```

## 📊 Database Functions

The integration includes several database functions:

- `create_phonepe_payment()` - Creates payment records
- `update_payment_status()` - Updates payment status
- `create_or_update_subscription()` - Manages subscriptions
- `cancel_subscription()` - Cancels subscriptions
- `get_user_payment_history()` - Retrieves payment history
- `get_subscription_analytics()` - Gets subscription analytics
- `is_payment_refundable()` - Checks refund eligibility

## 🔒 Security Features

- **Checksum verification** for all PhonePe communications
- **Row Level Security (RLS)** on all database tables
- **Input validation** and sanitization
- **CORS protection** with proper headers
- **Environment variable** configuration

## 📱 Supported Payment Methods

- **Credit/Debit Cards** - Visa, Mastercard, RuPay
- **UPI** - All major UPI apps (PhonePe, Google Pay, Paytm, etc.)
- **Net Banking** - 100+ banks
- **Digital Wallets** - PhonePe Wallet, Paytm Wallet, etc.

## 🐛 Troubleshooting

### Common Issues

1. **Payment initiation fails**

   - Check environment variables
   - Verify PhonePe credentials
   - Check network connectivity

2. **Callback not received**

   - Verify callback URL is accessible
   - Check PhonePe webhook configuration
   - Review server logs

3. **VPA validation fails**
   - Check VPA format
   - Verify PhonePe API status
   - Review validation logic

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=phonepe:*
```

## 📞 Support

- **PhonePe Documentation:** https://developer.phonepe.com/
- **UAT Simulator:** https://developer.phonepe.com/v1/docs/uat-simulator-1
- **Test Account Setup:** https://developer.phonepe.com/v1/docs/setting-up-test-account

## 📝 License

This integration is part of the URCare project and follows the same license terms.

## 🔄 Updates

For updates and new features, check the `PHONEPE_INTEGRATION_GUIDE.md` file for the latest documentation.

---

**Note:** This integration is configured for PhonePe's UAT (sandbox) environment. Update credentials and URLs for production use.
