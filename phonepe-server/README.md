# PhonePe Payment Server

Production-ready server for PhonePe payment integration with QR code support.

## Features

- ✅ Payment order creation
- ✅ Webhook verification with signature validation
- ✅ QR code payment support
- ✅ Subscription management
- ✅ Admin controls
- ✅ Rate limiting
- ✅ Error handling
- ✅ Both Node.js and Python implementations

## Quick Start

### Node.js Server

```bash
cd phonepe-server
npm install
npm start
```

### Python Server

```bash
cd phonepe-server
pip install -r requirements.txt
python server.py
```

## Environment Variables

```env
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
WEBHOOK_SECRET=your_webhook_secret
BASE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## API Endpoints

### Payment Creation
```http
POST /api/phonepe/create
Content-Type: application/json

{
  "amount": 299,
  "planName": "premium",
  "billingCycle": "monthly",
  "userId": "user123"
}
```

### Webhook (PhonePe calls this)
```http
POST /api/phonepe/webhook
Content-Type: application/json
X-VERIFY: checksum###salt_index

{
  "response": "base64_encoded_payload"
}
```

### Payment Status
```http
GET /api/phonepe/status/{merchantTransactionId}
```

### Admin Endpoints
```http
GET /api/admin/subscriptions
POST /api/admin/subscriptions/{userId}/activate
GET /api/subscriptions/{userId}
```

## PhonePe Setup

1. **Register with PhonePe**
   - Create merchant account
   - Get sandbox credentials
   - Configure webhook URLs

2. **Sandbox Testing**
   - Use test credentials
   - Test payment flows
   - Verify webhook calls

3. **Production Setup**
   - Switch to production credentials
   - Update webhook URLs
   - Test with real payments

## Webhook Configuration

Set webhook URL in PhonePe dashboard:
```
https://yourdomain.com/api/phonepe/webhook
```

## Security

- ✅ Signature verification for webhooks
- ✅ Rate limiting on all endpoints
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration

## Testing

### Manual Testing
1. Start server
2. Create payment order
3. Simulate webhook call
4. Verify subscription activation

### Automated Testing
```bash
npm test  # Node.js
pytest    # Python
```

## Deployment

### Vercel (Node.js)
```bash
vercel --prod
```

### Heroku (Python)
```bash
git push heroku main
```

### Docker
```bash
docker build -t phonepe-server .
docker run -p 3001:3001 phonepe-server
```

## Monitoring

- Health check: `GET /health`
- Performance metrics
- Error logging
- Payment tracking

## Support

For issues:
1. Check environment variables
2. Verify PhonePe credentials
3. Check webhook configuration
4. Review server logs




