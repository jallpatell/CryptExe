import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Trash2 } from "lucide-react";
import { alchemySol } from '../lib/alchemy';

export default function SolanaWallet({ 
  mnemonic, 
  publicKeys, 
  setPublicKeys, 
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
    if (publicKeys && publicKeys.length > 0) {
      setLoadingBalances(true);
      const fetchBalances = async () => {
        const newBalances = {};
        for (const publicKey of publicKeys) {
          try {
            const balanceLamports = await alchemySol.getBalance(publicKey);
            newBalances[publicKey.toBase58()] = balanceLamports / LAMPORTS_PER_SOL;
          } catch (error) {
            console.error("Error fetching balance for public key ", publicKey.toBase58(), ":", error);
            newBalances[publicKey.toBase58()] = "Error";
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
  }, [publicKeys]);

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        className="block mx-auto px-6 py-3 bg-white/90 hover:bg-white text-black rounded-2xl mt-10 hover:scale-105 transition-all shadow-lg"
        onClick={async function() {
          try {
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, keypair.publicKey]);
          } catch (error) {
            console.error("Error adding Solana wallet:", error);
          }
        }}
      >
        Add Solana Wallet
      </button>

      <div className="mt-8 space-y-4">
        {publicKeys && publicKeys.length > 0 ? (
          <select
            className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            value={selectedWalletIndex}
            onChange={(e) => setSelectedWalletIndex(Number(e.target.value))}
          >
            {publicKeys.map((publicKey, idx) => (
              <option key={publicKey.toBase58()} value={idx}>
                Wallet {idx}: {publicKey.toBase58()} ({balances[publicKey.toBase58()] || "0.0"} SOL)
              </option>
            ))}
          </select>
        ) : null}

        {publicKeys && publicKeys.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Send SOL from Selected Wallet</h3>
            <p className="text-gray-400 text-sm mb-3">Selected Wallet: {publicKeys[selectedWalletIndex].toBase58()}</p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-400">Recipient Address</label>
                <input
                  type="text"
                  id="recipient"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter recipient address (e.g., A1bC...)"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount (SOL)</label>
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
                    if (!publicKeys[selectedWalletIndex]) throw new Error("Selected wallet address not found.");
                    if (!recipientAddress) throw new Error("Recipient address is required.");
                    if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) <= 0) throw new Error("Valid amount is required.");

                    // Derive the keypair for the selected index
                    const seed = await mnemonicToSeed(mnemonic);
                    const path = `m/44'/501'/${selectedWalletIndex}'/0'`;
                    const derivedSeed = derivePath(path, seed.toString("hex")).key;
                    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                    const fromKeypair = Keypair.fromSecretKey(secret);

                    const toPublicKey = new PublicKey(recipientAddress);
                    const amountLamports = parseFloat(sendAmount) * LAMPORTS_PER_SOL;

                    const transaction = new Transaction().add(
                      SystemProgram.transfer({
                        fromPubkey: fromKeypair.publicKey,
                        toPubkey: toPublicKey,
                        lamports: amountLamports,
                      })
                    );

                    // Get recent blockhash
                    const { blockhash } = await alchemySol.getRecentBlockhash();
                    transaction.recentBlockhash = blockhash;
                    transaction.feePayer = fromKeypair.publicKey;

                    // Sign transaction
                    transaction.sign(fromKeypair);

                    console.log("Sending transaction:", transaction);
                    const signature = await alchemySol.sendRawTransaction(transaction.serialize());
                    console.log("Transaction sent, signature:", signature);

                    await alchemySol.confirmTransaction(signature, 'confirmed'); // Wait for confirmation
                    setTransactionHash(signature);
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
                disabled={isSending || !publicKeys || publicKeys.length === 0}
              >
                {isSending ? "Sending..." : "Send SOL"}
              </button>
              {transactionHash && (
                <p className="text-green-400 text-sm mt-2">Transaction successful! Signature: <a href={`https://explorer.solana.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="underline">{transactionHash}</a></p>
              )}
              {sendError && (
                <p className="text-red-400 text-sm mt-2">Error: {sendError}</p>
              )}
            </div>
          </div>
        )}

        {publicKeys.map((publicKey, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex-1">
              <span className="text-gray-400">Wallet {index}:</span>
              <span className="ml-2 font-mono break-all">{publicKey.toBase58()}</span>
              <p className="text-gray-500 text-sm mt-1">
                Balance: {loadingBalances ? "Loading..." : `${balances[publicKey.toBase58()] || "0.0"} SOL`}
              </p>
            </div>
            <button
              onClick={() => onDeleteKey(index)}
              className="ml-4 p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              title="Delete this public key"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}