'use client';

import { useState, useRef, useEffect } from 'react';
import { Episode, Drama } from '@/types/drama';
import { Play, List } from 'lucide-react';

interface PlayerProps {
  drama: Drama;
  episodes: Episode[];
}

export default function Player({ drama, episodes }: PlayerProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Video Player Section */}
      <div className="flex-1 space-y-4">
        <div className="bg-black aspect-video relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
           {videoSrc ? (
             <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
                poster={drama.coverWap}
                preload="metadata"
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
        <div className="flex justify-between items-center text-sm text-gray-400 px-2">
            <span>Playing: {currentEpisode?.chapterName || `Episode ${currentEpisodeIndex + 1}`}</span>
            <span>{currentEpisodeIndex + 1} / {episodes.length} Episodes</span>
        </div>
      </div>

      {/* Episode List Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0 bg-luxury-black/50 border border-white/10 rounded-xl p-6 flex flex-col h-[500px] lg:h-auto lg:max-h-[600px]">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center font-serif border-b border-white/10 pb-4">
            <List className="w-5 h-5 mr-2 text-luxury-gold" /> Episode List
        </h3>
        <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar flex-1">
            {episodes.map((ep, index) => (
                <button
                    key={ep.chapterId || index}
                    onClick={() => setCurrentEpisodeIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 border border-transparent ${
                        currentEpisodeIndex === index
                        ? 'bg-luxury-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                    <span className="text-sm font-medium">{ep.chapterName || `Episode ${index + 1}`}</span>
                    {currentEpisodeIndex === index && <Play className="w-4 h-4 fill-current" />}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
