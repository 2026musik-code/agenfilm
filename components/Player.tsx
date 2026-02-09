'use client';

import { useState, useRef, useEffect } from 'react';
import { Episode, Drama } from '@/types/drama';
import { Play, List, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface PlayerProps {
  drama: Drama;
  episodes: Episode[];
}

export default function Player({ drama, episodes }: PlayerProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentEpisode = episodes[currentEpisodeIndex];
  // Find the highest quality video path
  const videoSrc = currentEpisode?.cdnList?.[0]?.videoPathList?.sort((a, b) => b.quality - a.quality)?.[0]?.videoPath;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentEpisodeIndex]);

  if (!episodes || episodes.length === 0) return <div className="text-white text-center p-10 bg-white/5 rounded-xl">No episodes available to watch.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
      {/* Video Player Section - Sticky on Mobile */}
      <div className="sticky top-0 z-40 bg-black lg:static lg:flex-1 w-full shadow-2xl lg:rounded-xl overflow-hidden aspect-video">
           {videoSrc ? (
             <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain bg-black"
                poster={drama.coverWap}
                preload="metadata"
                playsInline
             >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
             </video>
           ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
                Video source not found.
             </div>
           )}
      </div>

      {/* Mobile Title & Episode Info (Below Player) */}
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

      {/* Episode List Sidebar / Bottom Sheet */}
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
                        setIsListExpanded(false); // Close list on mobile after selection
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
