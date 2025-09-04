const axios = require('axios');
const config = require('../../config/config');
const logger = require('../utils/logger');

/**
 * Send an SMS message via Sendchamp
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message content
 * @returns {Promise<Object>} The message ID and status
 */
const sendSms = async (to, message) => {
  try {
    if (!config.sendchamp.publicKey || !config.sendchamp.senderId) {
      throw new Error('Sendchamp configuration is incomplete');
    }
    
    const payload = {
      to: [to],
      message: message,
      sender_name: config.sendchamp.senderId,
      route: 'non_dnd'
    };
    
    const response = await axios.post(
      `${config.sendchamp.baseUrl}/sms/send`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${config.sendchamp.publicKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data.status === 200) {
      logger.info(`SMS sent to ${to}. Message ID: ${response.data.data.id}`);
      return {
        id: response.data.data.id,
        status: response.data.data.status,
        reference: response.data.data.reference,
      };
    } else {
      throw new Error(`Sendchamp API error: ${response.data.message}`);
    }
  } catch (error) {
    logger.error(`Failed to send SMS to ${to}: ${error.message}`);
    if (error.response) {
      logger.error(`Sendchamp API response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

/**
 * Format and send a registration confirmation message
 * @param {string} phoneNumber - User phone number
 */
const sendRegistrationConfirmation = async (phoneNumber) => {
  const message = 
`Welcome to paie! Your wallet has been created.
- To check your balance, text: BALANCE <PIN>
- To send money, text: SEND <RECIPIENT> <AMOUNT> <TOKEN> <PIN>
- For help, text: HELP`;
  
  return sendSms(phoneNumber, message);
};

/**
 * Format and send a balance message
 * @param {string} phoneNumber - User phone number
 * @param {Object} balances - Token balances
 */
const sendBalanceInfo = async (phoneNumber, balances) => {
  const message =
`paie Balance (Base):
USDC: ${balances.USDC.toFixed(2)}
ETH: ${balances.ETH.toFixed(4)}`;

  return sendSms(phoneNumber, message);
};

/**
 * Format and send a transaction confirmation request
 * @param {string} phoneNumber - User phone number
 * @param {string} recipient - Recipient phone number
 * @param {number} amount - Transaction amount
 * @param {string} token - Token symbol
 */
const sendTransactionConfirmationRequest = async (phoneNumber, recipient, amount, token) => {
  const message =
`Confirm sending ${amount} ${token} to ${recipient} on Base?
Reply with YES to confirm or NO to cancel.`;

  return sendSms(phoneNumber, message);
};

/**
 * Format and send a transaction completion notification
 * @param {string} phoneNumber - User phone number
 * @param {string} recipient - Recipient phone number
 * @param {number} amount - Transaction amount
 * @param {string} token - Token symbol
 * @param {number} newBalance - New balance after transaction
 */
const sendTransactionCompletion = async (phoneNumber, recipient, amount, token, newBalance) => {
  const message = 
`Sent ${amount} ${token} to ${recipient}.
New ${token} balance: ${newBalance.toFixed(token === 'SOL' ? 4 : 2)}`;
  
  return sendSms(phoneNumber, message);
};

/**
 * Format and send a transaction receipt notification
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} sender - Sender phone number
 * @param {number} amount - Transaction amount
 * @param {string} token - Token symbol
 * @param {number} newBalance - New balance after receiving
 */
const sendTransactionReceipt = async (phoneNumber, sender, amount, token, newBalance) => {
  const message = 
`You received ${amount} ${token} from ${sender}.
New ${token} balance: ${newBalance.toFixed(token === 'SOL' ? 4 : 2)}`;
  
  return sendSms(phoneNumber, message);
};

/**
 * Format and send an error message
 * @param {string} phoneNumber - User phone number 
 * @param {string} errorMessage - Error message
 */
const sendErrorMessage = async (phoneNumber, errorMessage) => {
  const message = `Error: ${errorMessage}`;
  return sendSms(phoneNumber, message);
};

/**
 * Format and send a help message
 * @param {string} phoneNumber - User phone number
 */
const sendHelpMessage = async (phoneNumber) => {
  const message =
`paie Commands:
- REGISTER <PIN> - Create a new wallet
- BALANCE <PIN> - Check your balance
- SEND <RECIPIENT> <AMOUNT> USDC <PIN> - Send USDC
  Example: SEND +1234567890 10 USDC 1234
- Network: Base

Need more help? Visit paie.io`;

  return sendSms(phoneNumber, message);
};

module.exports = {
  sendSms,
  sendRegistrationConfirmation,
  sendBalanceInfo,
  sendTransactionConfirmationRequest,
  sendTransactionCompletion,
  sendTransactionReceipt,
  sendErrorMessage,
  sendHelpMessage,
}; 