import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, parseEther, formatEther } from "ethers";
import { Trash2 } from "lucide-react";
import { alchemyEth } from '../lib/alchemy';

export default function EthWallet({ 
  mnemonic, 
  addresses, 
  setAddresses, 
  currentIndex, 
  setCurrentIndex,
  onDeleteKey 
}) {
  const [balances, setBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0); // Default to first wallet
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setLoadingBalances(true);
      const fetchBalances = async () => {
        const newBalances = {};
        for (const address of addresses) {
          try {
            const balanceWei = await alchemyEth.core.getBalance(address);
            newBalances[address] = formatEther(balanceWei.toString());
          } catch (error) {
            console.error("Error fetching balance for address ", address, ":", error);
            newBalances[address] = "Error";
          }
        }
        setBalances(newBalances);
        setLoadingBalances(false);
      };
      fetchBalances();
    } else {
      setBalances({});
      setLoadingBalances(false);
    }
  }, [addresses]);

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        className="block mx-auto px-6 py-3 bg-white/90 hover:bg-white text-black rounded-2xl mt-10 hover:scale-105 transition-all shadow-lg"
        onClick={async function() {
          try {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            
            // For Ethereum, we also need to store the private key securely if we want to send transactions
            // For now, let's just use the address for display, but for sending, the private key is crucial.
            // We will need a way to derive the specific wallet for sending later.
            const wallet = new Wallet(child.privateKey);
            setCurrentIndex(currentIndex + 1);
            setAddresses([...addresses, wallet.address]);
          } catch (error) {
            console.error("Error adding Ethereum wallet:", error);
          }
        }}
      >
        Add ETH Wallet
      </button>

      <div className="mt-8 space-y-4">
        {addresses && addresses.length > 0 ? (
          <select
            className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={selectedWalletIndex}
            onChange={(e) => setSelectedWalletIndex(Number(e.target.value))}
          >
            {addresses.map((address, idx) => (
              <option key={address} value={idx}>
                Wallet {idx}: {address} ({balances[address] || "0.0"} ETH)
              </option>
            ))}
          </select>
        ) : null}

        {addresses && addresses.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Send ETH from Selected Wallet</h3>
            <p className="text-gray-400 text-sm mb-3">Selected Wallet: {addresses[selectedWalletIndex]}</p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-400">Recipient Address</label>
                <input
                  type="text"
                  id="recipient"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter recipient address (e.g., 0x...)"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount (ETH)</label>
                <input
                  type="number"
                  id="amount"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="e.g., 0.01"
                  step="any"
                />
              </div>
              <button
                onClick={async () => {
                  setSendError(null);
                  setTransactionHash(null);
                  setIsSending(true);
                  try {
                    if (!mnemonic || mnemonic.length === 0) throw new Error("Mnemonic not found.");
                    if (!addresses[selectedWalletIndex]) throw new Error("Selected wallet address not found.");
                    if (!recipientAddress) throw new Error("Recipient address is required.");
                    if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) <= 0) throw new Error("Valid amount is required.");

                    // Re-derive the wallet for the selected index to get the private key for signing
                    const seed = await mnemonicToSeed(mnemonic);
                    const derivationPath = `m/44'/60'/${selectedWalletIndex}'/0'`;
                    const hdNode = HDNodeWallet.fromSeed(seed);
                    const child = hdNode.derivePath(derivationPath);
                    const privateKey = child.privateKey;
                    const wallet = new Wallet(privateKey, alchemyEth.provider); // Connect wallet to Alchemy provider

                    const tx = {
                      to: recipientAddress,
                      value: parseEther(sendAmount),
                      gasLimit: 21000, // Standard gas limit for simple ETH transfer
                    };

                    const gasPrice = await alchemyEth.core.getGasPrice();
                    tx.gasPrice = gasPrice;

                    console.log("Sending transaction:", tx);
                    const transactionResponse = await wallet.sendTransaction(tx);
                    console.log("Transaction sent:", transactionResponse);
                    await transactionResponse.wait(); // Wait for transaction to be mined
                    setTransactionHash(transactionResponse.hash);
                    setSendAmount(""); // Clear amount after sending
                    setRecipientAddress(""); // Clear recipient after sending
                    // Optionally, refetch balances to update UI
                    // You might want to call the fetchBalances function again here
                  } catch (error) {
                    console.error("Error sending transaction:", error);
                    setSendError(error.message || "Failed to send transaction.");
                  } finally {
                    setIsSending(false);
                  }
                }}
                className="w-full px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-green-600/80 to-green-800/80 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSending || !addresses || addresses.length === 0}
              >
                {isSending ? "Sending..." : "Send ETH"}
              </button>
              {transactionHash && (
                <p className="text-green-400 text-sm mt-2">Transaction successful! Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="underline">{transactionHash}</a></p>
              )}
              {sendError && (
                <p className="text-red-400 text-sm mt-2">Error: {sendError}</p>
              )}
            </div>
          </div>
        )}

        {addresses.map((address, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex-1">
              <span className="text-gray-400">Wallet {index}:</span>
              <span className="ml-2 font-mono break-all">{address}</span>
              <p className="text-gray-500 text-sm mt-1">
                Balance: {loadingBalances ? "Loading..." : `${balances[address] || "0.0"} ETH`}
              </p>
            </div>
            <button
              onClick={() => onDeleteKey(index)}
              className="ml-4 p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              title="Delete this address"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}