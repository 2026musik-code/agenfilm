import { fetchSearch, fetchPopularSearch } from '@/lib/api';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Search } from 'lucide-react';

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

        {/* Prominent Search Input for 'Empty' state or refinement */}
        <div className="mb-12 max-w-2xl mx-auto text-center">
            {!query && (
                <h1 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-luxury-gold to-yellow-600">
                    Find Your Drama
                </h1>
            )}

            <form action="/search" className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                </div>
                <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Search by title..."
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-transparent transition-all shadow-lg backdrop-blur-sm"
                    autoComplete="off"
                />
            </form>
        </div>

        {query && (
             <h2 className="text-xl md:text-2xl font-bold font-serif mb-8 border-b border-white/10 pb-4 flex items-center">
                Results for <span className="text-luxury-gold ml-2">&quot;{query}&quot;</span>
             </h2>
        )}

        {/* No Results State */}
        {query && results.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl text-gray-300">No results found for &quot;{query}&quot;.</p>
            <p className="mt-2 text-sm text-gray-500">Try checking your spelling or use different keywords.</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
          {(query ? results : popular).map((drama) => (
             <div key={drama.bookId} className="flex justify-center w-full">
                <MovieCard drama={drama} />
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
