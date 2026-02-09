import { Drama } from '@/types/drama';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus } from 'lucide-react';

export default function Hero({ drama }: { drama: Drama }) {
  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden">
      {/* Background Image with Parallax Effect Placeholder (standard fill for now) */}
      <Image
        src={drama.coverWap}
        alt={drama.bookName}
        fill
        className="object-cover object-top"
        priority
        unoptimized={false}
      />

      {/* Gradient Overlays for Immersive Feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/90 via-luxury-black/40 to-transparent" />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-24 md:pb-32 flex flex-col justify-end h-full z-10">
        <div className="max-w-2xl space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-1000">

          {/* Metadata Badges */}
          <div className="flex items-center space-x-3 mb-2">
             <span className="bg-luxury-gold text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Top Rated
             </span>
             {drama.chapterCount && (
                <span className="text-gray-300 text-xs font-medium border border-gray-500 px-2 py-1 rounded">
                   {drama.chapterCount} Chapters
                </span>
             )}
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            {drama.bookName}
          </h1>

          <p className="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-2 max-w-xl font-light leading-relaxed">
            {drama.introduction || "Experience the drama that has everyone talking. Watch now in premium quality."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
                href={`/drama/${drama.bookId}`}
                className="flex items-center px-8 py-3.5 bg-luxury-gold text-black font-bold rounded-lg hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)]"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Watch Now
            </Link>

            <button className="flex items-center px-6 py-3.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all">
              <Plus className="w-5 h-5 mr-2" />
              My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
