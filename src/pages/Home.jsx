import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Globe, Lock, Smartphone, ArrowRight, Check, Star, Users, TrendingUp } from 'lucide-react';

import Navbar from './Navbar';

export default function CryptexLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-20">
          
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#210748] via-[#4e11ab] to-[#290c41] bg-clip-text text-transparent leading-tight">
            Your Gateway to the<br />
            <span className="bg-gradient-to-r from-[#4e11ab] to-[#6b21a8] bg-clip-text text-transparent">
              Decentralized Web
            </span>
          </h1>

          <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-#8f4ff0 font-bold px-3 py-1.5">
            🚀 Now Supporting Ethereum & Solana
          </Badge>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Effortlessly manage your Ethereum and Solana assets in one sleek, non-custodial wallet. 
            Fast, secure, and designed for the future of DeFi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center pt-8">
            <Button size="lg" className="bg-gradient-to-r from-[#4e11ab] to-[#4e11ab] hover:from-[#210748] hover:to-[#773bb3] text-lg px-8 py-4">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-purple-400 text-0.5xl font-bold text-[#6920a6] bg-[#210748] hover:bg-white hover:text-[#210748] px-8 py-4">
              developer - jallpatell
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className='font-extrabold'>1K+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className='font-extrabold'>$0 Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className='font-extrabold'>4.81/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why Choose CRYPTeX?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built for power users and beginners alike, with enterprise-grade security and consumer-friendly design.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Military-Grade Security</CardTitle>
              <CardDescription>
                Your private keys never leave your device. Multi-layer encryption and biometric protection keep your assets safe.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription>
                Execute transactions in seconds across Ethereum and Solana networks with optimized gas fees and MEV protection.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Multi-Chain Native</CardTitle>
              <CardDescription>
                Seamlessly switch between Ethereum and Solana ecosystems. Trade, stake, and interact with DApps across chains.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Non-Custodial</CardTitle>
              <CardDescription>
                You own your keys, you own your crypto. No third parties, no middlemen, no compromises on your financial sovereignty.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Cross-Platform</CardTitle>
              <CardDescription>
                Available on desktop, mobile, and as a browser extension. Your wallet syncs securely across all your devices.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Advanced Trading</CardTitle>
              <CardDescription>
                Built-in DEX aggregation, limit orders, and portfolio tracking. Professional trading tools in a simple interface.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-600/30">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Multi-Chain by Design</h2>
              <p className="text-xl text-gray-300">
                Access the best of both worlds with native support for Ethereum and Solana ecosystems
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">ETH</span>
                </div>
                <h3 className="text-2xl font-bold">Ethereum Network</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>ERC-20 Tokens</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>NFT Collections</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>DeFi Protocols</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>Layer 2 Solutions</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">SOL</span>
                </div>
                <h3 className="text-2xl font-bold">Solana Network</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>SPL Tokens</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>Solana NFTs</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>High-Speed Trading</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>Low Transaction Fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Take Control?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of thousands of users who trust CRYPTeX with their digital assets. 
              Your journey into DeFi starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                Download for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold">
                CX
              </div>
              <span className="text-lg font-bold">CRYPTeX</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CRYPTeX. Built for the decentralized future.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

