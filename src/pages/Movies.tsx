
import { useState, useMemo } from "react";
import { genres } from "@/data/mockMovies";
import OptimizedMovieCard from "@/components/OptimizedMovieCard";
import MovieHoverRow from "@/components/MovieHoverRow";
import HeroBanner from "@/components/HeroBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import ContentRow from "@/components/ContentRow";

import { useAppContent } from "@/hooks/useAppContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { movieContent, isLoading } = useAppContent();

  // Only filter for search, everything else is pre-computed
  const filteredMovies = useMemo(() => 
    searchQuery.trim() 
      ? movieContent.all.filter(movie => 
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [],
    [movieContent.all, searchQuery]
  );

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

  const MovieRow = ({ title, movies }: { title: string; movies: typeof movieContent.all }) => (
    <section className="mb-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          skipSnaps: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          <MovieHoverRow className="flex">
            {movies.map((movie) => (
              <CarouselItem key={movie.id} className="pl-1 basis-auto">
                <div className="w-64">
                  <OptimizedMovieCard movie={movie} />
                </div>
              </CarouselItem>
            ))}
          </MovieHoverRow>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
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
                    <OptimizedMovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Main Layout */}
          {!searchQuery && (
            <>
              {movieContent.all.length > 0 ? (
                <>
                  {/* Top Section */}
                  <div className="max-w-full px-2 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 px-4">
                      {/* Left - Hero Banner */}
                      <div className="lg:col-span-2">
                        <HeroBanner movies={movieContent.featured} />
                      </div>
                      
                      {/* Right - Top Ranked */}
                      <div>
                        <h2 className="text-2xl font-bold mb-3">Top Ranked Movies</h2>
                        <div className="space-y-2">
                          {movieContent.topRanked.map((movie, index) => (
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
                    <ContentRow title="Recommended" movies={movieContent.recommended} />
                    <ContentRow title="Trending Movies" movies={movieContent.trending} />
                    <ContentRow title="New Movies" movies={movieContent.new} />
                    
                    {/* Genre Sections */}
                    {Object.entries(movieContent.byGenre).map(([genre, genreMovies]) => (
                      genreMovies.length > 0 && (
                        <ContentRow key={genre} title={genre} movies={genreMovies} />
                      )
                    ))}
                  </div>
                </>
              ) : (
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
