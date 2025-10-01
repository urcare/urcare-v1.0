# PhonePe SDK Integration

A comprehensive PhonePe payment gateway integration using the official Node.js SDK (`phonepe-pg-sdk-node`).

## Features

- ✅ **Official SDK Integration**: Uses PhonePe's official Node.js SDK
- ✅ **Sandbox & Production Ready**: Supports both sandbox and production environments
- ✅ **Supabase Edge Function Compatible**: Works with Supabase Edge Functions
- ✅ **Express.js Server**: Ready-to-use Express.js backend
- ✅ **Comprehensive Error Handling**: Detailed error logging and handling
- ✅ **Payment Status Checking**: Real-time payment status verification
- ✅ **Callback Verification**: Secure callback verification

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

## Configuration

Update `.env` file with your PhonePe credentials:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
PHONEPE_SALT_INDEX=1

# Environment (sandbox or production)
PHONEPE_ENVIRONMENT=sandbox

# Frontend/Backend URLs
FRONTEND_URL=http://localhost:8081
BACKEND_CALLBACK_URL=http://localhost:8081/api/phonepe/callback

# Server Configuration
PORT=3000
```

## Usage

### 1. Express.js Server

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

**Available Endpoints:**

- `GET /health` - Health check
- `POST /api/phonepe/create-order` - Create payment order
- `GET /api/phonepe/status/:transactionId` - Check payment status
- `POST /api/phonepe/callback` - PhonePe callback handler

### 2. Supabase Edge Function

Use `supabase-edge-function.js` as your Edge Function code:

```javascript
// In your Supabase Edge Function
import PhonePeService from './phonepe-service.js';

const phonepeService = new PhonePeService();

// Create payment order
const result = await phonepeService.createPaymentOrder({
  orderId: 'ORDER_123',
  amount: 100, // ₹1 in paise
  userId: 'user_123',
  planSlug: 'basic',
  billingCycle: 'annual'
});
```

### 3. Direct SDK Usage

```javascript
import PhonePeService from './phonepe-service.js';

const phonepeService = new PhonePeService();

// Create payment order
const paymentResult = await phonepeService.createPaymentOrder({
  orderId: 'ORDER_123',
  amount: 100,
  userId: 'user_123'
});

// Check payment status
const statusResult = await phonepeService.checkPaymentStatus('ORDER_123');

// Verify callback
const callbackResult = await phonepeService.verifyPaymentCallback(callbackData);
```

## API Reference

### PhonePeService Class

#### `createPaymentOrder(params)`

Creates a new payment order.

**Parameters:**
- `orderId` (string): Unique order identifier
- `amount` (number): Amount in paise
- `userId` (string): User identifier
- `planSlug` (string, optional): Plan slug (default: 'basic')
- `billingCycle` (string, optional): Billing cycle (default: 'annual')

**Returns:**
```javascript
{
  success: true,
  redirectUrl: "https://mercury.phonepe.com/...",
  orderId: "ORDER_123",
  transactionId: "ORDER_123",
  merchantId: "M23XRS3XN3QMF",
  amount: 100,
  planSlug: "basic",
  billingCycle: "annual"
}
```

#### `checkPaymentStatus(transactionId)`

Checks the status of a payment.

**Parameters:**
- `transactionId` (string): Transaction identifier

**Returns:**
```javascript
{
  success: true,
  data: {
    // PhonePe status response
  }
}
```

#### `verifyPaymentCallback(callbackData)`

Verifies a payment callback from PhonePe.

**Parameters:**
- `callbackData` (object): Callback data from PhonePe

**Returns:**
```javascript
{
  success: true,
  data: {
    // Verification response
  }
}
```

## Testing

```bash
# Run tests
npm test
```

## Error Handling

The service includes comprehensive error handling:

- Input validation
- SDK error handling
- Network error handling
- Detailed error logging

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PHONEPE_MERCHANT_ID` | PhonePe Merchant ID | `M23XRS3XN3QMF` |
| `PHONEPE_API_KEY` | PhonePe API Key | `713219fb-38d0-468d-8268-8b15955468b0` |
| `PHONEPE_SALT_INDEX` | Salt Index | `1` |
| `PHONEPE_ENVIRONMENT` | Environment (sandbox/production) | `sandbox` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:8081` |
| `BACKEND_CALLBACK_URL` | Backend Callback URL | `http://localhost:8081/api/phonepe/callback` |
| `PORT` | Server Port | `3000` |

## Integration with Existing Project

To integrate with your existing project:

1. Copy the `phonepe-service.js` file to your project
2. Install the PhonePe SDK: `npm install https://phonepe.mycloudrepo.io/public/repositories/phonepe-pg-sdk-node/releases/v2/phonepe-pg-sdk-node.tgz`
3. Import and use the service:

```javascript
import PhonePeService from './phonepe-service.js';

const phonepeService = new PhonePeService();
```

## Support

For issues and questions:
1. Check the PhonePe SDK documentation
2. Verify your credentials and environment settings
3. Check the console logs for detailed error information

## License

MIT

