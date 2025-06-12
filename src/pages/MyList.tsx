
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { mockMovies } from "@/data/mockMovies";

const MyList = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // For demo purposes, showing first few movies as "saved"
  const savedMovies = mockMovies.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                Bizu<span className="text-blue-500">TV</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/movies" className="hover:text-blue-400 transition-colors">Movies</Link>
              <Link to="/tv-shows" className="hover:text-blue-400 transition-colors">TV Shows</Link>
              <Link to="/my-list" className="text-blue-400">My List</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                Admin
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-900 to-blue-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">My List</h1>
            <p className="text-lg text-gray-300">Your saved movies and TV shows</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {savedMovies.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold mb-6">Saved ({savedMovies.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {savedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} showSaveButton={false} />
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Your list is empty</h2>
              <p className="text-gray-400 mb-8">Start adding movies and TV shows to your list</p>
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Content
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
