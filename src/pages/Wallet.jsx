import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import * as bip39 from 'bip39';
import SolanaWallet from "./Solanawallet";
import EthWallet from "./EthWallet";
import { Eye, EyeOff } from "lucide-react";
import Footer from "./Footer";
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase'; // Import db
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; // Import Firestore functions
import CryptoJS from 'crypto-js'; // Import CryptoJS
import { PublicKey } from "@solana/web3.js"; // Import PublicKey

export default function Wallet() {
  const { isAuthenticated, user, loading } = useAuth();

  const [mnemonic, setMnemonic] = useState([]);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [ethAddresses, setEthAddresses] = useState([]);
  const [solPublicKeys, setSolPublicKeys] = useState([]);
  const [ethCurrentIndex, setEthCurrentIndex] = useState(0);
  const [solCurrentIndex, setSolCurrentIndex] = useState(0);

  // Effect to load wallet data from Firestore when user changes or mounts
  useEffect(() => {
    const loadWalletData = async () => {
      console.log("LOAD: Initiating load wallet data function.");
      console.log("LOAD: Current user state - user:", user, "loading:", loading);

      if (loading) {
        console.log("LOAD: Still loading authentication state. Returning.");
        return;
      }

      if (user && user.uid) {
        console.log(`LOAD: Authenticated user found. Attempting to load data for UID: ${user.uid}`);
        try {
          const userDocRef = doc(db, "userWallets", user.uid);
          console.log(`LOAD: Fetching document from Firestore: userWallets/${user.uid}`);
          const docSnap = await getDoc(userDocRef);
          console.log(`LOAD: Document snapshot received. Exists: ${docSnap.exists()}`);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("LOAD: Raw data from Firestore:", data);
            let decryptedMnemonic = [];
            if (data.encryptedMnemonic) {
              try {
                const bytes = CryptoJS.AES.decrypt(data.encryptedMnemonic, user.uid);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                decryptedMnemonic = JSON.parse(originalText);
                console.log("LOAD: Mnemonic decrypted successfully.");
              } catch (decryptError) {
                console.error("LOAD: Error decrypting mnemonic:", decryptError);
                // Optionally, clear corrupted data or show error to user
              }
            }
            setMnemonic(decryptedMnemonic);
            setEthAddresses(data.ethAddresses || []);
            // Convert string public keys back to PublicKey objects on load
            setSolPublicKeys(data.solPublicKeys ? data.solPublicKeys.map(pkStr => new PublicKey(pkStr)) : []);
            setEthCurrentIndex(data.ethCurrentIndex || 0);
            setSolCurrentIndex(data.solCurrentIndex || 0);
            setSelectedChain(data.selectedChain || '');
            console.log("LOAD: Wallet state updated from Firestore data.");
          } else {
            console.log("LOAD: User wallet document does not exist in Firestore. Resetting local state.");
            // Document does not exist, reset state for new user or no existing data
            setMnemonic([]);
            setEthAddresses([]);
            setSolPublicKeys([]);
            setEthCurrentIndex(0);
            setSolCurrentIndex(0);
            setSelectedChain('');
          }
        } catch (error) {
          console.error("LOAD: Error loading wallet data from Firestore:", error);
          // Handle error, e.g., show a message to the user
        }
      } else {
        console.log("LOAD: No authenticated user. Clearing local wallet state.");
        // No authenticated user, clear state
        setMnemonic([]);
        setEthAddresses([]);
        setSolPublicKeys([]);
        setEthCurrentIndex(0);
        setSolCurrentIndex(0);
        setSelectedChain('');
      }
    };
    loadWalletData();
  }, [user, loading]);

  // Effect to save wallet data to Firestore whenever state changes
  useEffect(() => {
    const saveWalletData = async () => {
      console.log("SAVE: Initiating save wallet data function.");
      console.log("SAVE: Current user state - user:", user, "loading:", loading);
      if (user && user.uid && !loading) {
        console.log(`SAVE: Authenticated user found. Attempting to save data for UID: ${user.uid}`);
        try {
          let encryptedMnemonic = '';
          if (mnemonic.length > 0) {
            encryptedMnemonic = CryptoJS.AES.encrypt(JSON.stringify(mnemonic), user.uid).toString();
            console.log("SAVE: Mnemonic encrypted.");
          }

          // Convert PublicKey objects to base58 strings for Firestore storage
          const solPublicKeysForFirestore = solPublicKeys.map(pk => pk.toBase58());
          console.log("SAVE: Solana Public Keys converted to base58 strings.");

          const walletData = {
            encryptedMnemonic: encryptedMnemonic,
            ethAddresses: ethAddresses,
            solPublicKeys: solPublicKeysForFirestore,
            ethCurrentIndex: ethCurrentIndex,
            solCurrentIndex: solCurrentIndex,
            selectedChain: selectedChain,
          };
          console.log("SAVE: Data prepared for Firestore:", walletData);
          await setDoc(doc(db, "userWallets", user.uid), walletData, { merge: true });
          console.log("SAVE: Wallet data successfully saved to Firestore!");
        } catch (error) {
          console.error("SAVE: Error saving wallet data to Firestore:", error);
        }
      } else {
        console.log("SAVE: No authenticated user or still loading. Not saving.");
      }
    };
    // Only save if mnemonic is not empty or if it was just cleared (empty array)
    // This prevents saving an empty state on initial load before any mnemonic is generated.
    if (user && !loading && (mnemonic.length > 0 || ethAddresses.length > 0 || solPublicKeys.length > 0 || ethCurrentIndex > 0 || solCurrentIndex > 0 || selectedChain !== '')) {
        saveWalletData();
    } else if (user && !loading && mnemonic.length === 0 && ethAddresses.length === 0 && solPublicKeys.length === 0 && ethCurrentIndex === 0 && solCurrentIndex === 0 && selectedChain === '') {
        // This case handles when all data has been intentionally cleared by the user (e.g., delete mnemonic)
        // We still want to persist this empty state to Firestore.
        saveWalletData();
    }
  }, [mnemonic, ethAddresses, solPublicKeys, ethCurrentIndex, solCurrentIndex, selectedChain, user, loading]);

  async function displayMn() {
    try {
      const mn = await bip39.generateMnemonic();
      const words = mn.split(" ");
      setMnemonic(words);
      console.log("Mnemonic generated and set.");
    } catch (err) {
      console.error("DISPLAY_MN: Error generating mnemonic:", err);
    }
  }

  function deleteMnemonic() {
    if (window.confirm("Are you sure you want to delete the seed phrase? This will delete all associated wallets.")) {
      console.log("DELETE: User confirmed deletion. Clearing local state.");
      setMnemonic([]);
      setEthAddresses([]);
      setSolPublicKeys([]);
      setEthCurrentIndex(0);
      setSolCurrentIndex(0);
      setSelectedChain('');
      
      // Clear from Firestore as well
      if (user && user.uid) {
        console.log(`DELETE: Attempting to delete wallet document for UID: ${user.uid}`);
        try {
          deleteDoc(doc(db, "userWallets", user.uid));
          console.log("DELETE: Wallet data successfully deleted from Firestore!");
        } catch (error) {
          console.error("DELETE: Error deleting wallet data from Firestore:", error);
        }
      } else {
        console.log("DELETE: No authenticated user. Only local state cleared.");
      }
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
