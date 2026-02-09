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
    <section className="py-2 md:py-6 border-b border-luxury-gray/10 last:border-0 relative">
      <div className="container mx-auto px-2 md:px-4 mb-2 md:mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight font-serif flex items-center">
            <span className="w-1 h-5 md:h-6 bg-luxury-gold mr-2 md:mr-3 rounded-full" />
            {title}
          </h2>
          {subTitle && <p className="text-gray-400 text-xs md:text-sm mt-1 pl-4 hidden md:block">{subTitle}</p>}
        </div>

        {columnId && (
          <Link
            href={`/category/${columnId}`}
            className="group flex items-center text-[10px] md:text-sm font-semibold text-gray-400 hover:text-luxury-gold transition-colors uppercase tracking-wider"
          >
            See All
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative group">
        <div className="grid grid-rows-2 grid-flow-col gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-4 px-2 md:px-8 scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {bookList.map((drama) => (
            <div key={drama.bookId} className="snap-start w-28 md:w-44">
               <MovieCard drama={drama} />
            </div>
          ))}
          {/* Spacer for right padding */}
          <div className="w-2 md:w-4 row-span-2" />
        </div>

        {/* Gradient Fade for scroll indicators */}
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-luxury-black via-transparent to-transparent pointer-events-none md:block hidden" />
      </div>
    </section>
  );
}
