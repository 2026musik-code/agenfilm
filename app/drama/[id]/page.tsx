import { getDramaData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Play, Share2, Plus, Info } from 'lucide-react';
import Link from 'next/link';

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDramaData();

  if (!data) return <div>Failed to load data</div>;

  // Flatten the list to find the drama
  const drama = data.columnVoList
    .flatMap(col => col.bookList)
    .find(d => d.bookId === id);

  if (!drama) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Drama Not Found</h1>
        <Link href="/" className="text-luxury-gold hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />

      {/* Detail Hero */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
         <Image
            src={drama.coverWap}
            alt={drama.bookName}
            fill
            className="object-cover object-top opacity-60 blur-sm scale-110"
            priority
            unoptimized={false}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent" />

         <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10 flex flex-col md:flex-row gap-8 items-end z-10">
            {/* Poster */}
            <div className="relative w-40 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0 hidden md:block transform hover:scale-105 transition-transform duration-500">
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
              <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-shadow">{drama.bookName}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {drama.playCount && (
                  <span className="flex items-center bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <Play className="w-3 h-3 mr-2 text-luxury-gold" fill="currentColor" /> {drama.playCount} Views
                  </span>
                )}
                {drama.chapterCount && <span className="bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">{drama.chapterCount} Chapters</span>}
                {drama.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 border border-luxury-gold/30 rounded-full text-xs bg-luxury-gold/10 text-luxury-gold font-medium">{tag}</span>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <button className="group flex items-center px-8 py-3 bg-luxury-gold text-black font-bold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transform hover:-translate-y-1">
                  <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" /> Watch Now
                </button>
                <button className="flex items-center px-4 py-3 border border-white/20 rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="flex items-center px-4 py-3 border border-white/20 rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
         </div>
      </div>

      {/* Description & Episodes Placeholder */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
         <div className="md:col-span-2 space-y-12">
            <section className="bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-luxury-gold font-serif">
                <Info className="w-5 h-5 mr-2" /> Synopsis
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                {drama.introduction || "No description available."}
              </p>
            </section>

            <section>
               <h2 className="text-2xl font-bold mb-6 text-white font-serif border-l-4 border-luxury-gold pl-4">Episodes</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                 {/* Placeholder for episodes since API doesn't list them individually in the main list */}
                 {Array.from({ length: Math.min(drama.chapterCount || 10, 12) }).map((_, i) => (
                   <div key={i} className="group cursor-pointer p-3 rounded-xl bg-luxury-gray hover:bg-luxury-gray-light transition-all duration-300 border border-white/5 hover:border-luxury-gold/50 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative aspect-video bg-black/50 rounded-lg mb-3 overflow-hidden">
                         <Image
                           src={drama.coverWap}
                           alt={`Episode ${i+1}`}
                           fill
                           className="object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                           unoptimized={false}
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 drop-shadow-lg" fill="currentColor" />
                         </div>
                         <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono">
                            EP.{i+1}
                         </div>
                      </div>
                      <p className="text-sm font-medium text-gray-400 group-hover:text-luxury-gold transition-colors">Episode {i + 1}</p>
                   </div>
                 ))}
               </div>
               {drama.chapterCount && drama.chapterCount > 12 && (
                 <button className="mt-8 w-full py-4 text-center border border-white/10 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all uppercase tracking-widest text-sm font-bold">
                   Load More Episodes
                 </button>
               )}
            </section>
         </div>

         {/* Sidebar / Recommended */}
         <div className="space-y-8">
            <h3 className="text-xl font-bold text-white mb-6 font-serif border-b border-white/10 pb-4">You May Also Like</h3>
            <div className="space-y-6">
               {data.columnVoList[0]?.bookList.slice(0, 6).map(related => (
                 <Link key={related.bookId} href={`/drama/${related.bookId}`} className="flex gap-4 group items-center">
                    <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-luxury-gold/20 transition-all">
                      <Image src={related.coverWap} alt={related.bookName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized={false} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200 group-hover:text-luxury-gold line-clamp-2 transition-colors duration-300 leading-snug">{related.bookName}</h4>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Play className="w-3 h-3 mr-1" /> {related.playCount} views
                      </p>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
