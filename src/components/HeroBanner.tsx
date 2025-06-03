
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
    <div className="relative h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${currentMovie.posterUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {currentMovie.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-3">
              {currentMovie.description}
            </p>
            <div className="flex items-center space-x-4 mb-8">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {currentMovie.genre}
              </span>
              <span className="text-gray-300">{currentMovie.year}</span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white">{currentMovie.rating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Watch Now</span>
              </Link>
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center space-x-2 bg-gray-800/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors"
              >
                <Info className="w-5 h-5" />
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
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
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
