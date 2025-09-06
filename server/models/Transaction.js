const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderPhone: {
    type: String,
    required: true,
  },
  recipientPhone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    enum: ['USDC'],
    required: true,
  },
  network: {
    type: String,
    enum: ['base'],
    required: true,
    default: 'base',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'confirmed'],
    default: 'pending',
  },
  transactionHash: {
    type: String,
    default: null,
  },
  blockNumber: {
    type: Number,
    default: null,
  },
  gasUsed: {
    type: String,
    default: null,
  },
  gasFee: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  confirmations: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema); 