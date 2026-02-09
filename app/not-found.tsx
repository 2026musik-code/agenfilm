import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-4xl font-bold text-luxury-gold mb-4 font-serif">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
