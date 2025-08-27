import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Globe, Lock, Smartphone, ArrowRight, Check, Star, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LottieAnimation from '@/components/ui/Lottie';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CryptexLanding() {
  const { login } = useAuth();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#121515] text-white overflow-y-auto overflow-x-hidden">
        <Navbar />
        <section className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 py-20 pt-[80px] items-center gap-10">
        <div className="flex-1 md:basis-[80%] mt-25 text-center md:text-left space-y-8">
          <h1 className="text-5xl font-sans md:text-7xl font-extralight bg-gradient-to-r from-blue-500 via-blue-300   to-blue-500 bg-clip-text text-transparent leading-tight">
              Gateway to <br />
            <span className="bg-gradient-to-r font-light from-blue-500 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              The Decentralized Web
            </span>
          </h1>
          <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 border-blue-950 border-1 font-medium px-3 py-1.5">
            🚀 Supporting Ethereum & Solana
          </Badge>
          <p className="text-xl font-extralight font-mono md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Effortlessly manage your Ethereum and Solana assets in one sleek, non-custodial wallet. 
            Fast, secure, and designed for the future of DeFi.
          </p>
          </div>
          <div className="flex-1 ml-10 mt-30 md:basis-[10%] flex justify-center">
            <LottieAnimation />
          </div>
        </section>



      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white font-extrabold mb-6 hover:bg-gradient-to-r hover:text-[#9d66ef] bg-clip-text leading-tight">Why Choose CRYPTeX?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built for power users and beginners alike, with enterprise-grade security and consumer-friendly design.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
  {/* Row 1 */}
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#f5424e] to-[#f5424e] rounded-lg flex items-center justify-center">
        <Lock className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">Google Account Integration</CardTitle>
        <CardDescription>
          Securely connect your wallet to your Google account for easy access and recovery.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
  
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#5a9cde] to-[#5a9cde] rounded-lg flex items-center justify-center">
        <Zap className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">Lightning Fast</CardTitle>
        <CardDescription>
          Execute transactions in seconds across networks with optimized gas fees and MEV protection.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
  
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#8de18d] to-[#8de18d] rounded-lg flex items-center justify-center">
        <Globe className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">Multi-Chain Native</CardTitle>
        <CardDescription>
          Seamlessly switch between Ethereum and Solana ecosystems. Trade and interact with DApps.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>

  {/* Row 2 */}
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#d97dd2] to-[#d97dd2] rounded-lg flex items-center justify-center">
        <Lock className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">Non-Custodial</CardTitle>
        <CardDescription>
          You own your keys, you own your crypto. No third parties, no middlemen.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
  
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#34d5d3] to-[#34d5d3] rounded-lg flex items-center justify-center">
        <Smartphone className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">Cross-Platform</CardTitle>
        <CardDescription>
          Available on desktop, mobile, and browser extension. Syncs across all devices.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>

  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-white-600/50 transition-all duration-300 hover:scale-105 h-full">
    <CardHeader className="flex flex-col items-start gap-4 h-full">
      <div className="w-12 h-12 bg-gradient-to-r from-[#f5b507] to-[#f5b507] rounded-lg flex items-center justify-center">
        <Zap className="h-6 w-6" />
      </div>
      <div>
        <CardTitle className="text-white">How It Works</CardTitle>
        <CardDescription>
          <ol className="list-decimal list-inside space-y-1 text-left">
            <li>Login with Google</li>
            <li>Create seed phrase</li>
            <li>Select network</li>
            <li>Start transacting</li>
          </ol>
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
</div>


        
      </section>

      

      {/* Supported Networks */}
      <section className="flex-grow max-w-7xl mx-auto px-6 py-16"> {/* Reduced py-20 to py-16 */}
  <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
    <CardContent className="p-16"> {/* Reduced p-20 to p-16 */}
      <div className="text-center mb-9"> {/* Reduced mb-12 to mb-9 */}
        <h2 className="text-4xl font-extrabold bg-gradient-to-r text-white leading-tight"> {/* Reduced text-5xl to text-4xl */}
          Multi-Chain by Design
        </h2>
        <p className="text-2xl text-gray-300"> {/* Reduced text-3xl to text-2xl */}
          Access the best of both worlds with native support for Ethereum and Solana ecosystems
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-9"> {/* Reduced gap-12 to gap-9 */}
        <div className="text-center space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto"> {/* Reduced w-25/h-25 to w-20/h-20 */}
            <img src='/eth_logo.webp' className='hover:shadow-[0px_0px_45px_0px_rgba(140,46,255,0.8)]' /> {/* Reduced shadow size and intensity */}
          </div>
          <h3 className="text-xl text-white font-bold"> {/* Reduced text-2xl to text-xl */}
            Ethereum Network
          </h3>
          <ul className="space-y-2 text-gray-300"> {/* Reduced space-y-3 to space-y-2 */}
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
            {/* Other list items with same adjustments */}
          </ul>
        </div>
        
        <div className="text-center space-y-4"> {/* Same reductions as first column */}
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto">
            <img src='/sol_logo.jpg' className='hover:shadow-[0px_0px_45px_0px_rgba(140,46,255,0.8)]' />
          </div>
          <h3 className="text-xl text-white font-bold">
            Solana Network
          </h3>
          <ul className="space-y-2 text-gray-300">
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
            {/* Other list items with same adjustments */}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
</section>

      {/* CTA Section */}
      <section className="flex-grow max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">Ready to Take Control?</h2>
            <p className="text-xl text-white mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of thousands of users who trust CRYPTeX with their digital assets. 
              Your journey into DeFi starts here.
            </p>
          </CardContent>
        </Card>


        <div className="flex flex-col mt-10 sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" onClick={() => window.open('https://github.com/jallpatell', '_blank')} className="bg-gray-800 text-white font-extrabold hover:border-[#4e11ab] hover:border-2 hover:bg-white hover:text-black text-lg px-8 py-4">
                About Me
              </Button>
            </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}