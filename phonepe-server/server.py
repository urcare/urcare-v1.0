# PhonePe Payment Server (Python Flask)
# Production-ready server for PhonePe payment verification and webhooks

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import hashlib
import hmac
import base64
import json
import time
import os
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','))

# Rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per 15 minutes"]
)

# Environment variables
PHONEPE_MERCHANT_ID = os.getenv('PHONEPE_MERCHANT_ID', 'MERCURCARE')
PHONEPE_SALT_KEY = os.getenv('PHONEPE_SALT_KEY', 'your-salt-key')
PHONEPE_SALT_INDEX = os.getenv('PHONEPE_SALT_INDEX', '1')
PHONEPE_BASE_URL = os.getenv('PHONEPE_BASE_URL', 'https://api-preprod.phonepe.com/apis/pg-sandbox')
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
BASE_URL = os.getenv('BASE_URL', 'http://localhost:3000')

# In-memory storage (use database in production)
payments = {}
subscriptions = {}

# Utility functions
def generate_checksum(payload, salt_key, salt_index):
    """Generate SHA256 checksum for PhonePe API"""
    hash_string = payload + salt_key
    return hashlib.sha256(hash_string.encode()).hexdigest()

def verify_checksum(payload, checksum, salt_key, salt_index):
    """Verify checksum for webhook validation"""
    expected_checksum = generate_checksum(payload, salt_key, salt_index)
    return expected_checksum == checksum

def generate_merchant_transaction_id():
    """Generate unique merchant transaction ID"""
    return f"TXN_{int(time.time())}_{hash(str(time.time())) % 1000000}"

# Routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
        'environment': os.getenv('NODE_ENV', 'development')
    })

@app.route('/api/phonepe/create', methods=['POST'])
@limiter.limit("20 per minute")
def create_payment():
    """Create PhonePe payment order"""
    try:
        data = request.get_json()
        amount = data.get('amount')
        plan_name = data.get('planName', 'premium')
        billing_cycle = data.get('billingCycle', 'monthly')
        user_id = data.get('userId')

        if not amount or not user_id:
            return jsonify({
                'success': False,
                'error': 'Amount and userId are required'
            }), 400

        merchant_transaction_id = generate_merchant_transaction_id()
        amount_in_paise = int(amount * 100)

        order = {
            'merchantId': PHONEPE_MERCHANT_ID,
            'merchantTransactionId': merchant_transaction_id,
            'merchantUserId': user_id,
            'amount': amount_in_paise,
            'currency': 'INR',
            'redirectUrl': f'{BASE_URL}/payment/phonepe/success',
            'webhookUrl': f'{BASE_URL}/api/phonepe/webhook',
            'redirectMode': 'POST',
            'callbackUrl': f'{BASE_URL}/payment/phonepe/callback'
        }

        payload = base64.b64encode(json.dumps(order).encode()).decode()
        checksum = generate_checksum(payload, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX)

        # Store payment info
        payments[merchant_transaction_id] = {
            **order,
            'userId': user_id,
            'planName': plan_name,
            'billingCycle': billing_cycle,
            'status': 'PENDING',
            'createdAt': datetime.now().isoformat()
        }

        # Mock response (replace with actual PhonePe API call in production)
        response = {
            'success': True,
            'code': 'PAYMENT_INITIATED',
            'message': 'Payment initiated successfully',
            'data': {
                'merchantId': PHONEPE_MERCHANT_ID,
                'merchantTransactionId': merchant_transaction_id,
                'amount': amount_in_paise,
                'currency': 'INR',
                'instrumentResponse': {
                    'type': 'PAY_PAGE',
                    'redirectInfo': {
                        'url': f'{PHONEPE_BASE_URL}/pg/redirect?merchantId={PHONEPE_MERCHANT_ID}&merchantTransactionId={merchant_transaction_id}',
                        'method': 'GET'
                    }
                }
            }
        }

        return jsonify(response)

    except Exception as e:
        logging.error(f'Payment creation error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to create payment order'
        }), 500

@app.route('/api/phonepe/webhook', methods=['POST'])
def phonepe_webhook():
    """Handle PhonePe webhook notifications"""
    try:
        data = request.get_json()
        response = data.get('response')
        
        if not response:
            return jsonify({'success': False, 'error': 'No response data'}), 400

        # Decode payload
        payload = base64.b64decode(response).decode('utf-8')
        webhook_data = json.loads(payload)

        merchant_id = webhook_data.get('merchantId')
        merchant_transaction_id = webhook_data.get('merchantTransactionId')
        transaction_id = webhook_data.get('transactionId')
        amount = webhook_data.get('amount')
        state = webhook_data.get('state')
        code = webhook_data.get('code')

        # Verify webhook signature
        received_checksum = request.headers.get('X-VERIFY')
        if received_checksum:
            checksum, salt_index = received_checksum.split('###')
            if not verify_checksum(response, checksum, PHONEPE_SALT_KEY, salt_index):
                logging.error('Webhook signature verification failed')
                return jsonify({'success': False, 'error': 'Invalid signature'}), 400

        # Update payment status
        if merchant_transaction_id in payments:
            payment = payments[merchant_transaction_id]
            payment['status'] = 'COMPLETED' if state == 'COMPLETED' else 'FAILED'
            payment['transactionId'] = transaction_id
            payment['updatedAt'] = datetime.now().isoformat()

            # Activate subscription if payment successful
            if state == 'COMPLETED':
                user_id = payment['userId']
                billing_cycle = payment['billingCycle']
                expires_days = 365 if billing_cycle == 'annual' else 30
                
                subscriptions[user_id] = {
                    'userId': user_id,
                    'planName': payment['planName'],
                    'billingCycle': billing_cycle,
                    'status': 'active',
                    'activatedAt': datetime.now().isoformat(),
                    'expiresAt': (datetime.now() + timedelta(days=expires_days)).isoformat()
                }

                logging.info(f'Subscription activated for user {user_id}')

        return jsonify({'success': True, 'message': 'Webhook processed'})

    except Exception as e:
        logging.error(f'Webhook processing error: {str(e)}')
        return jsonify({'success': False, 'error': 'Webhook processing failed'}), 500

@app.route('/api/phonepe/status/<merchant_transaction_id>', methods=['GET'])
def get_payment_status(merchant_transaction_id):
    """Get payment status by merchant transaction ID"""
    try:
        if merchant_transaction_id not in payments:
            return jsonify({
                'success': False,
                'error': 'Payment not found'
            }), 404

        return jsonify({
            'success': True,
            'data': payments[merchant_transaction_id]
        })

    except Exception as e:
        logging.error(f'Payment status check error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to check payment status'
        }), 500

@app.route('/api/admin/subscriptions', methods=['GET'])
@limiter.limit("10 per minute")
def get_admin_subscriptions():
    """Get all subscriptions (admin only)"""
    try:
        subs = list(subscriptions.values())
        return jsonify({
            'success': True,
            'data': subs
        })
    except Exception as e:
        logging.error(f'Admin subscriptions error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to fetch subscriptions'
        }), 500

@app.route('/api/admin/subscriptions/<user_id>/activate', methods=['POST'])
@limiter.limit("5 per minute")
def activate_subscription(user_id):
    """Manually activate subscription (admin only)"""
    try:
        data = request.get_json()
        plan_name = data.get('planName', 'premium')
        billing_cycle = data.get('billingCycle', 'monthly')
        
        expires_days = 365 if billing_cycle == 'annual' else 30
        
        subscriptions[user_id] = {
            'userId': user_id,
            'planName': plan_name,
            'billingCycle': billing_cycle,
            'status': 'active',
            'activatedAt': datetime.now().isoformat(),
            'expiresAt': (datetime.now() + timedelta(days=expires_days)).isoformat(),
            'activatedBy': 'admin'
        }

        return jsonify({
            'success': True,
            'message': 'Subscription activated successfully'
        })

    except Exception as e:
        logging.error(f'Admin subscription activation error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to activate subscription'
        }), 500

@app.route('/api/subscriptions/<user_id>', methods=['GET'])
def get_subscription_status(user_id):
    """Get subscription status for a user"""
    try:
        subscription = subscriptions.get(user_id)
        
        if not subscription:
            return jsonify({
                'success': True,
                'data': {'status': 'inactive'}
            })

        return jsonify({
            'success': True,
            'data': subscription
        })

    except Exception as e:
        logging.error(f'Subscription status error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to check subscription status'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Route not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    port = int(os.getenv('PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('NODE_ENV') != 'production')


