# PhonePe Payment Backend

This is the Node.js backend server that handles PhonePe payment integration for the UrCare app.

## 🔧 Configuration

The backend uses PhonePe **SANDBOX** environment for testing:

- **API URL**: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- **Merchant ID**: `M23XRS3XN3QMF`
- **Salt Key**: `713219fb-38d0-468d-8268-8b15955468b0`
- **Salt Index**: `1`

## 🚀 How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. The server will run on `http://localhost:5000`

## 📡 API Endpoints

### 1. Create Payment
**POST** `/api/phonepe/pay`

**Request Body:**
```json
{
  "orderId": "ORDER_1234567890_abc123",
  "amount": 10000,
  "userId": "user-uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://phonepe.com/payment-page-url",
  "orderId": "ORDER_1234567890_abc123"
}
```

### 2. Check Payment Status
**GET** `/api/phonepe/status/:orderId`

**Response:**
```json
{
  "success": true,
  "code": "PAYMENT_SUCCESS",
  "data": {
    "amount": 10000,
    "transactionId": "ORDER_1234567890_abc123"
  }
}
```

### 3. Payment Callback
**POST** `/api/phonepe/callback`

This endpoint receives callbacks from PhonePe after payment completion.

## 🔄 Payment Flow

1. **Frontend** sends payment request to backend
2. **Backend** creates PhonePe payment with proper checksum
3. **PhonePe** returns a redirect URL
4. **Backend** sends redirect URL to frontend
5. **Frontend** redirects user to PhonePe payment page
6. **User** completes payment
7. **PhonePe** redirects user back to frontend with status
8. **Frontend** verifies payment status via backend

## 🔐 Security Notes

- Salt Key is stored only in backend (not exposed to frontend)
- All PhonePe API calls are made server-side
- CORS is enabled to allow frontend requests

## 🐛 Common Issues

### 404 Error from PhonePe
- **Cause**: Using production API URL with sandbox credentials
- **Fix**: Ensure `PHONEPE_HOST` is set to sandbox URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`

### CORS Error
- **Cause**: Frontend trying to call PhonePe directly
- **Fix**: Always route through this backend server

## 📝 For Production

When moving to production:
1. Change `PHONEPE_HOST` to: `https://api.phonepe.com/apis/hermes`
2. Update `MERCHANT_ID`, `SALT_KEY`, and `SALT_INDEX` with production credentials
3. Update `redirectUrl` and `callbackUrl` to production URLs
4. Enable HTTPS for the backend server



