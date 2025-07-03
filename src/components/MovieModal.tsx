import { Star, Heart, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Movie } from "@/data/mockMovies";
import SeriesCard from "@/components/SeriesCard";
import MovieCard from "@/components/MovieCard";
import HomeRow from "@/components/HomeRow";

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
  recommendedContent
}: MovieModalProps) => {
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

  // Filter recommended content by same genre or channel
  const filteredRecommendedContent = recommendedContent.filter(item => 
    item.id !== movie.id && 
    (item.genre === movie.genre || item.channel_id === movie.channelId || item.channel_id === contentItem?.channel_id)
  );

  const normalizedRecommendedContent = filteredRecommendedContent.map(item => ({
    ...item,
    posterUrl: item.posterUrl || item.poster_url,
  }));

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
                <HomeRow title="More Like This" items={normalizedRecommendedContent} onCardClick={() => onClose(false)} />
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
