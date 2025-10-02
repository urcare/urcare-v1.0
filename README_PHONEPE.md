# PhonePe Payment Integration - UrCare

This document provides complete instructions for implementing and deploying the PhonePe payment integration for UrCare.

## 🔐 Security Warning

**IMPORTANT**: The provided credentials are production credentials. After testing, please:
1. Rotate the API keys in PhonePe merchant console
2. Move secrets to a secure secrets manager
3. Never commit these credentials to version control

## 📋 Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=production
BUSINESS_NAME=UrCare org
PAYMENT_AMOUNT_IN_PAISE=100
```

## 🚀 Deployment Steps

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add PHONEPE_MERCHANT_ID
vercel env add PHONEPE_API_KEY
vercel env add PHONEPE_SALT_INDEX
vercel env add PHONEPE_ENVIRONMENT
vercel env add BUSINESS_NAME
vercel env add PAYMENT_AMOUNT_IN_PAISE
```

### 2. Configure PhonePe Merchant Console

1. Login to PhonePe Merchant Console
2. Add these URLs:
   - **Return URL**: `https://your-domain.vercel.app/api/phonepe/callback`
   - **Webhook URL**: `https://your-domain.vercel.app/api/phonepe/notify`
3. Enable production mode
4. Whitelist your domain

## 🏗️ Architecture

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/paycheck` | POST | Create PhonePe transaction |
| `/api/phonepe/verify` | GET | Verify transaction status |
| `/api/phonepe/notify` | POST | PhonePe webhook notifications |
| `/api/phonepe/callback` | POST | Return URL after payment |

### Frontend Pages

| Page | Purpose |
|------|---------|
| `/pay` | Payment UI with options and timer |

## 🔧 Implementation Details

### PhonePe Signature Generation

```typescript
function generatePhonePeSignature(payload: string, salt: string): string {
  const hash = crypto
    .createHash('sha256')
    .update(payload + salt)
    .digest('hex');
  return hash + '###' + PHONEPE_SALT_INDEX;
}
```

### Transaction Flow

1. **Initiate Payment**: User clicks "PAY ₹1" button
2. **Create Transaction**: Frontend calls `/api/paycheck`
3. **PhonePe Redirect**: User redirected to PhonePe payment page
4. **Payment Processing**: User completes payment on PhonePe
5. **Webhook Notification**: PhonePe calls `/api/phonepe/notify`
6. **Status Verification**: Frontend polls `/api/phonepe/verify`
7. **Success/Failure**: User sees final result

### Order ID Format

```
urcare_<timestamp>_<random4>
Example: urcare_1703123456789_a1b2
```

## 🧪 Testing

### Manual Testing Steps

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables** in Vercel dashboard

3. **Test Payment Flow**:
   - Visit `https://your-domain.vercel.app/pay`
   - Click "PAY ₹1" button
   - Complete payment on PhonePe
   - Verify success message

4. **Test API Endpoints**:
   ```bash
   # Create transaction
   curl -X POST https://your-domain.vercel.app/api/paycheck \
     -H "Content-Type: application/json" \
     -d '{"amountPaise": 100}'

   # Verify transaction
   curl https://your-domain.vercel.app/api/phonepe/verify?orderId=urcare_1234567890_abcd
   ```

### Expected JSON Responses

#### POST /api/paycheck
```json
{
  "success": true,
  "redirectUrl": "https://mercury-t2.phonepe.com/transact/...",
  "orderId": "urcare_1703123456789_a1b2",
  "phonepeTxnId": "T1234567890"
}
```

#### GET /api/phonepe/verify
```json
{
  "success": true,
  "status": "SUCCESS",
  "orderId": "urcare_1703123456789_a1b2",
  "phonepeTxnId": "T1234567890",
  "amount": 100
}
```

## 🔒 Security Features

- **HMAC Signature Verification**: All webhook calls verified
- **CORS Protection**: Restricted to production domain
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Comprehensive error handling and logging
- **Timeout Protection**: 2-minute payment timeout

## 📱 UI Features

- **Payment Options**: UPI, Cards, Digital Wallets
- **Real-time Timer**: 2-minute countdown
- **Status Updates**: Live payment status polling
- **Responsive Design**: Mobile-optimized interface
- **Error Handling**: Clear error messages and retry options

## 🐛 Troubleshooting

### Common Issues

1. **403/401 Errors**: Check PhonePe merchant console configuration
2. **Signature Verification Failed**: Verify API key and salt index
3. **Webhook Not Received**: Check PhonePe webhook URL configuration
4. **Payment Timeout**: Check network connectivity and PhonePe status

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📊 Monitoring

### Logs to Monitor

- Transaction creation success/failure
- Webhook signature verification
- Payment status updates
- Error rates and types

### Key Metrics

- Payment success rate
- Average processing time
- Webhook delivery success rate
- Error frequency by type

## 🔄 Production Considerations

### Database Integration

Replace in-memory store with:
- **Redis**: For session storage
- **PostgreSQL**: For persistent order storage
- **MongoDB**: For document-based storage

### Scaling

- Use connection pooling for database
- Implement rate limiting
- Add caching for frequently accessed data
- Monitor API response times

### Security Enhancements

- Implement IP whitelisting
- Add request rate limiting
- Use encrypted storage for sensitive data
- Regular security audits

## 📞 Support

For issues related to:
- **PhonePe Integration**: Contact PhonePe support
- **UrCare Application**: Check application logs
- **Deployment**: Check Vercel deployment logs

## 📄 License

This implementation is part of the UrCare project and follows the same licensing terms.

---

**Note**: This implementation uses production PhonePe credentials. Ensure proper security measures are in place before going live.