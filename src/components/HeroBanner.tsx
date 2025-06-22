
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/data/mockMovies";

interface HeroBannerProps {
  movies: Movie[];
}

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
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

      {/* Content - Moved to bottom left */}
      <div className="relative z-10 flex items-end h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
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
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Watch Now</span>
              </Link>
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center space-x-2 bg-gray-800/80 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors text-sm"
              >
                <Info className="w-4 h-4" />
                <span>More Info</span>
              </Link>
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
  );
};

export default HeroBanner;
