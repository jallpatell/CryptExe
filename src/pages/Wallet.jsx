import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import * as bip39 from 'bip39';
import SolanaWallet from "./Solanawallet";
import EthWallet from "./EthWallet";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import CryptoJS from 'crypto-js';
import { PublicKey } from "@solana/web3.js";

export default function Wallet() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [mnemonic, setMnemonic] = useState(null);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [ethAddresses, setEthAddresses] = useState(null);
  const [solPublicKeys, setSolPublicKeys] = useState(null);
  const [ethCurrentIndex, setEthCurrentIndex] = useState(0);
  const [solCurrentIndex, setSolCurrentIndex] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      console.log("AuthContext status in Wallet.jsx - Loading:", authLoading, "User:", user);
      if (authLoading || !user || !user.uid) {
        console.log("Skipping loadWalletData: authLoading is true or user is not available.", { authLoading, user });
        setMnemonic(null);
        setEthAddresses(null);
        setSolPublicKeys(null);
        setWalletLoading(true);
        return;
      }

      try {
        console.log("Attempting to load wallet data for user:", user.uid);
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
              decryptedMnemonic = [];
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
        setMnemonic([]);
        setEthAddresses([]);
        setSolPublicKeys([]);
        setEthCurrentIndex(0);
        setSolCurrentIndex(0);
        setSelectedChain('');
      } finally {
        setWalletLoading(false);
      }
    };
    setWalletLoading(true);
    loadWalletData();
  }, [user, authLoading]);

  useEffect(() => {
    const saveWalletData = async () => {
      console.log("Attempting to save wallet data...");
      if (user && user.uid && !authLoading && mnemonic !== null && ethAddresses !== null && solPublicKeys !== null) {
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
    
    if (user && !authLoading && mnemonic !== null && ethAddresses !== null && solPublicKeys !== null) {
      saveWalletData();
    }
    console.log("saveWalletData useEffect dependencies updated.");
  }, [mnemonic, ethAddresses, solPublicKeys, ethCurrentIndex, solCurrentIndex, selectedChain, user, authLoading]);

  async function displayMn() {
    try {
      const mn = await bip39.generateMnemonic();
      const words = mn.split(" ");
      setMnemonic(words);

      if (user && user.uid && !authLoading) {
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
    <div className="min-h-screen bg-[#121515] flex flex-col text-white">
      <Navbar />

      <main className="flex-grow pt-28 px-4 pb-10">
        <h1 className="text-7xl font-light text-center bg-blue-500 bg-clip-text text-transparent">
          Manage Wallet
          <p className="text-gray-300 font-mono mt-6 text-xl text-center max-w-2xl mx-auto">
            Generate keys from seed phrase and manage your crypto assets
          </p>
        </h1>
        
        <div>
        </div>
        {walletLoading ? (
          <p className="text-center text-lg mt-12">Loading wallet data...</p>
        ) : (
          <>
            {(mnemonic === null || mnemonic.length === 0) && (
              <button
                className="block mx-auto mt-12 px-6 py-3 bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:border-2 hover:border-white transition-all"
                onClick={displayMn}
              >
                Create Seed Phrase
              </button>
            )}

            {mnemonic !== null && mnemonic.length > 0 && (
              <>
                

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
                  {selectedChain === 'sol' && solPublicKeys !== null && (
                    <SolanaWallet
                      mnemonic={mnemonic.join(" ")}
                      publicKeys={solPublicKeys}
                      setPublicKeys={setSolPublicKeys}
                      currentIndex={solCurrentIndex}
                      setCurrentIndex={setSolCurrentIndex}
                      onDeleteKey={deleteSolPublicKey}
                    />
                  )}
                  {selectedChain === 'eth' && ethAddresses !== null && (
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}