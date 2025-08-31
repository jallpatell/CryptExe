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
            Effortlessly manage Ethereum and Solana assets in one sleek, non-custodial wallet.
            Fast, secure, and designed for <p className='font-extrabold'> The Future of DeFi.</p>
          </p>
          </div>
          <div className="flex-1 ml-10 mt-30 md:basis-[10%] flex justify-center">
            <LottieAnimation />
          </div>
        </section>

        <div className="font-mono flex font-extrabold text-blue-300 text-2xl ml-40">
            <div>Login with Google....   </div>
            <div>Create seed phrase....   </div>
            <div>Select network....  </div>
            <div>Start transacting....   </div>
        </div>

  
      {/* Footer */}
      <Footer />
    </div>
  );
}