// Removed Solana imports as we're now Base-only
const config = require('../../config/config');
const walletUtils = require('../utils/wallet');
const logger = require('../utils/logger');
const User = require('../models/User');
const TransactionModel = require('../models/Transaction');
const PendingTransaction = require('../models/PendingTransaction');

/**
 * Update user token balances in the database on Base network
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const updateUserBalances = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get user wallet
    const userWallet = walletUtils.decryptWallet(user.encryptedPrivateKey);

    try {
      // Update USDC balance on Base
      const usdcBalance = await walletUtils.checkUSDCBalance(userWallet.address);
      user.tokenBalances.USDC = usdcBalance;

      // Update native token balance (ETH) on Base
      const nativeBalance = await walletUtils.checkNativeBalance(userWallet.address);
      user.tokenBalances.ETH = nativeBalance;

      logger.info(`Updated Base balances for user ${userId}: USDC=${usdcBalance}, ETH=${nativeBalance}`);
    } catch (networkError) {
      logger.error(`Failed to update Base balances for user ${userId}: ${networkError.message}`);
      throw networkError;
    }

    await user.save();
    logger.info(`Updated balances for user ${userId}`);
  } catch (error) {
    logger.error(`Failed to update balances for user ${userId}: ${error.message}`);
    throw error;
  }
};

// Removed Solana-specific transfer functions as we're now Base-only

/**
 * Create a transaction between two users
 * @param {string} senderPhone - Sender phone number
 * @param {string} recipientPhone - Recipient phone number
 * @param {number} amount - Amount to send
 * @param {string} token - Token symbol
 * @returns {Promise<Object>} The created transaction
 */
const createTransaction = async (senderPhone, recipientPhone, amount, token) => {
  try {
    // Find sender
    const sender = await User.findOne({ phoneNumber: senderPhone });
    if (!sender) {
      throw new Error('Sender not found');
    }
    
    // Check if sender has enough balance
    if (sender.tokenBalances[token] < amount) {
      throw new Error(`Insufficient ${token} balance`);
    }

    // Find or create recipient
    let recipient = await User.findOne({ phoneNumber: recipientPhone });

    if (!recipient) {
      // If recipient doesn't exist, we'll create a placeholder with just the phone number
      // They will need to register to access their funds
      const { encryptedPrivateKey, address } = walletUtils.createEncryptedWallet();

      recipient = new User({
        phoneNumber: recipientPhone,
        encryptedPrivateKey: encryptedPrivateKey,
        walletAddress: address,
        pin: '000000', // Temporary PIN, will be updated when they register
        isVerified: false,
      });

      await recipient.save();
      logger.info(`Created placeholder user for ${recipientPhone}`);
    }

    // Create transaction record
    const transaction = new TransactionModel({
      sender: sender._id,
      recipient: recipient._id,
      senderPhone,
      recipientPhone,
      amount,
      token,
      status: 'pending',
    });
    
    await transaction.save();
    logger.info(`Created transaction: ${transaction._id}`);
    
    return transaction;
  } catch (error) {
    logger.error(`Failed to create transaction: ${error.message}`);
    throw error;
  }
};

/**
 * Execute a transaction on the Base blockchain
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} The updated transaction
 */
const executeTransaction = async (transactionId) => {
  try {
    // Find transaction
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Transaction is already ${transaction.status}`);
    }

    // Find sender and recipient
    const sender = await User.findById(transaction.sender);
    const recipient = await User.findById(transaction.recipient);

    if (!sender || !recipient) {
      throw new Error('Sender or recipient not found');
    }

    // Decrypt sender wallet
    const senderWallet = walletUtils.decryptWallet(sender.encryptedPrivateKey);

    // Execute USDC transfer
    let transactionHash;
    if (transaction.token === 'USDC') {
      transactionHash = await walletUtils.sendUSDC(
        senderWallet.privateKey,
        recipient.walletAddress,
        transaction.amount
      );
    } else {
      throw new Error(`Unsupported token: ${transaction.token}`);
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.transactionHash = transactionHash;
    transaction.completedAt = Date.now();
    await transaction.save();
    
    // Update balances for both users
    await updateUserBalances(sender._id);
    await updateUserBalances(recipient._id);
    
    logger.info(`Completed transaction ${transactionId}`);
    
    return transaction;
  } catch (error) {
    // Update transaction status to failed
    try {
      const transaction = await TransactionModel.findById(transactionId);
      if (transaction) {
        transaction.status = 'failed';
        transaction.errorMessage = error.message;
        await transaction.save();
      }
    } catch (updateError) {
      logger.error(`Failed to update transaction status: ${updateError.message}`);
    }
    
    logger.error(`Failed to execute transaction ${transactionId}: ${error.message}`);
    throw error;
  }
};

/**
 * Create a pending transaction that needs confirmation
 * @param {string} senderPhone - Sender phone number
 * @param {string} recipientPhone - Recipient phone number
 * @param {number} amount - Amount to send
 * @param {string} token - Token symbol
 * @returns {Promise<Object>} The pending transaction with confirmation code
 */
const createPendingTransaction = async (senderPhone, recipientPhone, amount, token) => {
  try {
    // Generate a random confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create pending transaction that expires in 5 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const pendingTransaction = new PendingTransaction({
      senderPhone,
      recipientPhone,
      amount,
      token,
      confirmationCode,
      expiresAt,
    });

    await pendingTransaction.save();
    logger.info(`Created pending transaction with code ${confirmationCode}`);

    return pendingTransaction;
  } catch (error) {
    logger.error(`Failed to create pending transaction: ${error.message}`);
    throw error;
  }
};

/**
 * Confirm and execute a pending transaction
 * @param {string} senderPhone - Sender phone number
 * @param {string} confirmationCode - The confirmation code
 * @returns {Promise<Object>} The completed transaction
 */
const confirmTransaction = async (senderPhone, confirmationCode) => {
  try {
    // Find pending transaction
    const pendingTx = await PendingTransaction.findOne({
      senderPhone,
      confirmationCode: confirmationCode.toUpperCase(),
    });
    
    if (!pendingTx) {
      throw new Error('Invalid confirmation code or expired transaction');
    }
    
    // Create and execute the transaction
    const transaction = await createTransaction(
      pendingTx.senderPhone,
      pendingTx.recipientPhone,
      pendingTx.amount,
      pendingTx.token
    );
    
    const completedTransaction = await executeTransaction(transaction._id);
    
    // Remove the pending transaction
    await pendingTx.remove();
    
    return completedTransaction;
  } catch (error) {
    logger.error(`Failed to confirm transaction: ${error.message}`);
    throw error;
  }
};

module.exports = {
  updateUserBalances,
  createTransaction,
  executeTransaction,
  createPendingTransaction,
  confirmTransaction,
};