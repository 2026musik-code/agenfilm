'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user data to local storage for persistence
        localStorage.setItem('user', JSON.stringify(data.user));

        // Use Framer Motion for success animation if desired, but here just redirect
        setTimeout(() => {
             router.push('/profile');
        }, 500);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans flex flex-col justify-center items-center relative overflow-hidden">
      <Navbar />

      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl p-8 shadow-2xl relative z-10">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>

         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-luxury-gold/30">
                <Lock className="w-8 h-8 text-luxury-gold" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Enter your 6-digit PIN to access your account.</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] text-luxury-gold focus:border-luxury-gold outline-none transition-all placeholder-gray-700"
                    placeholder="------"
                    autoFocus
                />
            </div>

            {error && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading || pin.length < 6}
                className="w-full bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold py-3.5 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? 'Verifying...' : 'Login'} <ArrowRight size={18} className="ml-2" />
            </button>
         </form>

         <div className="mt-8 text-center pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
                Don&apos;t have an account? <Link href="/daftar" className="text-luxury-gold hover:underline font-medium">Register here</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
