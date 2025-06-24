import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Trash2 } from "lucide-react";

export default function SolanaWallet({ 
  mnemonic, 
  publicKeys, 
  setPublicKeys, 
  currentIndex, 
  setCurrentIndex,
  onDeleteKey 
}) {
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
        {publicKeys.map((publicKey, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex-1">
              <span className="text-gray-400">Wallet {index}:</span>
              <span className="ml-2 font-mono break-all">{publicKey.toBase58()}</span>
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