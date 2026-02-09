import { Drama } from '@/types/drama';
import MovieCard from './MovieCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface SectionProps {
  title: string;
  bookList: Drama[];
  columnId?: number | string;
  subTitle?: string;
}

export default function Section({ title, bookList, columnId, subTitle }: SectionProps) {
  if (!bookList || bookList.length === 0) return null;

  return (
    <section className="py-4 md:py-8 px-2 md:px-0">
      <div className="container mx-auto relative rounded-xl overflow-hidden border border-yellow-500/20 bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 shadow-lg shadow-yellow-900/10 backdrop-blur-sm">

        {/* Decorative top sheen */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50" />

        <div className="p-3 md:p-6">
          {/* Header */}
          <div className="flex flex-row-reverse justify-between items-center mb-4 border-b border-yellow-500/10 pb-2">
            <div className="text-right">
              <h2 className="text-xl md:text-3xl font-bold font-serif bg-gradient-to-l from-yellow-200 via-yellow-500 to-yellow-700 text-transparent bg-clip-text drop-shadow-sm tracking-wide">
                {title}
              </h2>
              {subTitle && <p className="text-gray-400 text-xs md:text-sm mt-1 text-right italic font-light">{subTitle}</p>}
            </div>

            {columnId && (
              <Link
                href={`/category/${columnId}`}
                className="group flex items-center text-[10px] md:text-sm font-semibold text-yellow-600/80 hover:text-yellow-400 transition-colors uppercase tracking-wider"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                See All
              </Link>
            )}
          </div>

          {/* Content Grid */}
          <div className="relative group">
            <div className="grid grid-rows-2 grid-flow-col gap-3 md:gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide">
              {bookList.map((drama) => (
                <div key={drama.bookId} className="snap-start w-32 md:w-48 shrink-0">
                   <MovieCard drama={drama} />
                </div>
              ))}
              {/* Spacer */}
              <div className="w-2 md:w-4 row-span-2" />
            </div>

             {/* Gradient Fade for scroll indicators - right side */}
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-black/80 to-transparent pointer-events-none md:block hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
