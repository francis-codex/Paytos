# patos: Pay Tokens Over SMS

patos allows users to send and receive USDC tokens on the Base network via basic SMS on feature phones with no internet access.

## 🔧 Core Idea

patos bridges the gap between blockchain and traditional feature phones by enabling:

- A backend wallet system that users interact with via SMS commands
- A trusted SMS gateway (Sendchamp) to send/receive messages
- Custodial wallets managed by our backend on Base network

## 📱 How It Works

### User Registration
```
User sends: REGISTER <PIN>
Response: "Wallet created. Balance: $0 USD. Your PIN is used to confirm transactions."
```

### Checking Balance
```
User sends: BALANCE <PIN>
Response: "patos Balance (Base): USDC: 0.00, ETH: 0.0000"
```

### Sending Money
```
User sends: SEND +448927779812 10 USDC <PIN>
Response: "Confirm sending 10 USDC to +448927779812 on Base? Reply with YES to confirm or NO to cancel."
User sends: YES
Response: "Sent 10 USDC to +448927779812. New USDC balance: 5.00"
```

### Receiving Money
The recipient gets a notification when money is sent to their phone number:
```
"You received 10 USDC from +123456789. New USDC balance: 10.00"
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Sendchamp account
- Base network wallet with ETH for gas fees

### Installation

1. Clone the repository
```
git clone https://github.com/username/patos.git
cd patos
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/patos

# Sendchamp Configuration
SENDCHAMP_PUBLIC_KEY=your_sendchamp_public_key
SENDCHAMP_ACCESS_TOKEN=your_sendchamp_access_token
SENDCHAMP_SENDER_ID=your_sendchamp_sender_id

# Master Wallet Configuration
MASTER_WALLET_PRIVATE_KEY=your_master_wallet_private_key

# Encryption Key for storing user wallet keys
ENCRYPTION_KEY=your_strong_encryption_key_32_chars

# Base RPC Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_TESTNET_RPC=https://sepolia.base.org

# USDC Contract Addresses
USDC_BASE=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
USDC_BASE_TESTNET=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Gas Configuration
DEFAULT_GAS_LIMIT=60000
GAS_PRICE_MULTIPLIER=1.1
MAX_GAS_PRICE_GWEI=50

# Supported Tokens
SUPPORTED_TOKENS=USDC

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_for_admin_api

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Start the server

```bash
# Build JS from TypeScript
npx tsc

# Start the application
npm run dev
```

5. Set up Sendchamp webhook
Configure your Sendchamp account to send webhook POST requests to:
```
https://your-server.com/sms/webhook
```

## 💬 SMS Commands

- `REGISTER <PIN>` - Create a new wallet
- `BALANCE <PIN>` - Check your balance
- `SEND <RECIPIENT> <AMOUNT> <TOKEN> <PIN>` - Send tokens
  - Example: `SEND +1234567890 10 USDC 1234`
- `HELP` - Get list of available commands

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Blockchain**: Base network, ERC-20 USDC
- **SMS Gateway**: Sendchamp
- **Security**: AES encryption for wallet keys

#build# 🔒 Security Notes

- User wallet private keys are encrypted at rest
- PINs are hashed before storage
- Account locking after 5 failed PIN attempts
- Transaction confirmations required before execution

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 