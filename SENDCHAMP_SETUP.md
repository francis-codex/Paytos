# Sendchamp Setup Guide for paie

This guide will walk you through setting up Sendchamp for your paie SMS payments system.

## 🚀 Quick Start

### Step 1: Create Sendchamp Account

1. Visit [sendchamp.com](https://sendchamp.com)
2. Click "Get Started" or "Sign Up"
3. Choose the appropriate plan:
   - **Starter Plan**: Good for testing and small volume
   - **Business Plan**: For production use with higher volume
   - **Enterprise Plan**: For large-scale operations

### Step 2: Account Verification

1. **Email Verification**: Verify your email address
2. **Phone Verification**: Verify your phone number
3. **Business Verification** (for higher limits):
   - Upload business registration documents
   - Provide business address and details
   - Wait for approval (usually 24-48 hours)

### Step 3: Get Your API Credentials

1. **Login to Dashboard**: Go to [dashboard.sendchamp.com](https://dashboard.sendchamp.com)
2. **Navigate to Settings**: Click on "Settings" → "API Keys"
3. **Copy Your Credentials**:
   - **Public Key**: Used for client-side operations (not needed for paie)
   - **Access Token**: Your secret API key for server-side operations
   - **Test Access Token**: For testing purposes

### Step 4: Configure Sender ID

1. **Go to SMS Settings**: Dashboard → SMS → Sender IDs
2. **Add Sender ID**:
   - **Alphanumeric**: Up to 11 characters (e.g., "PAIE", "PayTokens")
   - **Numeric**: Your registered phone number
3. **Submit for Approval**: Some countries require sender ID approval
4. **Approval Time**: Usually 24-48 hours for alphanumeric IDs

## 🔧 Environment Configuration

Create or update your `.env` file with the following:

```env
# Sendchamp Configuration
SENDCHAMP_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
SENDCHAMP_ACCESS_TOKEN=sk_test_xxxxxxxxxxxx
SENDCHAMP_SENDER_ID=PAIE

# For Production, use live keys:
# SENDCHAMP_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
# SENDCHAMP_ACCESS_TOKEN=sk_live_xxxxxxxxxxxx
```

## 🔗 Webhook Setup

### Step 1: Configure Webhook URL

1. **Dashboard**: Go to Settings → Webhooks
2. **Add Webhook URL**: `https://your-domain.com/sms/webhook`
3. **Select Events**: Enable "SMS Received" events
4. **Save Configuration**

### Step 2: Webhook Security (Optional but Recommended)

```javascript
// Add webhook signature verification in your SMS controller
const crypto = require('crypto');

const verifyWebhookSignature = (payload, signature, secret) => {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return signature === `sha256=${computedSignature}`;
};
```

## 📱 SMS Configuration

### Supported Message Types

1. **Transactional SMS**: For system messages (receipts, confirmations)
2. **OTP SMS**: For verification codes
3. **Bulk SMS**: For marketing (not needed for paie)

### Route Types

- **DND**: For marketing messages (more expensive)
- **Non-DND**: For transactional messages (cheaper, recommended for paie)

## 🌍 Country-Specific Setup

### Nigeria
- **Sender ID Approval**: Required for alphanumeric IDs
- **DND Compliance**: Use Non-DND route for transactional messages
- **Local Pricing**: Most cost-effective rates

### Ghana
- **Sender ID**: Usually approved quickly
- **Network Support**: All major networks supported

### Kenya
- **Sender ID Approval**: Required
- **Safaricom Integration**: Direct carrier integration

### South Africa
- **Sender ID**: Alphanumeric IDs supported
- **All Networks**: MTN, Vodacom, Cell C, Telkom

## 💰 Pricing & Credits

### Credit System
- Sendchamp uses a credit-based system
- Credits are deducted per SMS sent
- Different rates for different countries/networks

### Typical Pricing (as of 2024)
- **Nigeria**: ~₦4-8 per SMS
- **Ghana**: ~$0.02-0.04 per SMS  
- **Kenya**: ~$0.03-0.05 per SMS
- **South Africa**: ~$0.04-0.06 per SMS

### Auto-Recharge
1. **Go to Billing**: Dashboard → Billing → Auto-Recharge
2. **Set Threshold**: Minimum credit balance to trigger recharge
3. **Add Payment Method**: Credit card or bank account
4. **Configure Amount**: How much to add when threshold is reached

## 🧪 Testing Your Integration

### Test SMS Sending

```bash
# Install dependencies first
npm install

# Run the test script
node test-base-integration.js
```

### Manual Testing

```bash
# Test SMS sending via curl
curl -X POST "https://api.sendchamp.com/api/v1/sms/send" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["+2348123456789"],
    "message": "Test message from paie!",
    "sender_name": "PAIE",
    "route": "non_dnd"
  }'
```

## 🔍 Monitoring & Analytics

### Dashboard Analytics
1. **SMS Reports**: Track delivery rates, failures
2. **Credit Usage**: Monitor spending and usage patterns
3. **Delivery Reports**: Real-time delivery status

### Webhook Events
- **SMS Sent**: When SMS is queued for delivery
- **SMS Delivered**: When SMS reaches recipient
- **SMS Failed**: When SMS delivery fails
- **SMS Received**: When someone replies to your SMS

## 🚨 Common Issues & Solutions

### SMS Not Sending
1. **Check Credits**: Ensure sufficient balance
2. **Verify Sender ID**: Must be approved for your country
3. **Phone Format**: Use international format (+234xxxxxxxxx)
4. **API Limits**: Check rate limits in dashboard

### Webhook Not Working
1. **URL Accessibility**: Ensure webhook URL is publicly accessible
2. **HTTPS Required**: Sendchamp requires HTTPS for webhooks
3. **Response Code**: Webhook endpoint must return 200 status
4. **Timeout**: Webhook must respond within 30 seconds

### High SMS Costs
1. **Route Selection**: Use "non_dnd" for transactional messages
2. **Message Length**: Keep messages under 160 characters
3. **Country Routing**: Some routes are more expensive
4. **Bulk Discounts**: Contact sales for volume discounts

## 📈 Production Checklist

- [ ] Account fully verified
- [ ] Live API keys configured
- [ ] Sender ID approved
- [ ] Webhook URL configured with HTTPS
- [ ] Auto-recharge enabled
- [ ] Monitoring/alerts set up
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] SMS templates optimized for character count

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **Webhook Verification**: Verify webhook signatures
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all phone numbers and messages
5. **Logging**: Log all SMS operations for debugging
6. **Encryption**: Consider encrypting sensitive SMS content

## 📞 Support

- **Documentation**: [docs.sendchamp.com](https://docs.sendchamp.com)
- **Support Email**: support@sendchamp.com
- **Live Chat**: Available in dashboard
- **Community**: Join Sendchamp developer community
- **API Status**: Check [status.sendchamp.com](https://status.sendchamp.com)

## 🔄 Migration from Twilio

If you're migrating from Twilio, here are the key differences:

### Webhook Format
```javascript
// Twilio format
const { Body: messageText, From: phoneNumber } = req.body;

// Sendchamp format (already updated in your code)
const { message: messageText, from: phoneNumber } = req.body;
```

### Response Format
```javascript
// Twilio expects TwiML XML response
res.set('Content-Type', 'text/xml');
res.send('<Response></Response>');

// Sendchamp expects JSON response (already updated)
res.status(200).json({ status: 'success', message: 'SMS processed' });
```

Your paie codebase has been fully updated to work with Sendchamp! 🎉