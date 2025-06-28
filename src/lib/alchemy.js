import { Network, Alchemy } from "alchemy-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";

// Alchemy API Key
const API_KEY = "KmgperIRJ6eIJ3PIh43wL";

// Ethereum Alchemy settings
const ethSettings = {
  apiKey: API_KEY,
  network: Network.ETH_MAINNET,
};

// Solana Alchemy connection
// For Solana, Alchemy provides a direct RPC endpoint, so we use Web3.js Connection object
const solanaConnection = new Connection(
  `https://solana-mainnet.g.alchemy.com/v2/${API_KEY}`,
  'confirmed'
);

export const alchemyEth = new Alchemy(ethSettings);
export const alchemySol = solanaConnection; 