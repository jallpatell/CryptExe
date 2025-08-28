import { useState, useEffect } from 'react';
import { ChevronDown, ArrowDown, ArrowUp, Clock, Hash, Wallet, HardDrive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Transactions() {
  const { user } = useAuth();
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [walletData, setWalletData] = useState({ ethAddresses: [], solPublicKeys: [] });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's actual wallet data from Firestore
  useEffect(() => {
    const fetchWalletData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "userWallets", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWalletData({
            ethAddresses: data.ethAddresses || [],
            solPublicKeys: (data.solPublicKeys || []).map(pk => typeof pk === 'string' ? pk : pk.toBase58())
          });
        }
      }
    };
    fetchWalletData();
  }, [user]);

  // Mock transaction data - replace with your actual data fetching logic
  useEffect(() => {
    if (selectedChain && selectedKey) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockTransactions = generateMockTransactions(selectedKey, selectedChain);
        setTransactions(mockTransactions);
        setIsLoading(false);
      }, 800);
    } else {
      setTransactions([]);
    }
  }, [selectedChain, selectedKey]);

  const generateMockTransactions = (address, chain) => {
    const count = Math.floor(Math.random() * 8) + 3; // 3-10 transactions
    const chains = {
      eth: 'Ethereum',
      sol: 'Solana'
    };
    const protocols = {
      eth: ['Uniswap', 'Aave', 'Lido', 'OpenSea', 'Coinbase'],
      sol: ['Raydium', 'Jupiter', 'Marinade', 'Magic Eden', 'Orca']
    };
    
    return Array.from({ length: count }).map((_, i) => {
      const isIncoming = Math.random() > 0.3;
      const amount = Math.random() * 5 + 0.1;
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      return {
        id: `${address.slice(-4)}-${i}-${Date.now()}`,
        type: isIncoming ? 'incoming' : 'outgoing',
        amount: parseFloat(amount.toFixed(4)),
        currency: chain === 'eth' ? 'ETH' : 'SOL',
        value: parseFloat((amount * (chain === 'eth' ? 3200 : 120)).toFixed(2)),
        from: isIncoming ? `${protocols[chain][Math.floor(Math.random() * protocols[chain].length)]}` : 'My Wallet',
        to: isIncoming ? 'My Wallet' : `${protocols[chain][Math.floor(Math.random() * protocols[chain].length)]}`,
        timestamp,
        chain: chains[chain],
        status: ['completed', 'completed', 'pending'][Math.floor(Math.random() * 3)]
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#121515] flex flex-col text-white">
      <Navbar />
      <main className="flex-grow pt-28 px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-light text-center bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-8">
            Transaction History
          </h1>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <label className="block text-sm text-gray-400 mb-1">Select Chain</label>
                <select
                  value={selectedChain}
                  onChange={(e) => {
                    setSelectedChain(e.target.value);
                    setSelectedKey('');
                  }}
                  className="w-full bg-gray-800/30 border border-gray-600/50 rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-purple-400 hover:border-gray-500 transition-colors text-sm"
                >
                  <option value="">Select Chain</option>
                  <option value="eth">Ethereum</option>
                  <option value="sol">Solana</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm text-gray-400 mb-1">Select Wallet</label>
                <select
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  disabled={!selectedChain}
                  className={`w-full bg-gray-800/30 border ${selectedChain ? 'border-gray-600/50 hover:border-gray-500' : 'border-gray-700/50 cursor-not-allowed'} rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-purple-400 transition-colors text-sm`}
                >
                  <option value="">Select Wallet</option>
                  {selectedChain === 'eth' && walletData.ethAddresses.map((address) => (
                    <option key={address} value={address}>{address.slice(0, 6)}...{address.slice(-4)}</option>
                  ))}
                  {selectedChain === 'sol' && walletData.solPublicKeys.map((pubKey) => (
                    <option key={pubKey} value={pubKey}>{pubKey.slice(0, 6)}...{pubKey.slice(-4)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            {isLoading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-purple-500/20 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left">
                      <th className="py-4 pl-6">Type</th>
                      <th className="py-4">Amount</th>
                      <th className="py-4">Value</th>
                      <th className="py-4">From/To</th>
                      <th className="py-4">Date</th>
                      <th className="py-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors last:border-0">
                        <td className="py-4 pl-6">
                          <div className={`flex items-center ${tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'incoming' ? (
                              <ArrowDown className="mr-2" size={16} />
                            ) : (
                              <ArrowUp className="mr-2" size={16} />
                            )}
                            {tx.type === 'incoming' ? 'Receive' : 'Send'}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium">
                            {tx.amount} {tx.currency}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-gray-300">${tx.value}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm">
                            <div className="text-gray-400">{tx.type === 'incoming' ? 'From:' : 'To:'}</div>
                            <div>{tx.type === 'incoming' ? tx.from : tx.to}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <Clock className="mr-1" size={14} />
                            {formatDate(tx.timestamp)}
                          </div>
                        </td>
                        <td className="py-4 pr-6">
                          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                            tx.status === 'completed' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {tx.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedChain && selectedKey ? (
              <div className="text-center py-12">
                <div className="text-purple-400 flex items-center justify-center mb-4">
                  <Hash className="mr-2" />
                  No transactions found
                </div>
                <p className="text-gray-400">This wallet has no transaction history yet</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">Select a chain and wallet to view transactions</div>
                <div className="text-blue-400 flex items-center justify-center">
                  <Wallet className="mr-2" />
                  No wallet selected
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}