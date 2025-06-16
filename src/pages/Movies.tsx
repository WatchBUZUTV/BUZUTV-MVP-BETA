import { useState } from "react";
import { mockMovies, genres } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import HeroBanner from "@/components/HeroBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const showSearchOverlay = searchQuery.trim().length > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Search Overlay */}
        {showSearchOverlay && (
          <SearchOverlay 
            isOpen={true} 
            onClose={handleClearSearch}
            searchQuery={searchQuery}
          />
        )}

        {/* Navigation */}
        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchClear={handleClearSearch}
        />

        <div className="pt-16">
          {/* Search Results */}
          {searchQuery && !showSearchOverlay && (
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
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
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
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
                            <div className="font-medium hover:text-blue-400">
                              {movie.title}
                            </div>
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
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-8">
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
