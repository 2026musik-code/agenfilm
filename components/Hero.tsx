import { Drama } from '@/types/drama';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

export default function Hero({ drama }: { drama: Drama }) {
  if (!drama) return null;

  return (
    <div className="relative h-[85vh] w-full flex items-end overflow-hidden group">
      {/* Background Image with slight scale on load/hover */}
      <div className="absolute inset-0 transition-transform duration-[20s] ease-out transform scale-105 group-hover:scale-100">
        <Image
          src={drama.coverWap}
          alt={drama.bookName}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
          unoptimized={false}
        />
      </div>

      {/* Gradient Overlays for Cinematic Feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/40 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-black/60 to-transparent opacity-80" />
      <div className="absolute inset-0 bg-black/20 backdrop-brightness-75 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pb-16 md:pb-24 flex flex-col justify-end h-full">
        <div className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000">
           {drama.corner && (
             <div className="inline-flex items-center px-3 py-1 space-x-2 bg-luxury-gold/20 backdrop-blur-sm border border-luxury-gold/50 rounded-full">
                <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-luxury-gold uppercase">
                  {drama.corner.name}
                </span>
             </div>
           )}

           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif tracking-tight drop-shadow-2xl">
             {drama.bookName}
           </h1>

           {drama.tags && drama.tags.length > 0 && (
             <div className="flex flex-wrap gap-2 text-sm text-gray-300 font-medium tracking-wide">
               {drama.tags.slice(0, 3).map((tag, i) => (
                 <span key={i} className="px-2 py-1 border border-white/20 rounded-md backdrop-blur-md">
                   {tag}
                 </span>
               ))}
               <span className="px-2 py-1">•</span>
               <span>{drama.chapterCount} Chapters</span>
             </div>
           )}

           {drama.introduction && (
             <p className="text-gray-300 text-base md:text-lg line-clamp-3 md:line-clamp-2 max-w-2xl leading-relaxed drop-shadow-md font-light">
               {drama.introduction}
             </p>
           )}

           <div className="flex flex-wrap gap-4 pt-4">
             <Link
               href={`/drama/${drama.bookId}`}
               className="group relative inline-flex items-center px-8 py-4 bg-luxury-gold text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transform hover:-translate-y-1"
             >
               <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
               <Play className="w-5 h-5 mr-2 fill-current" />
               Watch Now
             </Link>

             <Link
               href={`/drama/${drama.bookId}`}
               className="inline-flex items-center px-8 py-4 border border-white/20 bg-white/5 text-white font-bold text-lg rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-md"
             >
               <Info className="w-5 h-5 mr-2" />
               More Info
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
