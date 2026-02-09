'use client';
import Link from 'next/link';
import { Home, Search, Compass, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/search', icon: Compass },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Profile', href: '#', icon: User }, // Placeholder
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-luxury-black/95 backdrop-blur-xl border-t border-white/10 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
