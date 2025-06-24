import React, { useState } from 'react';
import { Chrome, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import Navbar from './Navbar';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/wallet');
    } catch (error) {
      console.error('Google authentication error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 text-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="mb-8">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#4e11ab] to-[#431e5e] bg-clip-text text-transparent mb-4">
                CRYPTeX
              </h1>
              <p className="text-gray-300 text-lg">
                Secure access to your multi-chain wallet
              </p>
            </div>

            <button
  type="button"
  onClick={handleGoogleAuth}
  disabled={isLoading}
  className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 group backdrop-blur-sm"
>
  {isLoading ? (
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
      <span>Authenticating...</span>
    </div>
  ) : (
    <>
      <Chrome className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
      <span>Authenticate with your Google Account</span>
    </>
  )}
</button>
          </div>

          <div className="mt-6 p-4 bg-gray-800/40 border border-gray-700 rounded-xl backdrop-blur-sm text-sm text-gray-300 flex items-center justify-center space-x-2 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>End-to-end encrypted security</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-6 text-center text-gray-500 text-sm">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}