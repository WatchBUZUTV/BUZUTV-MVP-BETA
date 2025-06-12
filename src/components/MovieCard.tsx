
import { Link } from "react-router-dom";
import { Star, Bookmark, BookmarkPlus } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  showSaveButton?: boolean;
}

const MovieCard = ({ movie, showSaveButton = true }: MovieCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  return (
    <div className="group">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
          <div className="aspect-square overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {/* Save Button */}
          {showSaveButton && (
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              {isSaved ? (
                <Bookmark className="w-4 h-4 fill-current" />
              ) : (
                <BookmarkPlus className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{movie.year}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Title below the card */}
      <div className="mt-2">
        <h3 className="font-medium text-white text-sm line-clamp-2">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
