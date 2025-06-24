import { useState, useEffect } from 'react';
import { ChevronDown, PieChart, Wallet, HardDrive, BarChart2 } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from './Navbar';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [portfolioData, setPortfolioData] = useState(null);

  // Mock data
  const mockPortfolioData = {
    eth: {
      '0x123...abc': {
        networth: 2845.67,
        protocols: {
          wallet: 42.3,
          'Aave v3': 35.8,
          'KelpDAO': 12.5,
          NFTs: 9.4
        }
      }
    },
    sol: {
      '8yhg...123': {
        networth: 5231.89,
        protocols: {
          wallet: 31.2,
          'Marinade': 42.7,
          'Jito': 18.4,
          NFTs: 7.7
        }
      }
    }
  };

  useEffect(() => {
    if (selectedChain && selectedKey) {
      setPortfolioData(mockPortfolioData[selectedChain][selectedKey]);
    } else {
      setPortfolioData(null);
    }
  }, [selectedChain, selectedKey]);

  // Prepare data for donut chart
  const getChartData = () => {
    if (!portfolioData) return null;
    
    const protocolNames = Object.keys(portfolioData.protocols);
    const protocolValues = Object.values(portfolioData.protocols);
    const colors = [
      'rgba(78, 17, 171, 0.8)',  // Purple
      'rgba(125, 71, 221, 0.8)',  // Lighter purple
      'rgba(67, 30, 94, 0.8)',    // Dark purple
      'rgba(156, 39, 176, 0.8)',  // Pinkish purple
      'rgba(103, 58, 183, 0.8)'   // Medium purple
    ];

    return {
      labels: protocolNames,
      datasets: [{
        data: protocolValues,
        backgroundColor: colors.slice(0, protocolNames.length),
        borderColor: 'rgba(30, 30, 30, 0.3)',
        borderWidth: 1,
        cutout: '70%',
        radius: '90%'
      }]
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#E2E8F0',
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% ($${((portfolioData.networth * value) / 100).toFixed(2)})`;
          }
        },
        displayColors: true,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleColor: '#E2E8F0',
        bodyColor: '#E2E8F0',
        borderColor: 'rgba(78, 17, 171, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    maintainAspectRatio: false
  };

  const protocolEntries = portfolioData 
    ? Object.entries(portfolioData.protocols).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <Navbar />
      <div className="max-w-7xl mt-17 mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4e11ab] to-[#431e5e] bg-clip-text text-transparent mb-2">
          Portfolio Overview
        </h1>
        <p className="text-gray-400 mb-8">Track your assets across all protocols</p>

        {/* Chain and Key Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <select
              value={selectedChain}
              onChange={(e) => {
                setSelectedChain(e.target.value);
                setSelectedKey('');
              }}
              className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-gray-600 transition-colors"
            >
              <option value="">Select Chain</option>
              <option value="eth">Ethereum</option>
              <option value="sol">Solana</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={18} />
          </div>

          <div className="relative flex-1">
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              disabled={!selectedChain}
              className={`w-full bg-gray-900/50 backdrop-blur-sm border ${selectedChain ? 'border-gray-700 hover:border-gray-600' : 'border-gray-800 cursor-not-allowed'} rounded-xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
            >
              <option value="">Select Wallet</option>
              {selectedChain && Object.keys(mockPortfolioData[selectedChain]).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        {portfolioData ? (
          <>
            {/* Networth and Protocol Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Networth Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center mb-4">
                  <Wallet className="text-purple-400 mr-2" />
                  <h3 className="text-xl font-semibold">Net Worth</h3>
                </div>
                <div className="text-4xl font-bold mb-2">
                  ${portfolioData.networth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-green-400 flex items-center">
                  <BarChart2 className="mr-1" size={16} />
                  +2.4% (24h)
                </div>
              </div>

              {/* Protocol Allocation Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center mb-4">
                  <PieChart className="text-purple-400 mr-2" />
                  <h3 className="text-xl font-semibold">Protocol Allocation</h3>
                </div>
                <div className="h-64 relative">
                  {getChartData() && (
                    <Doughnut 
                      data={getChartData()} 
                      options={chartOptions}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        ${portfolioData.networth.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-gray-400">Total Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Breakdown Table */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <HardDrive className="text-purple-400 mr-2" />
                Protocol Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Share</th>
                      <th className="pb-3 pr-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protocolEntries.map(([protocol, percent]) => (
                      <tr key={protocol} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 pl-2 font-medium">{protocol}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mr-3">
                              <div 
                                className="bg-purple-500 h-2.5 rounded-full" 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">{percent}%</span>
                          </div>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          ${((portfolioData.networth * percent) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-4">Select a chain and wallet to view portfolio</div>
            <div className="text-purple-400 flex items-center justify-center">
              <Wallet className="mr-2" />
              No wallet selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}