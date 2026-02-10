import { fetchDramaDetails, fetchEpisodes } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';
import { Play, Info, Share2, Plus } from 'lucide-react';
import { Drama } from '@/types/drama';

export default async function DramaPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const sp = await searchParams;

  const title = typeof sp.title === 'string' ? sp.title : undefined;
  const cover = typeof sp.cover === 'string' ? sp.cover : undefined;
  const intro = typeof sp.intro === 'string' ? sp.intro : undefined;

  let [drama, episodes] = await Promise.all([
    fetchDramaDetails(id),
    fetchEpisodes(id)
  ]);

  // Fallback: If drama is not found in lists but we found episodes (e.g. from search)
  if (!drama && episodes.length > 0) {
    drama = {
        bookId: id,
        bookName: title || `Drama ${id}`,
        coverWap: cover || (episodes[0].chapterImg || "/window.svg"),
        introduction: intro || "Description not available.",
        chapterCount: episodes.length,
        playCount: "0",
    } as Drama;
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 font-serif text-luxury-gold">Drama Not Found</h1>
        <p className="text-gray-400">Unable to load drama details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black pb-20 md:pb-0">
      <Navbar />

      {/* Main Content */}
      <div className="pt-0 md:pt-20 lg:container lg:mx-auto lg:px-4">

         {/* Video Player Area */}
         <div className="w-full bg-black lg:rounded-xl overflow-hidden shadow-2xl border border-white/5 relative z-20">
            <Player drama={drama} episodes={episodes} />
         </div>

         {/* Drama Info Section */}
         <div className="px-4 py-3 md:py-6 md:px-0 space-y-3 md:space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h1 className="text-xl md:text-4xl font-bold font-serif leading-tight text-white mt-2 md:mt-4">
                {drama.bookName}
            </h1>

            <div className="flex items-center space-x-4 text-[10px] md:text-sm text-gray-400">
                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-semibold">HD</span>
                <span>{drama.chapterCount || episodes.length} Episodes</span>
                <span className="flex items-center"><Play size={12} className="mr-1" /> {drama.playCount || 0} views</span>
            </div>

            <p className="text-gray-300 text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                {drama.introduction}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-8 border-t border-white/10 pt-4 md:pt-6 justify-around md:justify-start">
                <button className="flex flex-col items-center text-gray-400 hover:text-luxury-gold transition-colors text-xs gap-2">
                    <Plus size={24} />
                    <span>My List</span>
                </button>
                <button className="flex flex-col items-center text-gray-400 hover:text-luxury-gold transition-colors text-xs gap-2">
                    <Share2 size={24} />
                    <span>Share</span>
                </button>
                <button className="flex flex-col items-center text-gray-400 hover:text-luxury-gold transition-colors text-xs gap-2">
                    <Info size={24} />
                    <span>Details</span>
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
