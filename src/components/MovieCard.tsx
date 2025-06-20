
import { Link } from "react-router-dom";
import { Star, Heart, Play } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserFavorites } from "@/hooks/useUserFavorites";

interface MovieCardProps {
  movie: Movie;
  showSaveButton?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  showResumeButton?: boolean;
}

let currentHoveredCard: string | null = null;

const MovieCard = ({ 
  movie, 
  showSaveButton = true, 
  showProgress = false, 
  progressPercent = 0,
  showResumeButton = false 
}: MovieCardProps) => {
  const { favoriteIds, addToFavorites, removeFromFavorites } = useUserFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check if movie is in favorites
  const isSaved = favoriteIds.includes(movie.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  const handleMouseEnter = () => {
    if (currentHoveredCard && currentHoveredCard !== movie.id) {
      return;
    }
    currentHoveredCard = movie.id;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (currentHoveredCard === movie.id) {
      currentHoveredCard = null;
    }
    setIsHovered(false);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="block">
          <div className={`relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 ${
            isHovered 
              ? 'scale-105 shadow-2xl shadow-black/50' 
              : 'shadow-lg'
          }`}
          style={{
            aspectRatio: '16/9',
            boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.6)' : '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            <div className="w-full h-full overflow-hidden">
              {isHovered ? (
                // Video preview on hover
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${movie.youtubeId}`}
                    className="w-full h-full"
                    allow="autoplay"
                  />
                </div>
              ) : (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              )}
            </div>
            
            {/* Progress Bar */}
            {showProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            
            {/* Title always visible at bottom left */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="font-medium text-white text-sm line-clamp-2">{movie.title}</h3>
            </div>

            {/* Hover Controls */}
            {isHovered && (
              <>
                {/* Play Button in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayClick}
                    className="bg-white/90 hover:bg-white text-black p-4 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>

                {/* Heart Button Bottom Right */}
                <button
                  onClick={handleSave}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                </button>
              </>
            )}

            {/* Resume Button Overlay */}
            {showResumeButton && !isHovered && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movie Poster */}
            <div className="aspect-video">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Movie Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{movie.year}</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {movie.genre}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                {movie.description || "No description available for this content."}
              </p>
              
              <div className="flex items-center space-x-3 pt-4">
                <Link
                  to={`/movie/${movie.id}`}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </Link>
                <button
                  onClick={handleSave}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieCard;
