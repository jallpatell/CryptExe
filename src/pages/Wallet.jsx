import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import * as bip39 from 'bip39';
import SolanaWallet from "./Solanawallet";
import EthWallet from "./EthWallet";
import { Eye, EyeOff } from "lucide-react";
import Footer from "./Footer";
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { isAuthenticated, user, loading } = useAuth();

  const [mnemonic, setMnemonic] = useState([]);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [ethAddresses, setEthAddresses] = useState([]);
  const [solPublicKeys, setSolPublicKeys] = useState([]);
  const [ethCurrentIndex, setEthCurrentIndex] = useState(0);
  const [solCurrentIndex, setSolCurrentIndex] = useState(0);

  async function displayMn() {
    try {
      const mn = await bip39.generateMnemonic();
      const words = mn.split(" ");
      setMnemonic(words);
    } catch (err) {
      console.error("Error generating mnemonic:", err);
    }
  }

  function deleteMnemonic() {
    if (window.confirm("Are you sure you want to delete the seed phrase? This will delete all associated wallets.")) {
      setMnemonic([]);
      setEthAddresses([]);
      setSolPublicKeys([]);
      setEthCurrentIndex(0);
      setSolCurrentIndex(0);
      setSelectedChain('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col text-white">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow pt-28 px-4 pb-10">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-[#4e11ab] to-[#431e5e] bg-clip-text text-transparent">
          Manage Wallet
        </h1>

        <p className="text-gray-300 mt-6 text-xl text-center max-w-2xl mx-auto">
          Generate keys from seed phrase and manage your crypto assets
        </p>

        {mnemonic.length === 0 && (
          <button
            className="block mx-auto mt-12 px-6 py-3 bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:border-2 hover:border-white transition-all"
            onClick={displayMn}
          >
            Create Seed Phrase
          </button>
        )}

        {mnemonic.length > 0 && (
          <>
            <div className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Seed Phrase</h3>
                <button onClick={() => setIsMnemonicVisible(!isMnemonicVisible)} className="text-gray-400 hover:text-white">
                  {isMnemonicVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {mnemonic.map((word, index) => (
                  <div key={index} className="px-2 py-1 bg-gray-800 rounded-md text-center">
                    {index + 1}. {isMnemonicVisible ? word.toUpperCase() : '********'}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={deleteMnemonic}
              >
                Delete Seed Phrase
              </button>
            </div>

            <div className="text-center mt-8">
              <select
                onChange={(e) => setSelectedChain(e.target.value)}
                value={selectedChain}
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
              >
                <option value="" disabled>Select a Chain</option>
                <option value="eth">Ethereum</option>
                <option value="sol">Solana</option>
              </select>
            </div>

            <div className="mt-8 max-h-[60vh] overflow-y-auto px-4">
              {selectedChain === 'sol' && (
                <SolanaWallet
                  mnemonic={mnemonic.join(" ")}
                  publicKeys={solPublicKeys}
                  setPublicKeys={setSolPublicKeys}
                  currentIndex={solCurrentIndex}
                  setCurrentIndex={setSolCurrentIndex}
                />
              )}
              {selectedChain === 'eth' && (
                <EthWallet
                  mnemonic={mnemonic.join(" ")}
                  addresses={ethAddresses}
                  setAddresses={setEthAddresses}
                  currentIndex={ethCurrentIndex}
                  setCurrentIndex={setEthCurrentIndex}
                />
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
