import React, { useState } from 'react';
import { Chrome, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 pt-28 pb-10 text-white">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 shadow-2xl text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#4e11ab] to-[#431e5e] bg-clip-text text-transparent mb-4">
            Welcome to Cryptex
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            Connect your Google account to access your crypto wallets
          </p>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <Chrome className="h-5  w-5" />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-xl backdrop-blur-sm text-sm text-gray-300 flex items-center space-x-2">
          <Lock className="h-4 w-4 text-purple-400" />
          <span>Your login is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}
