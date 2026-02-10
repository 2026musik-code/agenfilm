'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User, Settings } from '@/types/user';
import { Lock, CreditCard, Users, Save, RefreshCw } from 'lucide-react';

interface VisitorInfo {
  ip: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  isp: string;
  userAgent: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Data
  const [settings, setSettings] = useState<Settings>({ paymentKey: '', price: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);

  useEffect(() => {
    // Check local storage for session persistence
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }

    // Fetch visitor info regardless
    fetch('/api/visitor-info')
      .then((res) => res.json())
      .then((data) => setVisitorInfo(data))
      .catch((err) => console.error('Failed to fetch visitor data:', err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-admin-password': 'Nina131@' };

      const [settingsRes, usersRes] = await Promise.all([
        fetch('/api/settings', { headers }),
        fetch('/api/users', { headers })
      ]);

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        fetchData();
      } else {
        setError('Invalid password');
        setLoading(false);
      }
    } catch (e) {
      setError('Login failed');
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-password': 'Nina131@'
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      alert('Error saving settings');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-luxury-gold/30 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-serif">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold text-black font-bold py-3 rounded-lg hover:bg-white transition-colors"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-luxury-gold to-yellow-600">
              Admin Dashboard
            </h1>
            <button
                onClick={() => {
                    localStorage.removeItem('adminAuth');
                    setIsAuthenticated(false);
                }}
                className="text-sm text-red-400 hover:text-red-300 underline"
            >
                Logout
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Settings Card */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gray-900/50 backdrop-blur-md border border-luxury-gold/20 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-gray-800 pb-4">
                        <CreditCard className="mr-2 text-luxury-gold" size={20} />
                        Payment Configuration
                    </h2>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Paymenku API Key</label>
                            <input
                                type="text"
                                value={settings.paymentKey}
                                onChange={(e) => setSettings({...settings, paymentKey: e.target.value})}
                                placeholder="Enter API Key"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-luxury-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Subscription Price (IDR)</label>
                            <input
                                type="number"
                                value={settings.price}
                                onChange={(e) => setSettings({...settings, price: Number(e.target.value)})}
                                placeholder="e.g. 50000"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-luxury-gold outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/50 py-2 rounded-lg hover:bg-luxury-gold hover:text-black transition-all font-semibold"
                        >
                            <Save size={16} className="mr-2" /> Save Settings
                        </button>
                    </form>
                </div>

                {/* Visitor Info Card */}
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-lg font-bold text-gray-300 mb-4">Current Session</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">IP Address</span>
                            <span className="text-white font-mono">{visitorInfo?.ip}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Location</span>
                            <span className="text-white text-right">{visitorInfo?.location?.city || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ISP</span>
                            <span className="text-white text-right truncate max-w-[150px]">{visitorInfo?.isp}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="lg:col-span-2">
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-xl h-full">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Users className="mr-2 text-luxury-gold" size={20} />
                            Registered Users
                        </h2>
                        <button
                            onClick={fetchData}
                            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                                    <th className="py-3 px-2">Name</th>
                                    <th className="py-3 px-2">Email</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">PIN</th>
                                    <th className="py-3 px-2">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-2 font-medium text-white">{user.name}</td>
                                            <td className="py-3 px-2 text-gray-400">{user.email}</td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    user.paymentStatus === 'paid'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : user.paymentStatus === 'failed'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {user.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 font-mono text-luxury-gold tracking-widest">
                                                {user.pin || '-'}
                                            </td>
                                            <td className="py-3 px-2 text-gray-500 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
