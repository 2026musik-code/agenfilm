import { fetchSearch, fetchPopularSearch } from '@/lib/api';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';

  const results = query ? await fetchSearch(query) : [];
  const popular = !query ? await fetchPopularSearch() : [];

  return (
    <main className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />

      <div className="pt-32 container mx-auto px-4 pb-20">
        <h1 className="text-3xl md:text-5xl font-bold font-serif mb-8 border-b border-white/10 pb-4">
          {query ? `Results for "${query}"` : 'Popular Searches'}
        </h1>

        {query && results.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No results found for "{query}".</p>
            <p className="mt-2 text-sm">Try checking your spelling or use different keywords.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {(query ? results : popular).map((drama) => (
             <div key={drama.bookId} className="flex justify-center">
                <MovieCard drama={drama} />
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
