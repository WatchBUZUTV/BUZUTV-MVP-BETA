
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { mockMovies } from "@/data/mockMovies";
import MovieCard from "./MovieCard";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
}

const SearchOverlay = ({ isOpen, onClose, searchQuery = "" }: SearchOverlayProps) => {
  const [filteredResults, setFilteredResults] = useState(mockMovies);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(mockMovies);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies and series..."
              value={searchQuery}
              readOnly
              className="bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 w-full focus:outline-none focus:border-blue-500 transition-colors text-white"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery ? `Results for "${searchQuery}" (${filteredResults.length})` : 'Browse All Content'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
