'use client';
import Link from 'next/link';
import { Search, User, X, ArrowLeft, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-luxury-black/95 backdrop-blur-md shadow-lg py-3' : 'bg-gradient-to-b from-luxury-black/80 to-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center relative">

        {/* Left: Logo */}
        <div className="flex items-center gap-4">
             {/* Back Button for mobile on non-home pages */}
            {!isHome && (
                <button onClick={() => router.back()} className="text-white md:hidden hover:text-luxury-gold transition-colors">
                    <ArrowLeft size={24} />
                </button>
            )}

            <Link href="/" className={`text-2xl font-bold text-luxury-gold tracking-widest font-serif transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
              LUXE<span className="text-white">DRAMA</span>
            </Link>
        </div>

        {/* Search Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center px-4 bg-luxury-black/95 z-50 transition-all duration-300 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <form onSubmit={handleSearch} className="w-full max-w-2xl relative flex items-center">
                <Search className="text-luxury-gold mr-3 flex-shrink-0" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for movies, dramas..."
                    className="w-full bg-transparent border-b border-luxury-gold/50 text-white text-lg py-2 focus:outline-none focus:border-luxury-gold placeholder-gray-500 font-serif"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-4 text-gray-400 hover:text-white flex-shrink-0">
                    <X size={24} />
                </button>
             </form>
        </div>

        {/* Right: Actions */}
        <div className={`flex items-center space-x-6 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:text-luxury-gold transition-colors hidden md:block"
            aria-label="Search"
          >
            <Search size={24} />
          </button>

          <button className="text-white hover:text-luxury-gold transition-colors" aria-label="Notifications">
            <Bell size={24} />
          </button>

          <Link href="/profile" className="text-white hover:text-luxury-gold transition-colors hidden md:block" aria-label="User Profile">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
