
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { mockMovies } from "@/data/mockMovies";

const MyList = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // For demo purposes, showing first few movies as "saved"
  const savedMovies = mockMovies.slice(0, 4);
  const continueWatching = mockMovies.slice(0, 3);
  
  // Filter saved movies based on search
  const filteredSavedMovies = savedMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Link to="/series" className="hover:text-blue-400 transition-colors">Series</Link>
              <Link to="/my-list" className="text-blue-400">My List</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search your list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search your list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Link to="/" className="block hover:text-blue-400 transition-colors">Home</Link>
                <Link to="/movies" className="block hover:text-blue-400 transition-colors">Movies</Link>
                <Link to="/series" className="block hover:text-blue-400 transition-colors">Series</Link>
                <Link to="/my-list" className="block text-blue-400">My List</Link>
                <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16">
        {/* Header - Black background with logo */}
        <div className="h-[40vh] bg-black flex items-center justify-center">
          <h1 className="text-5xl font-bold">
            Bizu<span className="text-blue-500">TV</span>
          </h1>
        </div>

        {/* Commented out Resume Header for potential reuse */}
        {/* 
        {recentItem && (
          <div className="relative h-[40vh] overflow-hidden mb-8">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${recentItem.posterUrl})`,
              }}
            >
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <p className="text-sm text-gray-300 mb-2">Continue Watching</p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                    {recentItem.title}
                  </h1>
                  <p className="text-base text-gray-200 mb-4 line-clamp-2">
                    {recentItem.description}
                  </p>
                  
                  <div className="w-full bg-gray-600 rounded-full h-1 mb-4">
                    <div className="bg-red-600 h-1 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  
                  <Link
                    to={`/movie/${recentItem.id}`}
                    className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-flex"
                  >
                    <Play className="w-5 h-5" />
                    <span>Resume</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {savedMovies.length > 0 ? (
            <>
              {/* Continue Watching */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                    {continueWatching.map((movie) => (
                      <div key={movie.id} className="flex-shrink-0 w-64">
                        <MovieCard 
                          movie={movie} 
                          showSaveButton={false} 
                          showProgress={true}
                          progressPercent={Math.floor(Math.random() * 70) + 10}
                          showResumeButton={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Saved */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Saved ({filteredSavedMovies.length})</h2>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                    {filteredSavedMovies.map((movie) => (
                      <div key={movie.id} className="flex-shrink-0 w-64">
                        <MovieCard movie={movie} showSaveButton={false} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Removed Recommended section as requested */}
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Your list is empty</h2>
              <p className="text-gray-400 mb-8">Start adding movies and series to your list</p>
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
