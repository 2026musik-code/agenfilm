import { fetchDramaDetails, fetchEpisodes } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';
import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import Link from 'next/link';

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch details and episodes in parallel
  const [drama, episodes] = await Promise.all([
    fetchDramaDetails(id),
    fetchEpisodes(id)
  ]);

  if (!drama) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 font-serif text-luxury-gold">Drama Not Found</h1>
        <p className="mb-8 text-gray-400">We couldn't find the drama you're looking for.</p>
        <Link href="/" className="px-6 py-3 border border-luxury-gold text-luxury-gold rounded-full hover:bg-luxury-gold hover:text-black transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black pb-20">
      <Navbar />

      {/* Detail Hero / Backdrop */}
      <div className="relative h-[50vh] w-full mb-10">
         <Image
            src={drama.coverWap}
            alt={drama.bookName}
            fill
            className="object-cover object-top opacity-40 blur-sm scale-105"
            priority
            unoptimized={false}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/90 to-transparent" />

         <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10 flex flex-col md:flex-row gap-8 items-end z-10">
            {/* Poster */}
            <div className="relative w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/20 flex-shrink-0 hidden md:block transform hover:scale-105 transition-transform duration-500">
              <Image
                src={drama.coverWap}
                alt={drama.bookName}
                fill
                className="object-cover"
                unoptimized={false}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-700">
              <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight text-shadow text-white">
                {drama.bookName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {drama.playCount && (
                  <span className="flex items-center bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <Play className="w-3 h-3 mr-2 text-luxury-gold" fill="currentColor" /> {drama.playCount} Views
                  </span>
                )}
                {episodes.length > 0 && <span className="bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">{episodes.length} Episodes</span>}
                {drama.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 border border-luxury-gold/30 rounded-full text-xs bg-luxury-gold/10 text-luxury-gold font-medium">{tag}</span>
                ))}
              </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 space-y-12 relative z-20">
         {/* Player Section */}
         <section id="watch">
            <h2 className="text-2xl font-bold mb-6 text-white font-serif border-l-4 border-luxury-gold pl-4 flex items-center">
                <Play className="w-5 h-5 mr-3 fill-luxury-gold" /> Watch Now
            </h2>
            <Player drama={drama} episodes={episodes} />
         </section>

         {/* Synopsis */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <section className="bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-luxury-gold font-serif">
                    <Info className="w-5 h-5 mr-2" /> Synopsis
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    {drama.introduction || "No description available."}
                  </p>
                </section>
            </div>
         </div>
      </div>
    </div>
  );
}
