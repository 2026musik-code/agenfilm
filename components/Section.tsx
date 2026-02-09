import { DramaColumn } from '@/types/drama';
import MovieCard from './MovieCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionProps {
    column: DramaColumn;
}

export default function Section({ column }: SectionProps) {
  if (!column.bookList || column.bookList.length === 0) return null;

  return (
    <section className="py-10 border-b border-luxury-gray/30 last:border-0 relative">
      <div className="container mx-auto px-4 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-serif border-l-4 border-luxury-gold pl-4">
            {column.title}
          </h2>
          {column.subTitle && <p className="text-gray-400 text-sm mt-1 pl-5">{column.subTitle}</p>}
        </div>
        <Link
            href={`/category/${column.columnId}`}
            className="group flex items-center text-sm font-semibold text-luxury-gold hover:text-white transition-colors uppercase tracking-wider"
        >
            See All
            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="relative group">
        <div className="flex overflow-x-auto space-x-6 pb-8 px-4 md:px-8 scroll-smooth snap-x snap-mandatory">
          {column.bookList.map((drama) => (
            <div key={drama.bookId} className="snap-start flex-shrink-0">
               <MovieCard drama={drama} />
            </div>
          ))}
          {/* Spacer for right padding */}
          <div className="w-4 flex-shrink-0" />
        </div>

        {/* Gradient Fade for scroll indicators */}
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black via-transparent to-transparent pointer-events-none md:block hidden" />
      </div>
    </section>
  );
}
