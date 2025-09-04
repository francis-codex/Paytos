require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/paie',
  },
  sendchamp: {
    publicKey: process.env.SENDCHAMP_PUBLIC_KEY,
    accessToken: process.env.SENDCHAMP_ACCESS_TOKEN,
    senderId: process.env.SENDCHAMP_SENDER_ID,
    baseUrl: 'https://api.sendchamp.com/api/v1',
  },
  base: {
    masterWalletPrivateKey: process.env.MASTER_WALLET_PRIVATE_KEY,
    name: 'Base',
    rpcUrl: process.env.NODE_ENV === 'development'
      ? process.env.BASE_TESTNET_RPC
      : process.env.BASE_RPC_URL,
    chainId: process.env.NODE_ENV === 'development' ? 84532 : 8453, // Base Sepolia : Base Mainnet
    usdcAddress: process.env.NODE_ENV === 'development'
      ? process.env.USDC_BASE_TESTNET
      : process.env.USDC_BASE,
    gasLimit: 60000,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
  supportedTokens: {
    list: (process.env.SUPPORTED_TOKENS || 'USDC').split(','),
  },
  gas: {
    defaultLimit: parseInt(process.env.DEFAULT_GAS_LIMIT) || 100000,
    priceMultiplier: parseFloat(process.env.GAS_PRICE_MULTIPLIER) || 1.1,
    maxPriceGwei: parseInt(process.env.MAX_GAS_PRICE_GWEI) || 50,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_jwt_secret_for_development',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};