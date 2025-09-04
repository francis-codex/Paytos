"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptWallet = exports.createEncryptedWallet = exports.getMasterWallet = exports.estimateUSDCTransferGas = exports.sendUSDC = exports.checkNativeBalance = exports.checkUSDCBalance = exports.getUSDCContract = exports.getNetworkConfig = exports.getProvider = exports.getWalletForBase = exports.restoreWallet = exports.createWallet = void 0;
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../../config/config"));
const encryption_1 = __importDefault(require("./encryption"));
const logger_1 = __importDefault(require("./logger"));
// ERC-20 USDC ABI (minimal interface for balance and transfer)
const USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];
/**
 * Get Base provider
 * @returns {ethers.JsonRpcProvider} Base provider
 */
const getProvider = () => {
    return new ethers_1.ethers.JsonRpcProvider(config_1.default.base.rpcUrl);
};
exports.getProvider = getProvider;
/**
 * Get Base network configuration
 * @returns {NetworkConfig} Base network configuration
 */
const getNetworkConfig = () => {
    return config_1.default.base;
};
exports.getNetworkConfig = getNetworkConfig;
/**
 * Create a new Ethereum wallet
 * @returns {EthereumWallet} Object containing wallet instance and address
 */
const createWallet = () => {
    const wallet = ethers_1.ethers.Wallet.createRandom();
    return {
        wallet,
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};
exports.createWallet = createWallet;
/**
 * Restore an Ethereum wallet from a private key
 * @param {string} privateKey - The hex private key
 * @returns {EthereumWallet} Object containing wallet instance and address
 */
const restoreWallet = (privateKey) => {
    const wallet = new ethers_1.ethers.Wallet(privateKey);
    return {
        wallet,
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};
exports.restoreWallet = restoreWallet;
/**
 * Get wallet instance connected to Base network
 * @param {string} privateKey - The wallet private key
 * @returns {ethers.Wallet} Connected wallet instance
 */
const getWalletForBase = (privateKey) => {
    const provider = getProvider();
    return new ethers_1.ethers.Wallet(privateKey, provider);
};
exports.getWalletForBase = getWalletForBase;
/**
 * Get USDC contract instance for Base network
 * @param {ethers.Wallet | ethers.JsonRpcProvider} signerOrProvider - Signer or provider
 * @returns {ethers.Contract} USDC contract instance
 */
const getUSDCContract = (signerOrProvider) => {
    const networkConfig = getNetworkConfig();
    return new ethers_1.ethers.Contract(networkConfig.usdcAddress, USDC_ABI, signerOrProvider);
};
exports.getUSDCContract = getUSDCContract;
/**
 * Check the USDC balance of a wallet on Base network
 * @param {string} walletAddress - Ethereum address of the wallet
 * @returns {Promise<number>} The USDC balance
 */
const checkUSDCBalance = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = getProvider();
        const usdcContract = getUSDCContract(provider);
        const balance = yield usdcContract.balanceOf(walletAddress);
        // USDC has 6 decimals
        return parseFloat(ethers_1.ethers.formatUnits(balance, 6));
    }
    catch (error) {
        logger_1.default.error('Error checking USDC balance on Base:', error);
        return 0;
    }
});
exports.checkUSDCBalance = checkUSDCBalance;
/**
 * Check native token balance (ETH) of a wallet on Base
 * @param {string} walletAddress - Ethereum address of the wallet
 * @returns {Promise<number>} The native token balance
 */
const checkNativeBalance = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = getProvider();
        const balance = yield provider.getBalance(walletAddress);
        return parseFloat(ethers_1.ethers.formatEther(balance));
    }
    catch (error) {
        logger_1.default.error('Error checking native balance on Base:', error);
        return 0;
    }
});
exports.checkNativeBalance = checkNativeBalance;
/**
 * Send USDC from one wallet to another on Base network
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient's address
 * @param {number} amount - Amount to send (in USDC)
 * @returns {Promise<string>} Transaction hash
 */
const sendUSDC = (fromPrivateKey, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = getWalletForBase(fromPrivateKey);
        const usdcContract = getUSDCContract(wallet);
        const networkConfig = getNetworkConfig();
        // Convert amount to USDC units (6 decimals)
        const amountWei = ethers_1.ethers.parseUnits(amount.toString(), 6);
        // Estimate gas
        const gasEstimate = yield usdcContract.transfer.estimateGas(toAddress, amountWei);
        const gasLimit = gasEstimate * BigInt(Math.ceil(config_1.default.gas.priceMultiplier * 100)) / BigInt(100);
        // Send transaction
        const tx = yield usdcContract.transfer(toAddress, amountWei, {
            gasLimit: gasLimit > BigInt(networkConfig.gasLimit) ? gasLimit : BigInt(networkConfig.gasLimit)
        });
        logger_1.default.info(`USDC transfer initiated on Base: ${tx.hash}`);
        return tx.hash;
    }
    catch (error) {
        logger_1.default.error('Error sending USDC on Base:', error);
        throw error;
    }
});
exports.sendUSDC = sendUSDC;
/**
 * Get the master wallet (used for paying fees and managing funds)
 * @returns {EthereumWallet} The master wallet
 */
const getMasterWallet = () => {
    if (!config_1.default.ethereum.masterWalletPrivateKey) {
        throw new Error('Master wallet private key is not set');
    }
    return restoreWallet(config_1.default.ethereum.masterWalletPrivateKey);
};
exports.getMasterWallet = getMasterWallet;
/**
 * Create an encrypted wallet for a user
 * @returns {EncryptedWallet} Object containing encrypted private key and address
 */
const createEncryptedWallet = () => {
    const { privateKey, address } = createWallet();
    const encryptedPrivateKey = encryption_1.default.encrypt(privateKey);
    return {
        encryptedPrivateKey,
        address,
    };
};
exports.createEncryptedWallet = createEncryptedWallet;
/**
 * Decrypt a user's wallet
 * @param {string} encryptedPrivateKey - The encrypted private key
 * @returns {EthereumWallet} The wallet
 */
const decryptWallet = (encryptedPrivateKey) => {
    const privateKey = encryption_1.default.decrypt(encryptedPrivateKey);
    return restoreWallet(privateKey);
};
exports.decryptWallet = decryptWallet;
/**
 * Estimate gas for a USDC transfer on Base
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient's address
 * @param {number} amount - Amount to send
 * @returns {Promise<bigint>} Estimated gas
 */
const estimateUSDCTransferGas = (fromPrivateKey, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = getWalletForBase(fromPrivateKey);
    const usdcContract = getUSDCContract(wallet);
    const amountWei = ethers_1.ethers.parseUnits(amount.toString(), 6);
    return yield usdcContract.transfer.estimateGas(toAddress, amountWei);
});
exports.estimateUSDCTransferGas = estimateUSDCTransferGas;
