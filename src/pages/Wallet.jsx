import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import * as bip39 from 'bip39';
import SolanaWallet from "./Solanawallet";
import EthWallet from "./EthWallet";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import Footer from "./Footer";
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import { PublicKey } from "@solana/web3.js";

export default function Wallet() {
  const { isAuthenticated, user, loading } = useAuth();

  const [mnemonic, setMnemonic] = useState([]);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [ethAddresses, setEthAddresses] = useState([]);
  const [solPublicKeys, setSolPublicKeys] = useState([]);
  const [ethCurrentIndex, setEthCurrentIndex] = useState(0);
  const [solCurrentIndex, setSolCurrentIndex] = useState(0);

  useEffect(() => {
    const loadWalletData = async () => {
      if (loading || !user || !user.uid) return;

      try {
        const userDocRef = doc(db, "userWallets", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let decryptedMnemonic = [];
          if (data.encryptedMnemonic) {
            try {
              const bytes = CryptoJS.AES.decrypt(data.encryptedMnemonic, user.uid);
              const originalText = bytes.toString(CryptoJS.enc.Utf8);
              decryptedMnemonic = JSON.parse(originalText);
            } catch (decryptError) {
              console.error("Error decrypting mnemonic:", decryptError);
            }
          }
          setMnemonic(decryptedMnemonic);
          setEthAddresses(data.ethAddresses || []);
          setSolPublicKeys(data.solPublicKeys ? data.solPublicKeys.map(pkStr => new PublicKey(pkStr)) : []);
          setEthCurrentIndex(data.ethCurrentIndex || 0);
          setSolCurrentIndex(data.solCurrentIndex || 0);
          setSelectedChain(data.selectedChain || '');
        } else {
          setMnemonic([]);
          setEthAddresses([]);
          setSolPublicKeys([]);
          setEthCurrentIndex(0);
          setSolCurrentIndex(0);
          setSelectedChain('');
        }
      } catch (error) {
        console.error("Error loading wallet data:", error);
      }
    };
    loadWalletData();
  }, [user, loading]);

  useEffect(() => {
    const saveWalletData = async () => {
      if (user && user.uid && !loading) {
        try {
          let encryptedMnemonic = '';
          if (mnemonic.length > 0) {
            encryptedMnemonic = CryptoJS.AES.encrypt(JSON.stringify(mnemonic), user.uid).toString();
          }

          const solPublicKeysForFirestore = solPublicKeys.map(pk => pk.toBase58());

          const walletData = {
            encryptedMnemonic: encryptedMnemonic,
            ethAddresses: ethAddresses,
            solPublicKeys: solPublicKeysForFirestore,
            ethCurrentIndex: ethCurrentIndex,
            solCurrentIndex: solCurrentIndex,
            selectedChain: selectedChain,
          };
          await setDoc(doc(db, "userWallets", user.uid), walletData, { merge: true });
        } catch (error) {
          console.error("Error saving wallet data:", error);
        }
      }
    };
    
    if (user && !loading) {
      saveWalletData();
    }
  }, [mnemonic, ethAddresses, solPublicKeys, ethCurrentIndex, solCurrentIndex, selectedChain, user, loading]);

  async function displayMn() {
    try {
      const mn = await bip39.generateMnemonic();
      const words = mn.split(" ");
      setMnemonic(words);

      // Explicitly save mnemonic to Firestore immediately after generation
      if (user && user.uid && !loading) {
        const encryptedMnemonic = CryptoJS.AES.encrypt(JSON.stringify(words), user.uid).toString();
        await setDoc(doc(db, "userWallets", user.uid), { encryptedMnemonic: encryptedMnemonic }, { merge: true });
        console.log("Mnemonic saved to Firestore immediately after generation.");
      }

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
      
      if (user && user.uid) {
        try {
          deleteDoc(doc(db, "userWallets", user.uid));
        } catch (error) {
          console.error("Error deleting wallet data:", error);
        }
      }
    }
  }

  const deleteEthAddress = (index) => {
    if (window.confirm("Are you sure you want to delete this Ethereum address?")) {
      const newAddresses = [...ethAddresses];
      newAddresses.splice(index, 1);
      setEthAddresses(newAddresses);
      if (ethCurrentIndex >= newAddresses.length) {
        setEthCurrentIndex(Math.max(0, newAddresses.length - 1));
      }
    }
  };

  const deleteSolPublicKey = (index) => {
    if (window.confirm("Are you sure you want to delete this Solana public key?")) {
      const newPublicKeys = [...solPublicKeys];
      newPublicKeys.splice(index, 1);
      setSolPublicKeys(newPublicKeys);
      if (solCurrentIndex >= newPublicKeys.length) {
        setSolCurrentIndex(Math.max(0, newPublicKeys.length - 1));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col text-white">
      <Navbar />

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
            <div className="max-w-md mx-auto mt-10 bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Seed Phrase</h3>
                <button 
                  onClick={() => setIsMnemonicVisible(!isMnemonicVisible)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMnemonicVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {mnemonic.map((word, index) => (
                  <div key={index} className="px-2 py-1 bg-gray-800/50 rounded-md text-center border border-gray-700">
                    {index + 1}. {isMnemonicVisible ? word.toUpperCase() : '********'}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="px-5 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2 mx-auto"
                onClick={deleteMnemonic}
              >
                <Trash2 size={18} /> Delete Seed Phrase
              </button>
            </div>

            <div className="text-center mt-8">
              <select
                onChange={(e) => setSelectedChain(e.target.value)}
                value={selectedChain}
                className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  onDeleteKey={deleteSolPublicKey}
                />
              )}
              {selectedChain === 'eth' && (
                <EthWallet
                  mnemonic={mnemonic.join(" ")}
                  addresses={ethAddresses}
                  setAddresses={setEthAddresses}
                  currentIndex={ethCurrentIndex}
                  setCurrentIndex={setEthCurrentIndex}
                  onDeleteKey={deleteEthAddress}
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