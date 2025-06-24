import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Trash2 } from "lucide-react";

export default function EthWallet({ 
  mnemonic, 
  addresses, 
  setAddresses, 
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
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
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
        {addresses.map((address, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex-1">
              <span className="text-gray-400">Wallet {index}:</span>
              <span className="ml-2 font-mono break-all">{address}</span>
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