
import { useState } from "react";
import { genres } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import HeroBanner from "@/components/HeroBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import { useMockContent } from "@/hooks/useMockContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { movies: allMovies, isLoading } = useMockContent();

  const movies = allMovies.filter(item => item.type === "movie");
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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-2xl">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  const MovieRow = ({ title, movies }: { title: string; movies: typeof allMovies }) => (
    <section className="mb-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          skipSnaps: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-auto">
              <div className="w-64">
                <MovieCard movie={movie} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-blue-600/80 hover:bg-blue-700/90 border-none text-white -left-6 h-12 w-12" />
        <CarouselNext className="bg-blue-600/80 hover:bg-blue-700/90 border-none text-white -right-6 h-12 w-12" />
      </Carousel>
    </section>
  );

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
            <div className="max-w-full px-2 py-4">
              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-3 px-4">
                  Search Results ({filteredMovies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4">
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
              {movies.length > 0 ? (
                <>
                  {/* Top Section */}
                  <div className="max-w-full px-2 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 px-4">
                      {/* Left - Hero Banner */}
                      <div className="lg:col-span-2">
                        <HeroBanner movies={featuredMovies} />
                      </div>
                      
                      {/* Right - Top Ranked */}
                      <div>
                        <h2 className="text-2xl font-bold mb-3">Top Ranked Movies</h2>
                        <div className="space-y-2">
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
                  <div className="max-w-full pb-4">
                    <MovieRow title="Recommended" movies={recommendedMovies} />
                    <MovieRow title="Trending Movies" movies={trendingMovies} />
                    <MovieRow title="New Movies" movies={newMovies} />
                    
                    {/* Genre Sections */}
                    {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
                      genreMovies.length > 0 && (
                        <MovieRow key={genre} title={genre} movies={genreMovies} />
                      )
                    ))}
                  </div>
                </>
              ) : (
                /* Empty state for non-demo users */
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-4">No movies available</h2>
                  <p className="text-gray-400">Movies will appear here once they're added to the platform</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Movies;
