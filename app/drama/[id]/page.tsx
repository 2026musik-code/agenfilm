import { fetchDramaDetails, fetchEpisodes } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';
import { Play, Info, Share2, Plus } from 'lucide-react';

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [drama, episodes] = await Promise.all([
    fetchDramaDetails(id),
    fetchEpisodes(id)
  ]);

  if (!drama) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 font-serif text-luxury-gold">Drama Not Found</h1>
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
         <div className="px-4 py-6 md:px-0 space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h1 className="text-2xl md:text-4xl font-bold font-serif leading-tight text-white mt-4">
                {drama.bookName}
            </h1>

            <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-400">
                <span className="bg-white/10 px-2 py-1 rounded text-white font-semibold">HD</span>
                <span>{drama.chapterCount || episodes.length} Episodes</span>
                <span className="flex items-center"><Play size={12} className="mr-1" /> {drama.playCount} views</span>
            </div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                {drama.introduction}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-8 border-t border-white/10 pt-6 justify-around md:justify-start">
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
