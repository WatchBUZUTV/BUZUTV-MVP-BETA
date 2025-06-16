
import { Link } from "react-router-dom";
import { Star, Heart, Play, Expand, Plus, Check, X } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface MovieCardProps {
  movie: Movie;
  showSaveButton?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  showResumeButton?: boolean;
}

const MovieCard = ({ 
  movie, 
  showSaveButton = true, 
  showProgress = false, 
  progressPercent = 0,
  showResumeButton = false 
}: MovieCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showExpandedModal, setShowExpandedModal] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowExpandedModal(true);
  };

  const handleCloseModal = () => {
    setShowExpandedModal(false);
  };

  return (
    <>
      <div className="group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <HoverCard openDelay={800} closeDelay={200}>
          <HoverCardTrigger asChild>
            <Link to={`/movie/${movie.id}`} className="block">
              <div className={`relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 ${isHovered ? 'scale-110 shadow-2xl z-10' : ''}`}>
                <div className="aspect-[3/2] overflow-hidden">
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
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                
                {/* Hover Controls */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <button className="bg-white text-black px-3 py-1 rounded-full font-semibold flex items-center space-x-1 text-sm">
                          <Play className="w-3 h-3" />
                          <span>Play</span>
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="bg-gray-800/80 hover:bg-gray-700/80 text-white p-1.5 rounded-full transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                          </button>
                          <button
                            onClick={handleExpandClick}
                            className="bg-gray-800/80 hover:bg-gray-700/80 text-white p-1.5 rounded-full transition-colors"
                          >
                            <Expand className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{movie.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white">{movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save/Favorite Button */}
                {showSaveButton && !isHovered && (
                  <button
                    onClick={handleSave}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  </button>
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
            </Link>
          </HoverCardTrigger>
          
          <HoverCardContent className="w-80 p-4 bg-gray-800 border-gray-700">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-white">{movie.title}</h3>
                <Link to={`/movie/${movie.id}`}>
                  <Expand className="w-4 h-4 text-gray-400 hover:text-white" />
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{movie.year}</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {movie.genre}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm line-clamp-3">{movie.description}</p>
              
              <div className="flex items-center space-x-2">
                <button className="bg-white text-black px-3 py-1.5 rounded font-semibold flex items-center space-x-1 text-sm">
                  <Play className="w-3 h-3" />
                  <span>Play</span>
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                </button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        {/* Title below the card */}
        <div className="mt-2">
          <h3 className="font-medium text-white text-sm line-clamp-2">{movie.title}</h3>
        </div>
      </div>

      {/* Expanded Modal */}
      {showExpandedModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden w-[60%] h-[90%] max-w-4xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-full overflow-y-auto">
              {/* Video Section */}
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&mute=1`}
                  title={movie.title}
                  className="w-full h-full"
                  allow="autoplay"
                />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{movie.year}</span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded">
                        {movie.genre}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch Now</span>
                  </Link>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                </div>
                
                {/* Episodes Section (for series) */}
                {movie.type === 'tv' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
                    <div className="grid gap-3">
                      {[1, 2, 3, 4, 5].map((ep) => (
                        <div key={ep} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                          <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
                            {ep}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">Episode {ep}</h4>
                            <p className="text-sm text-gray-400">Episode description here...</p>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
