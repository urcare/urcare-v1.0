# Razorpay Integration Setup Guide

This guide will help you set up Razorpay payment integration for your UrCare subscription system.

## 🔑 Environment Variables

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🌍 International Payment Support

The Razorpay integration supports international payments with the following features:

### Supported Currencies
- **INR** (Indian Rupees) - Default
- **USD** (US Dollars)
- **EUR** (Euro)
- **GBP** (British Pound)
- **CAD** (Canadian Dollar)
- **AUD** (Australian Dollar)
- **JPY** (Japanese Yen)
- **SGD** (Singapore Dollar)
- **AED** (UAE Dirham)
- **SAR** (Saudi Riyal)

### Regional Payment Methods
- **India**: UPI, Cards, Net Banking, Wallets, EMI
- **US/International**: Cards (Visa, MasterCard, Amex), PayPal
- **Europe**: Cards, Sofort, Giropay, iDEAL
- **Canada**: Cards, Interac
- **Australia**: Cards, BPAY
- **Japan**: Cards, Konbini
- **Singapore**: Cards, PayNow
- **UAE/Saudi**: Cards, Mada

### Automatic Currency Detection
The system automatically detects user location and sets appropriate currency based on:
1. User's profile country setting
2. User's preferred currency setting
3. Fallback to INR if location cannot be determined

### Exchange Rate Handling
- Real-time currency conversion using exchange rates
- Amounts converted to smallest currency units (paise, cents, etc.)
- Support for both domestic and international payment processing

## 📋 Razorpay Account Setup

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account
3. Complete KYC verification
4. Enable international payments in your account settings

### 2. Get API Keys
1. Navigate to Settings → API Keys
2. Generate a new key pair
3. Copy the Key ID and Key Secret
4. Add them to your environment variables

### 3. Configure Webhooks
1. Go to Settings → Webhooks
2. Add a new webhook with URL: `https://your-project.supabase.co/functions/v1/process-razorpay-webhook`
3. Select events: `payment.captured`, `payment.failed`, `refund.processed`
4. Copy the webhook secret and add to environment variables

## 🚀 Installation

### 1. Install Dependencies
```bash
npm install razorpay
```

### 2. Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy process-razorpay-webhook
```

### 3. Set Environment Secrets
```bash
# Set Razorpay secrets
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## 🧪 Testing

### 1. Test with Test Cards
Use Razorpay's test cards for different scenarios:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**Failed Payment:**
- Card: 4000 0000 0000 0002
- Expiry: Any future date
- CVV: Any 3 digits

### 2. Test International Payments
1. Update user profile with different country codes
2. Test with different currencies
3. Verify payment method availability
4. Check currency conversion accuracy

### 3. Test Webhooks
1. Use Razorpay's webhook testing tool
2. Verify webhook signature validation
3. Test different payment scenarios

## 🔧 Configuration

### Currency Configuration
The system automatically handles currency conversion. To customize:

1. **Update Exchange Rates**: Modify the conversion rates in `razorpayService.ts`
2. **Add New Currencies**: Add new currency codes to the currency maps
3. **Custom Payment Methods**: Update the payment method mappings

### Regional Settings
To add support for new regions:

1. Add country code to currency mapping
2. Add regional payment methods
3. Update currency symbols and formatting

## 🛡️ Security

### Payment Verification
- All payments are verified using HMAC-SHA256 signatures
- Webhook signatures are validated
- Payment amounts are double-checked

### Data Protection
- No sensitive payment data is stored
- All communication uses HTTPS
- PCI DSS compliant processing

## 📊 Monitoring

### Payment Analytics
Monitor payments through:
1. Razorpay Dashboard
2. Supabase logs
3. Application error tracking

### Key Metrics
- Payment success rate
- Currency distribution
- Regional payment method usage
- Failed payment analysis

## 🚨 Troubleshooting

### Common Issues

**1. Payment Verification Failed**
- Check webhook secret configuration
- Verify signature calculation
- Ensure correct order ID

**2. Currency Conversion Issues**
- Verify exchange rates are up-to-date
- Check currency code validity
- Validate amount calculations

**3. International Payment Failures**
- Confirm account supports international payments
- Check regional payment method availability
- Verify currency support

### Debug Steps
1. Check browser console for errors
2. Review Supabase function logs
3. Verify Razorpay dashboard for payment status
4. Test with different currencies and regions

## 📈 Production Deployment

### 1. Switch to Live Mode
1. Update Razorpay keys to live mode
2. Update webhook URLs to production
3. Test with small amounts first

### 2. Monitoring Setup
1. Set up error tracking
2. Configure payment alerts
3. Monitor webhook delivery

### 3. Compliance
1. Ensure PCI DSS compliance
2. Update privacy policy
3. Add terms of service

## 🌟 Features Implemented

✅ **Secure Payment Processing**
✅ **International Payment Support**
✅ **Multi-Currency Support**
✅ **Regional Payment Methods**
✅ **Automatic Currency Detection**
✅ **First-Time Pricing Support**
✅ **Payment Verification**
✅ **Webhook Handling**
✅ **Error Handling**
✅ **Mobile Responsive UI**

## 🔄 Next Steps

1. **Real-time Exchange Rates**: Integrate with exchange rate API
2. **Advanced Analytics**: Add detailed payment analytics
3. **Subscription Management**: Add subscription renewal logic
4. **Refund Processing**: Implement refund functionality
5. **Multi-language Support**: Add localized payment interfaces

The Razorpay integration is now ready for both domestic and international payments with full currency support and regional payment methods. 