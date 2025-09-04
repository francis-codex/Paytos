const config = require('./config/config');
const walletUtils = require('./src/utils/wallet');
const smsParser = require('./src/utils/smsParser');

console.log('🔧 Testing Ethereum Conversion...\n');

// Test 1: Configuration
console.log('1. Testing Configuration:');
console.log('✓ Ethereum networks configured:', Object.keys(config.ethereum.networks));
console.log('✓ Supported tokens:', config.supportedTokens.list);
console.log('✓ Default network:', config.ethereum.defaultNetwork);
console.log('');

// Test 2: Wallet Creation
console.log('2. Testing Wallet Creation:');
try {
  const newWallet = walletUtils.createWallet();
  console.log('✓ Wallet created successfully');
  console.log('  Address:', newWallet.address);
  console.log('  Private key length:', newWallet.privateKey.length);
  
  // Test wallet restoration
  const restoredWallet = walletUtils.restoreWallet(newWallet.privateKey);
  console.log('✓ Wallet restored successfully');
  console.log('  Addresses match:', newWallet.address === restoredWallet.address);
} catch (error) {
  console.log('✗ Wallet creation failed:', error.message);
}
console.log('');

// Test 3: Network Providers
console.log('3. Testing Network Providers:');
const networks = ['ethereum', 'lisk', 'base'];
for (const network of networks) {
  try {
    const provider = walletUtils.getProvider(network);
    const networkConfig = walletUtils.getNetworkConfig(network);
    console.log(`✓ ${network} provider created`);
    console.log(`  Chain ID: ${networkConfig.chainId}`);
    console.log(`  USDC Address: ${networkConfig.usdcAddress}`);
  } catch (error) {
    console.log(`✗ ${network} provider failed:`, error.message);
  }
}
console.log('');

// Test 4: SMS Command Parsing
console.log('4. Testing SMS Command Parsing:');
const testCommands = [
  'REGISTER 1234',
  'BALANCE 1234',
  'BALANCE 1234 ethereum',
  'SEND +1234567890 10 USDC 1234',
  'SEND +1234567890 10 USDC 1234 base',
  'HELP'
];

for (const command of testCommands) {
  try {
    const parsed = smsParser.parseSmsCommand(command);
    if (parsed.error) {
      console.log(`✗ "${command}" -> Error: ${parsed.error}`);
    } else {
      console.log(`✓ "${command}" -> ${parsed.command}${parsed.network ? ` (${parsed.network})` : ''}`);
    }
  } catch (error) {
    console.log(`✗ "${command}" -> Parse error:`, error.message);
  }
}
console.log('');

// Test 5: Encrypted Wallet
console.log('5. Testing Encrypted Wallet:');
try {
  const encryptedWallet = walletUtils.createEncryptedWallet();
  console.log('✓ Encrypted wallet created');
  console.log('  Address:', encryptedWallet.address);
  
  const decryptedWallet = walletUtils.decryptWallet(encryptedWallet.encryptedPrivateKey);
  console.log('✓ Wallet decrypted successfully');
  console.log('  Addresses match:', encryptedWallet.address === decryptedWallet.address);
} catch (error) {
  console.log('✗ Encrypted wallet test failed:', error.message);
}
console.log('');

console.log('🎉 Ethereum conversion testing completed!');
console.log('\n📝 Next Steps:');
console.log('1. Set up environment variables in .env file');
console.log('2. Configure RPC endpoints for each network');
console.log('3. Add USDC contract addresses for mainnet/testnet');
console.log('4. Test with actual blockchain connections');
console.log('5. Deploy to testnet for SMS testing');
