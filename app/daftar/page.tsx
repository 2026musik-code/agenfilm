'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User } from '@/types/user';
import { ArrowRight, QrCode, CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [user, setUser] = useState<User | null>(null);
  const [generatedPin, setGeneratedPin] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setStep('qr');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setGeneratedPin(data.pin);
        setStep('success');
      } else {
        alert('Payment not verified yet. Please try again.');
      }
    } catch (e) {
      alert('Error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-32 flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-lg bg-gray-900/80 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl"></div>

          {step === 'form' && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <h1 className="text-3xl font-bold font-serif text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-luxury-gold to-white">
                Join the Elite
              </h1>
              <p className="text-gray-400 text-center mb-8 text-sm">Register to access exclusive content.</p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold outline-none transition-all focus:ring-1 focus:ring-luxury-gold/50"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-luxury-gold outline-none transition-all focus:ring-1 focus:ring-luxury-gold/50"
                    placeholder="Enter your email"
                  />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded flex items-center">
                        <AlertTriangle size={14} className="mr-2" /> {error}
                    </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Proceed to Payment <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'qr' && user && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-2xl font-bold font-serif text-white mb-6">Complete Payment</h2>

              <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-lg mx-auto">
                 {user.qrUrl ? (
                    <div className="relative w-48 h-48">
                         <Image
                            src={user.qrUrl}
                            alt="Payment QR"
                            fill
                            className="object-contain"
                            unoptimized
                         />
                    </div>
                 ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-black">
                        <QrCode size={48} />
                        <p className="ml-2">QR Error</p>
                    </div>
                 )}
              </div>

              <p className="text-gray-300 text-sm mb-8 px-4">
                Scan this QR code with your preferred payment app. Once the transaction is successful, click the button below.
              </p>

              <button
                onClick={checkPayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-lg shadow-lg transition-all flex justify-center items-center mb-4"
              >
                 {loading ? 'Verifying...' : 'I Have Paid'}
              </button>

              <p className="text-xs text-gray-500">
                Having trouble? <button onClick={() => setStep('form')} className="text-luxury-gold hover:underline">Go back</button>
              </p>
            </div>
          )}

          {step === 'success' && (
             <div className="text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                <p className="text-gray-400 text-sm mb-8">Your account has been created. Use the PIN below to login.</p>

                <div className="bg-black/50 border border-luxury-gold/50 rounded-lg p-6 mb-8 relative group">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Login PIN</p>
                    <div className="text-4xl font-mono font-bold text-luxury-gold tracking-[0.2em]">
                        {generatedPin}
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(generatedPin);
                            alert('PIN copied!');
                        }}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white transition-colors"
                        title="Copy PIN"
                    >
                        <Copy size={16} />
                    </button>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4 mb-6 text-left">
                    <p className="text-xs text-yellow-200 flex items-start">
                        <AlertTriangle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                        <span>Please save this PIN securely. It is your only way to access your account.</span>
                    </p>
                </div>

                <Link
                    href="/login"
                    className="block w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Login Now
                </Link>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
