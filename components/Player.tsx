'use client';

import { useState, useRef, useEffect } from 'react';
import { Drama } from '@/types/drama';
import { Play, List, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import Image from 'next/image';

interface VideoPath {
  quality: number;
  videoPath: string;
}

interface Episode {
  chapterId: string;
  chapterName: string;
  cdnList?: {
    videoPathList?: VideoPath[];
  }[];
}

interface PlayerProps {
  drama: Drama;
  episodes: Episode[];
}

export default function Player({ drama, episodes }: PlayerProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentEpisode = episodes[currentEpisodeIndex];

  // Extract video paths and sort by quality (highest first)
  const videoPaths = currentEpisode?.cdnList?.[0]?.videoPathList?.sort((a, b) => b.quality - a.quality) || [];

  // Default to highest quality if none selected, or if selected quality is not available for this episode
  const activeVideoPath = videoPaths.find(vp => vp.quality === selectedQuality)?.videoPath || videoPaths[0]?.videoPath;
  const activeQuality = videoPaths.find(vp => vp.videoPath === activeVideoPath)?.quality || 0;

  // Reset quality selection when episode changes (optional, or keep preference)
  // For now, we keep the user's preference if available in the new episode
  useEffect(() => {
    // If the currently selected quality doesn't exist in the new episode,
    // we might want to default to the highest available.
    // The logic above `activeVideoPath` handles the fallback automatically.
  }, [currentEpisodeIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentEpisodeIndex, activeVideoPath]);

  if (!episodes || episodes.length === 0) return <div className="text-white text-center p-10 bg-white/5 rounded-xl">No episodes available to watch.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
      {/* Video Player Section */}
      <div className="sticky top-0 z-40 bg-black lg:static lg:flex-1 w-full shadow-2xl lg:rounded-xl overflow-hidden aspect-video relative group">
           {activeVideoPath ? (
             <>
               <video
                  ref={videoRef}
                  controls
                  className="w-full h-full object-contain bg-black"
                  poster={drama.coverWap}
                  preload="metadata"
                  playsInline
               >
                  <source src={activeVideoPath} type="video/mp4" />
                  Your browser does not support the video tag.
               </video>

               {/* Quality Selector Overlay */}
               <div className="absolute top-16 right-4 z-50 pointer-events-auto">
                 <div className="relative">
                   <button
                     onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                     className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-white/10 shadow-lg cursor-pointer"
                     type="button"
                   >
                     <Settings size={14} className="text-luxury-gold" />
                     {activeQuality > 0 ? `${activeQuality}p` : 'Auto'}
                     <ChevronDown size={14} className={`transition-transform ${isQualityMenuOpen ? 'rotate-180' : ''}`} />
                   </button>

                   {isQualityMenuOpen && (
                     <div className="absolute right-0 mt-2 w-32 bg-black/90 border border-luxury-gold/30 rounded-lg shadow-xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                       <div className="py-1">
                         <div className="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/10 bg-white/5">
                           Select Quality
                         </div>
                         {videoPaths.map((vp) => (
                           <button
                             key={vp.quality}
                             onClick={() => {
                               setSelectedQuality(vp.quality);
                               setIsQualityMenuOpen(false);
                             }}
                             className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center ${
                               activeQuality === vp.quality
                               ? 'bg-luxury-gold/20 text-luxury-gold font-bold'
                               : 'text-gray-300 hover:bg-white/10 hover:text-white'
                             }`}
                           >
                             <span>{vp.quality}p</span>
                             {activeQuality === vp.quality && <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </>
           ) : (
             <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
                <p>Video source not found.</p>
                <p className="text-xs text-gray-600">Try selecting a different episode.</p>
             </div>
           )}
      </div>

      {/* Mobile Title & Episode Info */}
      <div className="p-4 bg-luxury-black border-b border-white/10 lg:hidden">
          <h2 className="text-lg font-bold text-white line-clamp-1">{drama.bookName}</h2>
          <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
              <span>{currentEpisode?.chapterName || `Episode ${currentEpisodeIndex + 1}`}</span>
              <button
                onClick={() => setIsListExpanded(!isListExpanded)}
                className="flex items-center text-luxury-gold font-medium"
              >
                {episodes.length} Episodes {isListExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
          </div>
      </div>

      {/* Episode List Sidebar */}
      <div className={`w-full lg:w-96 flex-shrink-0 bg-luxury-black/95 backdrop-blur-xl border-t lg:border border-white/10 lg:rounded-xl p-4 lg:p-6 flex flex-col transition-all duration-300 ${isListExpanded ? 'block' : 'hidden lg:flex'} lg:h-[600px]`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center font-serif border-b border-white/10 pb-4">
            <List className="w-5 h-5 mr-2 text-luxury-gold" /> Episode List
        </h3>
        <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar flex-1 h-[400px] lg:h-auto">
            {episodes.map((ep, index) => (
                <button
                    key={ep.chapterId || index}
                    onClick={() => {
                        setCurrentEpisodeIndex(index);
                        setIsListExpanded(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border border-transparent group ${
                        currentEpisodeIndex === index
                        ? 'bg-luxury-gold/10 border-luxury-gold/50 text-luxury-gold'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                    <div className="relative w-16 aspect-video rounded bg-black/50 overflow-hidden flex-shrink-0">
                         <Image
                           src={drama.coverWap}
                           alt={`Ep ${index + 1}`}
                           fill
                           className={`object-cover ${currentEpisodeIndex === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}
                           unoptimized={false}
                         />
                         {currentEpisodeIndex === index && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                 <Play size={12} fill="currentColor" className="text-luxury-gold" />
                             </div>
                         )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{ep.chapterName || `Episode ${index + 1}`}</span>
                        <span className="text-[10px] text-gray-500">{index + 1} / {episodes.length}</span>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
