import { Drama } from '@/types/drama';
import MovieCard from './MovieCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionProps {
  title: string;
  bookList: Drama[];
  columnId?: number | string; // Optional, used for "See All" link if available
  subTitle?: string;
}

export default function Section({ title, bookList, columnId, subTitle }: SectionProps) {
  if (!bookList || bookList.length === 0) return null;

  return (
    <section className="py-4 md:py-8 border-b border-luxury-gray/10 last:border-0 relative">
      <div className="container mx-auto px-4 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-serif flex items-center">
            <span className="w-1 h-6 bg-luxury-gold mr-3 rounded-full" />
            {title}
          </h2>
          {subTitle && <p className="text-gray-400 text-xs md:text-sm mt-1 pl-4 hidden md:block">{subTitle}</p>}
        </div>

        {columnId && (
          <Link
            href={`/category/${columnId}`}
            className="group flex items-center text-xs md:text-sm font-semibold text-gray-400 hover:text-luxury-gold transition-colors uppercase tracking-wider"
          >
            See All
            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative group">
        <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-8 scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {bookList.map((drama) => (
            <div key={drama.bookId} className="snap-start flex-shrink-0 w-32 md:w-44">
               <MovieCard drama={drama} />
            </div>
          ))}
          {/* Spacer for right padding */}
          <div className="w-4 flex-shrink-0" />
        </div>

        {/* Gradient Fade for scroll indicators */}
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-luxury-black via-transparent to-transparent pointer-events-none md:block hidden" />
      </div>
    </section>
  );
}
