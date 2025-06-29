
import { Star, Heart, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Movie } from "@/data/mockMovies";
import { useState, useRef } from "react";

interface MovieModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  movie: Movie;
  isSaved: boolean;
  onSave: () => void;
  onPlay: () => void;
  videoUrl?: string;
  contentItem?: any;
  channel?: any;
  recommendedContent: any[];
  onRecommendedClick?: (item: any) => void;
}

const MovieModal = ({
  isOpen,
  onClose,
  movie,
  isSaved,
  onSave,
  onPlay,
  videoUrl,
  contentItem,
  channel,
  recommendedContent,
  onRecommendedClick
}: MovieModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Format duration from minutes to "Xh Ym" format
  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  // Filter recommended content by BOTH same genre AND channel
  const filteredRecommendedContent = recommendedContent.filter(item => 
    item.id !== movie.id && 
    item.genre === movie.genre && 
    (item.channel_id === movie.channelId || item.channel_id === contentItem?.channel_id)
  );

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleRecommendedClick = (item: any) => {
    if (onRecommendedClick) {
      onRecommendedClick(item);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] max-h-[90vh] bg-gray-900 text-white border-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">{movie.title}</DialogTitle>
        <ScrollArea className="h-[90vh]">
          <div className="relative">
            {/* Hero Section with Fixed Gradient - only fade at bottom */}
            <div className="relative h-[60vh] overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Only bottom gradient for fade effect */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
              
              {/* Title and Info Container */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h1 className="text-5xl font-bold text-white mb-6">{movie.title}</h1>
                
                {/* Action Buttons Row */}
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={onPlay}
                    disabled={!videoUrl}
                    className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-3 transition-colors ${
                      videoUrl 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>Play</span>
                  </button>
                  
                  <button
                    onClick={onSave}
                    className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  </button>
                  
                  {/* Duration directly next to heart button */}
                  <span className="text-white text-xl font-medium">
                    {formatDuration(contentItem?.duration_minutes)}
                  </span>
                </div>
                
                {/* Netflix-style Info Row */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-green-400 font-semibold">{movie.rating}</span>
                  </div>
                  <span className="text-white font-medium">{movie.year}</span>
                  <span className="border border-gray-400 px-2 py-0.5 text-xs text-gray-300 font-medium">
                    TV-MA
                  </span>
                  <span className="text-white">{movie.genre}</span>
                  
                  {/* Channel Logo */}
                  {channel && channel.logo_url && (
                    <div className="flex items-center">
                      <img
                        src={channel.logo_url}
                        alt={channel.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section - Minimized gap */}
            <div className="bg-gray-900 p-8 pt-4">
              {/* More Like This Section */}
              {filteredRecommendedContent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">More Like This</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={scrollLeft}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={scrollRight}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={scrollRef}
                    className="flex space-x-2 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredRecommendedContent.map((item) => (
                      <div 
                        key={item.id} 
                        className="group cursor-pointer flex-shrink-0"
                        onClick={() => handleRecommendedClick(item)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800 w-48">
                          <img
                            src={item.poster_url || '/placeholder.svg'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current" />
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-white mt-2 line-clamp-2 w-48">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
