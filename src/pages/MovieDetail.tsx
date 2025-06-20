
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Play, Heart, Plus } from "lucide-react";
import { mockMovies } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import { useState, useRef } from "react";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const movie = mockMovies.find(m => m.id === id);

  const handleBack = () => {
    const lastMainPage = localStorage.getItem('lastMainPage');
    if (lastMainPage && lastMainPage !== '/') {
      navigate(lastMainPage);
    } else {
      navigate('/');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handlePlay = () => {
    if (iframeRef.current && movie) {
      // Reload iframe with autoplay enabled
      const playUrl = `https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
      iframeRef.current.src = playUrl;
      setIsPlaying(true);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <button onClick={handleBack} className="text-blue-400 hover:text-blue-300">
            Return to Previous Page
          </button>
        </div>
      </div>
    );
  }

  // Get recommended items (same genre, excluding current movie)
  const recommendedItems = mockMovies
    .filter(m => m.id !== movie.id && m.genre === movie.genre)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={handleBack} className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                Bizu<span className="text-blue-500">TV</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-8 relative">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${movie.youtubeId}?controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
              title={movie.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={handlePlay}
                  className="bg-white/90 hover:bg-white text-black p-6 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Play className="w-12 h-12 fill-current" />
                </button>
              </div>
            )}
          </div>

          {/* Movie Info Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
            {/* Left side - Title and details */}
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{movie.rating}</span>
                </div>
                <span className="text-gray-400">{movie.year}</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                  {movie.genre}
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-3xl">
                {movie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePlay}
                  className="flex items-center space-x-3 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Play</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>My List</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavorited ? 'fill-current text-red-500' : 'text-gray-400'}`} 
                  />
                </button>
              </div>
            </div>
          </div>

          {/* More Like This Section */}
          {recommendedItems.length > 0 && (
            <div className="mt-16 pb-8">
              <h2 className="text-2xl font-bold mb-8">More Like This</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendedItems.map((item) => (
                  <div key={item.id} className="w-full">
                    <MovieCard movie={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
