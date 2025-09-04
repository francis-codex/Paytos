const encryption = require('./src/utils/encryption');
const walletUtils = require('./src/utils/wallet');

console.log('🔐 Testing Encryption Setup...\n');

try {
  // Test 1: Basic encryption/decryption
  console.log('1. Testing Basic Encryption:');
  const testData = 'Hello, this is a test message!';
  const encrypted = encryption.encrypt(testData);
  const decrypted = encryption.decrypt(encrypted);
  
  console.log('✓ Original:', testData);
  console.log('✓ Encrypted:', encrypted.substring(0, 20) + '...');
  console.log('✓ Decrypted:', decrypted);
  console.log('✓ Match:', testData === decrypted ? 'YES' : 'NO');
  console.log('');

  // Test 2: Wallet encryption
  console.log('2. Testing Wallet Encryption:');
  const wallet = walletUtils.createWallet();
  console.log('✓ Wallet created');
  console.log('  Address:', wallet.address);
  
  const encryptedWallet = walletUtils.createEncryptedWallet();
  console.log('✓ Encrypted wallet created');
  console.log('  Address:', encryptedWallet.address);
  console.log('  Encrypted key length:', encryptedWallet.encryptedPrivateKey.length);
  
  const decryptedWallet = walletUtils.decryptWallet(encryptedWallet.encryptedPrivateKey);
  console.log('✓ Wallet decrypted');
  console.log('  Addresses match:', encryptedWallet.address === decryptedWallet.address ? 'YES' : 'NO');
  console.log('');

  console.log('🎉 Encryption test completed successfully!');
  
} catch (error) {
  console.log('❌ Encryption test failed:', error.message);
  console.log('');
  console.log('Common issues:');
  console.log('1. Make sure ENCRYPTION_KEY is set in .env file');
  console.log('2. Make sure the key is exactly 64 characters (32 bytes in hex)');
  console.log('3. Check that the encryption utility exists');
}