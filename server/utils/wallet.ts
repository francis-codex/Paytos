import { ethers } from 'ethers';
import config from '../config/config';
import encryption from './encryption';
import logger from './logger';

// Define interfaces for return types
interface EthereumWallet {
    wallet: ethers.Wallet | ethers.HDNodeWallet;
    address: string;
    privateKey: string;
}

interface EncryptedWallet {
    encryptedPrivateKey: string;
    address: string;
}

interface NetworkConfig {
    name: string;
    rpcUrl: string;
    chainId: number;
    usdcAddress: string;
    gasLimit: number;
}

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
const getProvider = (): ethers.JsonRpcProvider => {
    return new ethers.JsonRpcProvider(config.base.rpcUrl);
};

/**
 * Get Base network configuration
 * @returns {NetworkConfig} Base network configuration
 */
const getNetworkConfig = (): NetworkConfig => {
    return config.base;
};

/**
 * Create a new Ethereum wallet
 * @returns {EthereumWallet} Object containing wallet instance and address
 */
const createWallet = (): EthereumWallet => {
    const wallet = ethers.Wallet.createRandom();

    return {
        wallet,
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};

/**
 * Restore an Ethereum wallet from a private key
 * @param {string} privateKey - The hex private key
 * @returns {EthereumWallet} Object containing wallet instance and address
 */
const restoreWallet = (privateKey: string): EthereumWallet => {
    const wallet = new ethers.Wallet(privateKey);

    return {
        wallet,
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
};

/**
 * Get wallet instance connected to Base network
 * @param {string} privateKey - The wallet private key
 * @returns {ethers.Wallet} Connected wallet instance
 */
const getWalletForBase = (privateKey: string): ethers.Wallet => {
    const provider = getProvider();
    return new ethers.Wallet(privateKey, provider);
};

/**
 * Get USDC contract instance for Base network
 * @param {ethers.Wallet | ethers.JsonRpcProvider} signerOrProvider - Signer or provider
 * @returns {ethers.Contract} USDC contract instance
 */
const getUSDCContract = (signerOrProvider: ethers.Wallet | ethers.JsonRpcProvider): ethers.Contract => {
    const networkConfig = getNetworkConfig();
    return new ethers.Contract(networkConfig.usdcAddress, USDC_ABI, signerOrProvider);
};

/**
 * Check the USDC balance of a wallet on Base network
 * @param {string} walletAddress - Ethereum address of the wallet
 * @returns {Promise<number>} The USDC balance
 */
const checkUSDCBalance = async (walletAddress: string): Promise<number> => {
    try {
        const provider = getProvider();
        const usdcContract = getUSDCContract(provider);

        const balance = await usdcContract.balanceOf(walletAddress);
        // USDC has 6 decimals
        return parseFloat(ethers.formatUnits(balance, 6));
    } catch (error) {
        logger.error('Error checking USDC balance on Base:', error);
        return 0;
    }
};

/**
 * Check native token balance (ETH) of a wallet on Base
 * @param {string} walletAddress - Ethereum address of the wallet
 * @returns {Promise<number>} The native token balance
 */
const checkNativeBalance = async (walletAddress: string): Promise<number> => {
    try {
        const provider = getProvider();
        const balance = await provider.getBalance(walletAddress);
        return parseFloat(ethers.formatEther(balance));
    } catch (error) {
        logger.error('Error checking native balance on Base:', error);
        return 0;
    }
};

/**
 * Send USDC from one wallet to another on Base network
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient's address
 * @param {number} amount - Amount to send (in USDC)
 * @returns {Promise<string>} Transaction hash
 */
const sendUSDC = async (
    fromPrivateKey: string,
    toAddress: string,
    amount: number
): Promise<string> => {
    try {
        const wallet = getWalletForBase(fromPrivateKey);
        const usdcContract = getUSDCContract(wallet);
        const networkConfig = getNetworkConfig();

        // Convert amount to USDC units (6 decimals)
        const amountWei = ethers.parseUnits(amount.toString(), 6);

        // Estimate gas
        const gasEstimate = await usdcContract.transfer.estimateGas(toAddress, amountWei);
        const gasLimit = gasEstimate * BigInt(Math.ceil(config.gas.priceMultiplier * 100)) / BigInt(100);

        // Send transaction
        const tx = await usdcContract.transfer(toAddress, amountWei, {
            gasLimit: gasLimit > BigInt(networkConfig.gasLimit) ? gasLimit : BigInt(networkConfig.gasLimit)
        });

        logger.info(`USDC transfer initiated on Base: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        logger.error('Error sending USDC on Base:', error);
        throw error;
    }
};

/**
 * Get the master wallet (used for paying fees and managing funds)
 * @returns {EthereumWallet} The master wallet
 */
const getMasterWallet = (): EthereumWallet => {
    if (!config.ethereum.masterWalletPrivateKey) {
        throw new Error('Master wallet private key is not set');
    }

    return restoreWallet(config.ethereum.masterWalletPrivateKey);
};

/**
 * Create an encrypted wallet for a user
 * @returns {EncryptedWallet} Object containing encrypted private key and address
 */
const createEncryptedWallet = (): EncryptedWallet => {
    const { privateKey, address } = createWallet();
    const encryptedPrivateKey = encryption.encrypt(privateKey);

    return {
        encryptedPrivateKey,
        address,
    };
};

/**
 * Decrypt a user's wallet
 * @param {string} encryptedPrivateKey - The encrypted private key
 * @returns {EthereumWallet} The wallet
 */
const decryptWallet = (encryptedPrivateKey: string): EthereumWallet => {
    const privateKey = encryption.decrypt(encryptedPrivateKey);
    return restoreWallet(privateKey);
};

/**
 * Estimate gas for a USDC transfer on Base
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient's address
 * @param {number} amount - Amount to send
 * @returns {Promise<bigint>} Estimated gas
 */
const estimateUSDCTransferGas = async (
    fromPrivateKey: string,
    toAddress: string,
    amount: number
): Promise<bigint> => {
    const wallet = getWalletForBase(fromPrivateKey);
    const usdcContract = getUSDCContract(wallet);
    const amountWei = ethers.parseUnits(amount.toString(), 6);

    return await usdcContract.transfer.estimateGas(toAddress, amountWei);
};

export {
    createWallet,
    restoreWallet,
    getWalletForBase,
    getProvider,
    getNetworkConfig,
    getUSDCContract,
    checkUSDCBalance,
    checkNativeBalance,
    sendUSDC,
    estimateUSDCTransferGas,
    getMasterWallet,
    createEncryptedWallet,
    decryptWallet,
    EthereumWallet,
    EncryptedWallet,
    NetworkConfig
};