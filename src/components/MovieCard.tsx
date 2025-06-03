
import { Link } from "react-router-dom";
import { Star, TrendingUp } from "lucide-react";
import { Movie } from "@/data/mockMovies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-white mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{movie.year}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white">{movie.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {movie.isFeatured && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {movie.isTrending && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Trending
            </span>
          )}
        </div>
      </div>
      
      {/* Mobile Info */}
      <div className="mt-2 md:hidden">
        <h3 className="font-medium text-white text-sm line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
