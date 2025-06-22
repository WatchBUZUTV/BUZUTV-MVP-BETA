import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight, X, Heart, Star } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent } from "@/hooks/useContent";
import { useChannels } from "@/hooks/useChannels";
import { useUserFavorites } from "@/hooks/useUserFavorites";

interface HeroBannerProps {
  movies: Movie[];
}

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

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { content } = useContent();
  const { channels } = useChannels();
  const { favoriteIds, addToFavorites, removeFromFavorites } = useUserFavorites();

  useEffect(() => {
    if (movies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleWatchNow = () => {
    // Find the content item from backend data
    const contentItem = content.find(item => item.id === currentMovie.id);
    if (contentItem?.video_url) {
      setIsPlaying(true);
    }
  };

  const handleMoreInfo = () => {
    setShowModal(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  const handleModalPlayClick = () => {
    // Find the content item from backend data
    const contentItem = content.find(item => item.id === currentMovie.id);
    if (contentItem?.video_url) {
      setIsPlaying(true);
    }
  };

  const handleSave = () => {
    if (isSaved) {
      removeFromFavorites(currentMovie.id);
    } else {
      addToFavorites(currentMovie.id);
    }
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  
  // Get the video URL from backend content
  const contentItem = content.find(item => item.id === currentMovie.id);
  const videoUrl = contentItem?.video_url;
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) || videoUrl : null;
  
  // Get channel information
  const channel = channels.find(ch => ch.id === currentMovie.channelId);

  // Check if movie is in favorites
  const isSaved = favoriteIds.includes(currentMovie.id);

  // Get recommended content from backend (same channel or genre)
  const recommendedContent = content
    .filter(item => 
      item.id !== currentMovie.id && 
      (item.genre === currentMovie.genre || item.channel_id === currentMovie.channelId)
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

  return (
    <>
      <div className="relative h-[60vh] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${currentMovie.posterUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Content - Positioned with more bottom spacing */}
        <div className="relative z-10 flex items-end h-full pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                {currentMovie.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-4 line-clamp-2">
                {currentMovie.description}
              </p>
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {currentMovie.genre}
                </span>
                <span className="text-gray-300 text-sm">{currentMovie.year}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white text-sm">{currentMovie.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleWatchNow}
                  disabled={!videoUrl}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    videoUrl 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Now</span>
                </button>
                <button
                  onClick={handleMoreInfo}
                  className="flex items-center space-x-2 bg-gray-800/80 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors text-sm"
                >
                  <Info className="w-4 h-4" />
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {movies.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
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

      {/* More Info Modal - Same structure as MovieCard */}
      <Dialog open={showModal && !isPlaying} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[75vw] max-h-[90vh] bg-gray-900 text-white border-none p-0 overflow-hidden">
          <DialogTitle className="sr-only">{currentMovie.title}</DialogTitle>
          <ScrollArea className="h-[90vh]">
            <div className="relative">
              {/* Hero Section */}
              <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={currentMovie.posterUrl}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h1 className="text-5xl font-bold text-white mb-6">{currentMovie.title}</h1>
                  
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
                    
                    <span className="text-white text-xl font-medium">
                      {formatDuration(contentItem?.duration_minutes)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-green-400 font-semibold">{currentMovie.rating}</span>
                    </div>
                    <span className="text-white font-medium">{currentMovie.year}</span>
                    <span className="border border-gray-400 px-2 py-0.5 text-xs text-gray-300 font-medium">
                      TV-MA
                    </span>
                    <span className="text-white">{currentMovie.genre}</span>
                    
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

              <div className="bg-gray-900 p-8" style={{ marginTop: '20px' }}>
                <div className="mb-8">
                  {currentMovie.description && (
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {currentMovie.description}
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

export default HeroBanner;
