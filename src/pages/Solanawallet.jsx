import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Trash2, QrCode, Send, Wallet as WalletIcon } from "lucide-react";
import { alchemySol } from '../lib/alchemy';
import { QRCodeSVG } from "qrcode.react";

import getCryptoIcon from '/public/payment-method.png';
import sendCryptoIcon from '/public/transaction.png';
import viewBalanceIcon from '/public/cash.png';
import buyCryptoIcon from '/public/money.png';

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
  const [expandedWalletIndex, setExpandedWalletIndex] = useState(null); // State to manage expanded wallet card (for icons)
  const [activeSubSection, setActiveSubSection] = useState(null); // State to manage active sub-section within an expanded card

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

  const toggleExpand = (index) => {
    setExpandedWalletIndex(expandedWalletIndex === index ? null : index);
  };

  // Function to handle sending SOL
  const handleSendSol = async () => {
    setSendError(null);
    setTransactionHash(null);
    setIsSending(true);
    try {
      if (!mnemonic || mnemonic.length === 0) throw new Error("Mnemonic not found.");
      if (!publicKeys[selectedWalletIndex]) throw new Error("Selected wallet public key not found.");
      if (!recipientAddress) throw new Error("Recipient address is required.");
      if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) <= 0) throw new Error("Valid amount is required.");

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

      const { blockhash } = await alchemySol.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromKeypair.publicKey;
      transaction.sign(fromKeypair);

      console.log("Sending transaction:", transaction);
      const signature = await alchemySol.sendRawTransaction(transaction.serialize());
      console.log("Transaction sent, signature:", signature);

      await alchemySol.confirmTransaction(signature, 'confirmed');
      setTransactionHash(signature);
      setSendAmount("");
      setRecipientAddress("");
      // Refetch balances after successful send
      const updatedBalances = {};
      for (const publicKey of publicKeys) {
        const balanceLamports = await alchemySol.getBalance(publicKey);
        updatedBalances[publicKey.toBase58()] = balanceLamports / LAMPORTS_PER_SOL;
      }
      setBalances(updatedBalances);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setSendError(error.message || "Failed to send transaction.");
    } finally {
      setIsSending(false);
    }
  };

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
          // Removed the global select dropdown, now each card will have its own actions
          null
        ) : null}

        {/* Removed global send section, now each card will have its own send option */}
        {null}

        {publicKeys.map((publicKey, index) => {
          const isExpanded = expandedWalletIndex === index;
          const currentActiveSubSection = isExpanded ? activeSubSection : null; // Only show sub-section if card is expanded

          return (
            <div 
              key={publicKey.toBase58()} 
              className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
              onClick={() => {
                toggleExpand(index);
                setActiveSubSection(null); // Reset active sub-section when card is toggled
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-gray-400">Wallet {index}:</span>
                  <span className="ml-2 font-mono break-all text-white">{publicKey.toBase58()}</span>
                  {/* Balance removed from default view */}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteKey(index);
                  }}
                  className="ml-4 p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                  title="Delete this public key"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-700 pt-4 space-y-4">
                  <div className="flex justify-around items-center mb-4">
                    {/* Get Crypto Icon */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveSubSection(currentActiveSubSection === 'receive' ? null : 'receive'); }}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img src={getCryptoIcon} alt="Get Crypto" className="h-8 w-8" />
                      <span className="text-xs mt-1">Receive</span>
                    </button>

                    {/* Send Crypto Icon */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveSubSection(currentActiveSubSection === 'send' ? null : 'send'); }}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img src={sendCryptoIcon} alt="Send Crypto" className="h-8 w-8" />
                      <span className="text-xs mt-1">Send</span>
                    </button>

                    {/* View Balance Icon */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveSubSection(currentActiveSubSection === 'balance' ? null : 'balance'); }}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img src={viewBalanceIcon} alt="View Balance" className="h-8 w-8" />
                      <span className="text-xs mt-1">Balance</span>
                    </button>

                    {/* Buy Crypto Icon */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveSubSection(currentActiveSubSection === 'buy' ? null : 'buy'); }}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img src={buyCryptoIcon} alt="Buy Crypto" className="h-8 w-8" />
                      <span className="text-xs mt-1">Buy</span>
                    </button>
                  </div>

                  {currentActiveSubSection === 'receive' && (
                    <div className="text-center bg-gray-700/50 p-4 rounded-md">
                      <p className="text-sm text-gray-400 mb-2">Scan QR to receive SOL</p>
                      <div className="flex justify-center">
                        <QRCodeSVG
                          value={publicKey.toBase58()}
                          size={128}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                      <p className="font-mono break-all text-sm mt-2">{publicKey.toBase58()}</p>
                    </div>
                  )}

                  {currentActiveSubSection === 'send' && (
                    <div className="space-y-3 p-4 bg-gray-700/50 rounded-md">
                      <div>
                        <label htmlFor={`recipient-${index}`} className="block text-sm font-medium text-gray-400">Recipient Address</label>
                        <input
                          type="text"
                          id={`recipient-${index}`}
                          className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          placeholder="Enter recipient address (e.g., A1bC...)"
                        />
                      </div>
                      <div>
                        <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-400">Amount (SOL)</label>
                        <input
                          type="number"
                          id={`amount-${index}`}
                          className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          placeholder="e.g., 0.01"
                          step="any"
                        />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSendSol(); }}
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
                  )}

                  {currentActiveSubSection === 'balance' && (
                    <div className="flex items-center space-x-2 mt-6">
                      <img src={viewBalanceIcon} alt="View Balance" className="h-6 w-6" />
                      <h4 className="text-lg font-semibold">Current Balance</h4>
                      <p className="text-gray-500 text-sm">
                        {loadingBalances ? "Loading..." : `${balances[publicKey.toBase58()] || "0.0"} SOL`}
                      </p>
                    </div>
                  )}

                  {currentActiveSubSection === 'buy' && (
                    <div className="mt-6 p-4 bg-gray-700/50 rounded-md">
                      <h4 className="text-lg font-semibold mb-3">Buy SOL</h4>
                      <p className="text-gray-400 text-sm">Payment gateway integration coming soon...</p>
                      {/* Placeholder for payment gateway widget */}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}