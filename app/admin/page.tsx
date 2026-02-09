'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface VisitorInfo {
  ip: string;
  location: {
    country: string;
    city: string;
    region: string;
    latitude: string;
    longitude: string;
  };
  isp: string;
  userAgent: string;
  referer: string;
  timestamp: string;
}

export default function AdminPage() {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/visitor-info')
      .then((res) => res.json())
      .then((data) => {
        setVisitorInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch visitor data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-luxury-gold to-yellow-600 mb-4">
              Visitor Dashboard
            </h1>
            <p className="text-gray-400">View real-time visitor data and simulate blocking scenarios.</p>
          </div>

          {/* Current Session Card */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-yellow-500/20 rounded-xl overflow-hidden shadow-2xl shadow-yellow-900/10 mb-8 relative">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>

             <div className="p-6 md:p-8">
               <h2 className="text-xl font-bold text-luxury-gold mb-6 border-b border-gray-700 pb-2">Your Current Session Details</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IP Address */}
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">IP Address</p>
                    <p className="text-lg md:text-xl font-mono text-white">{visitorInfo?.ip}</p>
                  </div>

                  {/* Location */}
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Estimated Location</p>
                    <p className="text-lg md:text-xl font-medium text-white">
                      {visitorInfo?.location.city}, {visitorInfo?.location.region}, {visitorInfo?.location.country}
                    </p>
                  </div>

                  {/* ISP */}
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800 md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Internet Service Provider (ISP)</p>
                    <p className="text-lg md:text-xl font-medium text-white">{visitorInfo?.isp}</p>
                  </div>

                  {/* User Agent */}
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800 md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">User Agent (Device Info)</p>
                    <p className="text-sm font-mono text-gray-300 break-all">{visitorInfo?.userAgent}</p>
                  </div>
               </div>
             </div>
          </div>

          {/* Blocking Simulation Info */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-red-900/30 rounded-xl p-6 md:p-8">
             <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
               <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
               Access Control Simulation
             </h3>
             <p className="text-gray-400 text-sm mb-4 leading-relaxed">
               This application includes middleware capable of blocking specific IPs or countries.
               Currently, no restrictions are active. To restrict access, update the <code className="bg-black/50 px-1 py-0.5 rounded text-yellow-500">middleware.ts</code> file with the desired blocklist.
             </p>

             <div className="bg-black/60 p-4 rounded border border-gray-800 overflow-x-auto">
               <code className="text-xs text-green-400 font-mono">
                 {'// Example blocked configuration in middleware.ts'}<br/>
                 const BLOCKED_IPS = [&apos;1.2.3.4&apos;];<br/>
                 const BLOCKED_COUNTRIES = [&apos;CN&apos;, &apos;RU&apos;];
               </code>
             </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm underline underline-offset-4">
              Back to Home
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
