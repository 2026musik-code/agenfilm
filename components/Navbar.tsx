'use client';
import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-luxury-black/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-luxury-gold tracking-widest font-serif">
          LUXE<span className="text-white">DRAMA</span>
        </Link>
        <div className="flex items-center space-x-6">
          <button className="text-white hover:text-luxury-gold transition-colors" aria-label="Search">
            <Search size={24} />
          </button>
          <button className="text-white hover:text-luxury-gold transition-colors hidden md:block" aria-label="User Profile">
            <User size={24} />
          </button>
           <button className="text-white hover:text-luxury-gold transition-colors md:hidden" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
