'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { LogOut, User as UserIcon, Lock, CheckCircle, Mail, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-32 flex justify-center items-start min-h-[80vh]">
        <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

           {/* Decorative Header */}
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-yellow-900/20 via-luxury-gold/20 to-yellow-900/20 z-0 border-b border-luxury-gold/20"></div>

           <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end -mt-10 md:-mt-10 mb-8 space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 rounded-full border-4 border-luxury-black bg-black shadow-xl overflow-hidden relative">
                    {user.logo ? (
                        <Image
                            src={user.logo}
                            alt={user.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <UserIcon size={48} className="text-gray-500" />
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left pb-2 flex-1">
                    <h1 className="text-3xl font-bold font-serif text-white">{user.name}</h1>
                    <p className="text-luxury-gold font-medium uppercase text-xs tracking-wider flex items-center justify-center md:justify-start">
                        <CheckCircle size={12} className="mr-1" /> Premium Member
                    </p>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        router.push('/login');
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                >
                    <LogOut size={16} className="mr-2" /> Logout
                </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                {/* Account Details */}
                <div className="bg-black/40 border border-gray-800 rounded-xl p-6 hover:border-luxury-gold/30 transition-colors group">
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center">
                        <Mail size={14} className="mr-2 text-luxury-gold" /> Account Email
                    </h3>
                    <p className="text-lg text-white font-medium group-hover:text-luxury-gold transition-colors">{user.email}</p>
                </div>

                {/* Secure PIN */}
                <div className="bg-black/40 border border-gray-800 rounded-xl p-6 hover:border-luxury-gold/30 transition-colors group">
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center">
                        <Lock size={14} className="mr-2 text-luxury-gold" /> Secure PIN
                    </h3>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-mono text-luxury-gold tracking-[0.2em] font-bold group-hover:text-white transition-colors blur-[2px] hover:blur-0 cursor-pointer select-none" title="Hover to reveal">
                            {user.pin}
                        </p>
                        <span className="text-[10px] text-gray-600 bg-black/50 px-2 py-1 rounded">Hover to reveal</span>
                    </div>
                </div>

                {/* Subscription Status */}
                <div className="md:col-span-2 bg-gradient-to-br from-luxury-gold/10 to-transparent border border-luxury-gold/20 rounded-xl p-6">
                    <h3 className="text-luxury-gold text-xs uppercase tracking-widest font-bold mb-4 flex items-center">
                        <QrCode size={14} className="mr-2" /> Subscription Active
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Your premium subscription is active. You have full access to all exclusive content and features.
                        Use your secure PIN to login on any device.
                    </p>
                    <div className="mt-4 pt-4 border-t border-luxury-gold/10 flex justify-between items-center text-xs text-gray-500">
                        <span>Member since {new Date().getFullYear()}</span>
                        <span>ID: {user.id.substring(0, 8)}...</span>
                    </div>
                </div>

           </div>

        </div>
      </main>
    </div>
  );
}
