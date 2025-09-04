const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  encryptedPrivateKey: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  pinFailAttempts: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  // Token balances on Base network
  tokenBalances: {
    USDC: {
      type: Number,
      default: 0,
    },
    ETH: {
      type: Number,
      default: 0,
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema); 