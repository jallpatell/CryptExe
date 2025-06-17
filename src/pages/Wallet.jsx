import Navbar from "./Navbar"
import { useState } from "react"
import * as bip39 from 'bip39';
import SolanaWallet from "./Solanawallet";
import EthWallet from "./EthWallet";
import Key from "@/components/ui/key";


export default function Wallet() {
  const [mnemonic, setMnemonic] = useState([]);

  async function displayMn() {
    try {
      const mn = await bip39.generateMnemonic(); // fixed here
      const words = mn.split(" ");
      setMnemonic(words);
    } catch (err) {
      console.error("Error generating mnemonic:", err);
    }
  }

  return (
    <div className="min-h-screen h-full overscroll-none overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />

      {/* Hero */}  
      <div>
        <h1 className="font-extrabold mt-15 text-6xl text-center bg-gradient-to-r from-[#4e11ab] to-[#431e5e] bg-clip-text text-transparent">
          Manage Wallet
        </h1>
        <p className="text-gray-300 mt-10 text-3xl text-center ">
          Generate keys from seed phrase and manage your crypto assets
        </p>

        <button
          className="block mx-auto px-4 py-2 bg-white text-black rounded-2xl mt-20 hover:bg-black hover:text-white"
          onClick={displayMn} // <-- added onClick here
        >
          Create Seed Phrase
        </button>

        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {mnemonic.map((word, index) => (
            <div
              key={index}
              className="px-2 py-2 bg-gray-800 text-white rounded-md"
            >
              {index + 1}. {word.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-x-100">
          <SolanaWallet />
          <EthWallet />
        </div>
        
      </div>
    </div>
  );
}
