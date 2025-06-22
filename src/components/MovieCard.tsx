
import { Link } from "react-router-dom";
import { Star, Heart, Play, X } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useContent } from "@/hooks/useContent";
import { useChannels } from "@/hooks/useChannels";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MovieCardProps {
  movie: Movie;
  showSaveButton?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  showResumeButton?: boolean;
}

// Global state to manage hover interactions
let isAnyCardTransitioning = false;
let currentHoveredCard: string | null = null;

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return null;
};

const MovieCard = ({ 
  movie, 
  showSaveButton = true, 
  showProgress = false, 
  progressPercent = 0,
  showResumeButton = false 
}: MovieCardProps) => {
  const { favoriteIds, addToFavorites, removeFromFavorites } = useUserFavorites();
  const { content } = useContent();
  const { channels } = useChannels();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleMouseEnter = () => {
    // Show immediate border
    setIsMouseOver(true);
    
    // Clear any exit timeout
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }

    // Don't allow hover if another card is transitioning or if this card is already hovered
    if (isAnyCardTransitioning || currentHoveredCard === movie.id) {
      return;
    }

    // Set a delay before showing hover effect
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isAnyCardTransitioning && isMouseOver) {
        currentHoveredCard = movie.id;
        setIsHovered(true);
      }
    }, 1000); // 1 second delay
  };

  const handleMouseLeave = () => {
    // Remove immediate border effect
    setIsMouseOver(false);
    
    // Clear hover timeout if still pending
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Only proceed if this card is currently hovered
    if (currentHoveredCard === movie.id) {
      setIsHovered(false);
      isAnyCardTransitioning = true;
      
      // Set timeout to allow transition to complete before allowing new hovers
      exitTimeoutRef.current = setTimeout(() => {
        currentHoveredCard = null;
        isAnyCardTransitioning = false;
      }, 300); // Match transition duration
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      // Reset global state if this card was the current one
      if (currentHoveredCard === movie.id) {
        currentHoveredCard = null;
        isAnyCardTransitioning = false;
      }
    };
  }, [movie.id]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleModalPlayClick = () => {
    // Find the content item from backend data
    const contentItem = content.find(item => item.id === movie.id);
    if (contentItem?.video_url) {
      setIsPlaying(true);
    }
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  // Get recommended content from backend (same channel or genre)
  const recommendedContent = content
    .filter(item => 
      item.id !== movie.id && 
      (item.genre === movie.genre || item.channel_id === movie.channelId)
    )
    .slice(0, 6);

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

  // Get the video URL from backend content
  const contentItem = content.find(item => item.id === movie.id);
  const videoUrl = contentItem?.video_url;

  // Convert YouTube URL to embed format if needed
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) || videoUrl : null;

  // Get channel information
  const channel = channels.find(ch => ch.id === movie.channelId);

  return (
    <>
      <div className="group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="block cursor-pointer" onClick={handleCardClick}>
          <div className={`relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 ${
            isHovered 
              ? 'scale-125 shadow-2xl shadow-black/60 z-50' 
              : 'shadow-lg z-10'
          } ${
            isMouseOver && !isHovered
              ? 'ring-2 ring-blue-600'
              : ''
          }`}
          style={{
            aspectRatio: '16/9',
            boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.8)' : '0 4px 8px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: isHovered ? 50 : 10
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
      
      {/* Full Screen Video Player */}
      {isPlaying && embedUrl && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={handleCloseVideo}
            className="absolute top-4 right-4 z-[10000] bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Video Player */}
          <div className="w-full h-full flex items-center justify-center">
            {embedUrl.includes('youtube.com/embed') ? (
              <iframe
                src={`${embedUrl}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&playsinline=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onError={() => {
                  console.log('YouTube video failed to load');
                }}
              />
            ) : (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onError={() => {
                  console.log('Video failed to load');
                  setIsPlaying(false);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Netflix-style Movie Modal */}
      <Dialog open={showModal && !isPlaying} onOpenChange={setShowModal}>
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
                      onClick={handleModalPlayClick}
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
                      onClick={handleSave}
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

              {/* Content Section - reduced margin */}
              <div className="bg-gray-900 p-8" style={{ marginTop: '20px' }}>
                <div className="mb-8">
                  {/* Description */}
                  {movie.description && (
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {movie.description}
                    </p>
                  )}
                </div>

                {/* More Like This Section */}
                {recommendedContent.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">More Like This</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
                      {recommendedContent.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                          <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800">
                            <img
                              src={item.poster_url || '/placeholder.svg'}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current" />
                            </div>
                          </div>
                          <h4 className="text-sm font-medium text-white mt-2 line-clamp-2">{item.title}</h4>
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
    </>
  );
};

export default MovieCard;
