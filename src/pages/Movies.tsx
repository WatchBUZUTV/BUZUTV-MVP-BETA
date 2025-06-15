import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { mockMovies, genres } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import HeroBanner from "@/components/HeroBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const movies = mockMovies.filter(item => item.type === "movie");
  const featuredMovies = movies.filter(movie => movie.isFeatured);
  const trendingMovies = movies.filter(movie => movie.isTrending);
  const topRankedMovies = movies.sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recommendedMovies = movies.slice(0, 6);
  const newMovies = movies.slice(2, 8);
  
  const filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const moviesByGenre = genres.reduce((acc, genre) => {
    acc[genre] = movies.filter(movie => movie.genre === genre);
    return acc;
  }, {} as Record<string, typeof movies>);

  return (
    <ProtectedRoute>
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
                <Link to="/movies" className="text-blue-400">Movies</Link>
                <Link to="/series" className="hover:text-blue-400 transition-colors">Series</Link>
                <Link to="/my-list" className="hover:text-blue-400 transition-colors">My List</Link>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search movies..."
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

          {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-800 border-t border-gray-700">
              <div className="px-4 py-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Link to="/" className="block hover:text-blue-400 transition-colors">Home</Link>
                  <Link to="/movies" className="block hover:text-blue-400 transition-colors">Movies</Link>
                  <Link to="/series" className="block hover:text-blue-400 transition-colors">Series</Link>
                  <Link to="/my-list" className="block hover:text-blue-400 transition-colors">My List</Link>
                  <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors">Admin</Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="pt-16">
          {/* Search Results */}
          {searchQuery && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Search Results ({filteredMovies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Main Layout */}
          {!searchQuery && (
            <>
              {/* Top Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Left - Hero Banner */}
                  <div className="lg:col-span-2">
                    <HeroBanner movies={featuredMovies} />
                  </div>
                  
                  {/* Right - Top Ranked */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Top Ranked Movies</h2>
                    <div className="space-y-4">
                      {topRankedMovies.map((movie, index) => (
                        <div key={movie.id} className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3">
                          <span className="text-2xl font-bold text-blue-500">#{index + 1}</span>
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <Link to={`/movie/${movie.id}`} className="font-medium hover:text-blue-400">
                              {movie.title}
                            </Link>
                            <div className="text-sm text-gray-400">
                              {movie.year} • ⭐ {movie.rating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Rows */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {/* Recommended */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Recommended</h2>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {recommendedMovies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 w-64">
                          <MovieCard movie={movie} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Trending Movies */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {trendingMovies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 w-64">
                          <MovieCard movie={movie} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* New Movies */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">New Movies</h2>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {newMovies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 w-64">
                          <MovieCard movie={movie} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Genre Sections */}
                {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
                  genreMovies.length > 0 && (
                    <section key={genre} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6">{genre}</h2>
                      <div className="overflow-x-auto">
                        <div className="flex space-x-4 pb-4">
                          {genreMovies.map((movie) => (
                            <div key={movie.id} className="flex-shrink-0 w-64">
                              <MovieCard movie={movie} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Movies;
