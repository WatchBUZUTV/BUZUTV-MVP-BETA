import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { mockMovies, genres } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const movies = mockMovies.filter(item => item.type === "movie");
  const featuredMovies = movies.filter(movie => movie.isFeatured);
  const trendingMovies = movies.filter(movie => movie.isTrending);
  
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const moviesByGenre = genres.slice(1).reduce((acc, genre) => {
    acc[genre] = movies.filter(movie => movie.genre === genre);
    return acc;
  }, {} as Record<string, typeof movies>);

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
              <Link to="/movies" className="text-blue-400">Movies</Link>
              <Link to="/tv-shows" className="hover:text-blue-400 transition-colors">TV Shows</Link>
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
                <Link to="/tv-shows" className="block hover:text-blue-400 transition-colors">TV Shows</Link>
                <Link to="/my-list" className="block hover:text-blue-400 transition-colors">My List</Link>
                <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Movies</h1>
            <p className="text-lg text-gray-300">Discover your next favorite movie</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Genre Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results or All Movies */}
          {searchQuery || selectedGenre !== "All" ? (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {searchQuery ? `Search Results (${filteredMovies.length})` : selectedGenre}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          ) : (
            <>
              {/* Featured Movies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {featuredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>

              {/* Trending Movies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {trendingMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>

              {/* Genre Sections */}
              {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
                genreMovies.length > 0 && (
                  <section key={genre} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">{genre}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {genreMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </section>
                )
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
