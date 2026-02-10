import { Drama } from '@/types/drama';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function MovieCard({ drama }: { drama: Drama }) {
  const queryParams = new URLSearchParams({
    title: drama.bookName,
    cover: drama.coverWap,
    intro: (drama.introduction || "").substring(0, 200) // limit length
  }).toString();

  return (
    <Link href={`/drama/${drama.bookId}?${queryParams}`} className="group relative block w-full flex-shrink-0 transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-white/5 group-hover:border-luxury-gold transition-all duration-300 bg-luxury-gray">
        <Image
          src={drama.coverWap || "/window.svg"}
          alt={drama.bookName}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          sizes="(max-width: 768px) 144px, 176px"
          unoptimized={false}
        />

        {/* VIP Badge / Corner */}
        {drama.corner && (
           <div
             className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold text-black rounded uppercase tracking-wider shadow-md z-10"
             style={{ backgroundColor: drama.corner.color || '#d4af37' }}
           >
             {drama.corner.name}
           </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[1px]">
             <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-110 transition-transform duration-300 delay-75">
                <Play className="text-black ml-1 w-5 h-5" fill="currentColor" />
             </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/60 to-transparent">
             {/* Optional overlay text if needed */}
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm md:text-base text-gray-200 group-hover:text-luxury-gold line-clamp-2 transition-colors font-medium h-[2.5em] leading-tight">
            {drama.bookName}
        </h3>
        {drama.playCount && (
            <p className="text-xs text-gray-500 mt-1">{drama.playCount} views</p>
        )}
      </div>
    </Link>
  );
}
