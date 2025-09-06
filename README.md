# patos: Pay Tokens Over SMS

 **Project Name:** patos

 **Short Description:** Send and receive USDC tokens on Base network via basic SMS on feature phones with no internet access. Enables blockchain payments through text messages for 5B+ users globally.

 **How It's Made:** 
Hybrid architecture combining Node.js/Express backend with React frontend. Backend manages custodial wallets using ethers.js for Base network integration, MongoDB for data persistence, and Sendchamp SMS gateway for communication. Frontend built with React 19 + TypeScript, styled with Tailwind CSS and Framer Motion. AES encryption secures wallet keys, JWT handles admin auth, and Vercel manages deployment.

 **Public Code & Design Links:**
- GitHub: [Add your repository URL here]
- Demo: [Demo video/presentation link - see instructions below]
- Architecture: Custodial wallet system managing Base USDC transfers via SMS commands

## 🔧 Core Architecture

patos bridges blockchain and feature phones through:

- Backend wallet system with SMS command processing
- Sendchamp SMS gateway for global text message delivery
- Custodial wallets on Base network with USDC support

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

## 🛠️ Technical Breakdown

**Backend Stack:**
- Node.js + Express.js server framework
- MongoDB Atlas for user/transaction persistence
- Ethers.js for Base network blockchain integration
- Sendchamp SMS gateway API for global messaging
- AES-256 encryption for secure wallet key storage
- JWT authentication for admin dashboard access

**Frontend Stack:**
- React 19.1.0 with TypeScript for type safety
- Tailwind CSS + custom animations for modern UI
- Framer Motion for smooth page transitions
- Lucide React icons for consistent iconography
- Vercel deployment with automated CI/CD

**Blockchain Infrastructure:**
- Base Layer 2 network for low-cost transactions
- USDC ERC-20 token contract integration
- Custodial wallet management with gas optimization
- Transaction confirmation via SMS workflow

**Security & DevOps:**
- Rate limiting and request validation
- Encrypted private key storage at rest
- PIN-based transaction authorization
- Comprehensive logging and error handling

 **Demo Video / Presentation:**
[Create a 4-minute demo video showing SMS commands in action or prepare max 10 slides covering problem, solution, tech stack, and team contributions]

 **Deployment & Contract Details:**
- Frontend: [Add Vercel deployment URL here]
- Backend API: [Add backend deployment URL here]  
- USDC Contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 (Base Mainnet)
- Test Network: Base Sepolia available for testing

 **Problem, Impact & Future Roadmap:**
**Problem:** 5+ billion feature phone users globally lack access to digital payments and DeFi due to smartphone/internet requirements.

**Impact:** Enables SMS-based crypto payments for unbanked populations, reducing transaction costs and increasing financial inclusion in developing markets.

**Future:** Multi-token support, merchant integrations, offline transaction queuing, and integration with existing mobile money systems.

## 🔒 Security Notes

- User wallet private keys are encrypted at rest
- PINs are hashed before storage
- Account locking after 5 failed PIN attempts
- Transaction confirmations required before execution

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 
