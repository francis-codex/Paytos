const config = require('./server/config/config');
const walletUtils = require('./server/utils/wallet');
const smsParser = require('./server/utils/smsParser');

console.log('🔧 Testing Base Network Integration...\n');

// Test 1: Base Configuration
console.log('1. Testing Base Network Configuration:');
console.log('✓ Base network name:', config.base.name);
console.log('✓ Base RPC URL:', config.base.rpcUrl);
console.log('✓ Base Chain ID:', config.base.chainId);
console.log('✓ USDC Contract:', config.base.usdcAddress);
console.log('✓ Supported tokens:', config.supportedTokens.list);
console.log('✓ Environment:', config.server.env);
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

// Test 3: Base Network Provider
console.log('3. Testing Base Network Provider:');
try {
  const provider = walletUtils.getProvider();
  const networkConfig = walletUtils.getNetworkConfig();
  console.log('✓ Base provider created successfully');
  console.log('  Chain ID:', networkConfig.chainId);
  console.log('  USDC Address:', networkConfig.usdcAddress);
  console.log('  Gas Limit:', networkConfig.gasLimit);
} catch (error) {
  console.log('✗ Base provider failed:', error.message);
}
console.log('');

// Test 4: SMS Command Parsing for Base Network
console.log('4. Testing SMS Command Parsing:');
const testCommands = [
  'REGISTER 1234',
  'BALANCE 1234',
  'SEND +1234567890 10 USDC 1234',
  'YES',
  'CONFIRM ABC123 1234',
  'HELP'
];

for (const command of testCommands) {
  try {
    const parsed = smsParser.parseSmsCommand(command);
    if (parsed.error) {
      console.log(`✗ "${command}" -> Error: ${parsed.error}`);
    } else {
      console.log(`✓ "${command}" -> ${parsed.command}`);
      if (parsed.amount) console.log(`    Amount: ${parsed.amount} ${parsed.token || 'USDC'}`);
      if (parsed.recipient) console.log(`    Recipient: ${parsed.recipient}`);
      if (parsed.confirmationCode) console.log(`    Confirmation: ${parsed.confirmationCode}`);
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

// Test 6: Base Network Balance Check (if RPC is available)
console.log('6. Testing Base Network Balance Check:');
async function testBalanceCheck() {
  try {
    const testWallet = walletUtils.createWallet();
    console.log('✓ Test wallet created for balance check');
    console.log('  Address:', testWallet.address);
    
    // Check USDC balance
    const usdcBalance = await walletUtils.checkUSDCBalance(testWallet.address);
    console.log('✓ USDC balance check completed:', usdcBalance, 'USDC');
    
    // Check ETH balance
    const ethBalance = await walletUtils.checkNativeBalance(testWallet.address);
    console.log('✓ ETH balance check completed:', ethBalance, 'ETH');
  } catch (error) {
    console.log('✗ Balance check failed:', error.message);
    console.log('  This is expected if RPC endpoint is not configured or accessible');
  }
}

testBalanceCheck().then(() => {
  console.log('');
  console.log('🎉 Base Network testing completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Set up environment variables in .env file');
  console.log('2. Configure Base RPC endpoints (mainnet/testnet)');
  console.log('3. Add master wallet private key for gas payments');
  console.log('4. Test with actual Base network connections');
  console.log('5. Deploy to Base Sepolia testnet for SMS testing');
  console.log('6. Set up Twilio webhook for SMS integration');
}).catch(console.error);
