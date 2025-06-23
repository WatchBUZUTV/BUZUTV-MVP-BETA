
import { useState } from "react";
import { genres } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import MovieHoverRow from "@/components/MovieHoverRow";
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

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { movies: allMovies, isLoading } = useMockContent();

  // Filter for series content - database content uses "tv" type after transformation
  const series = allMovies.filter(item => item.type === "tv");
  const featuredSeries = series.filter(show => show.isFeatured);
  const trendingSeries = series.filter(show => show.isTrending);
  const topRankedSeries = series.sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recommendedSeries = series.slice(0, 6);
  const newSeries = series.slice(2, 8);
  
  const filteredSeries = series.filter(show => {
    return show.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const seriesByGenre = genres.reduce((acc, genre) => {
    acc[genre] = series.filter(show => show.genre === genre);
    return acc;
  }, {} as Record<string, typeof series>);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const showSearchOverlay = searchQuery.trim().length > 0;

  console.log('Series page - All movies:', allMovies.length);
  console.log('Series page - Filtered series:', series.length);
  console.log('Series page - Content types:', allMovies.map(item => ({ title: item.title, type: item.type })));

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-2xl">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  const SeriesRow = ({ title, series }: { title: string; series: typeof allMovies }) => (
    <section className="mb-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          skipSnaps: false,
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          <MovieHoverRow className="flex">
            {series.map((show) => (
              <CarouselItem key={show.id} className="pl-1 basis-1/6 min-w-0">
                <MovieCard movie={show} />
              </CarouselItem>
            ))}
          </MovieHoverRow>
        </CarouselContent>
        <CarouselPrevious className="hover:bg-black/80" />
        <CarouselNext className="hover:bg-black/80" />
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
                  Search Results ({filteredSeries.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4">
                  {filteredSeries.map((show) => (
                    <MovieCard key={show.id} movie={show} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Main Layout */}
          {!searchQuery && (
            <>
              {series.length > 0 ? (
                <>
                  {/* Top Section */}
                  <div className="max-w-full px-2 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 px-4">
                      {/* Left - Hero Banner */}
                      <div className="lg:col-span-2">
                        <HeroBanner movies={featuredSeries.length > 0 ? featuredSeries : series.slice(0, 3)} />
                      </div>
                      
                      {/* Right - Top Ranked */}
                      <div>
                        <h2 className="text-2xl font-bold mb-3">Top Ranked Series</h2>
                        <div className="space-y-2">
                          {topRankedSeries.map((show, index) => (
                            <div key={show.id} className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3">
                              <span className="text-2xl font-bold text-blue-500">#{index + 1}</span>
                              <img 
                                src={show.posterUrl} 
                                alt={show.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="font-medium hover:text-blue-400">
                                  {show.title}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {show.year} • ⭐ {show.rating}
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
                    <SeriesRow title="Recommended" series={recommendedSeries} />
                    <SeriesRow title="Trending Series" series={trendingSeries} />
                    <SeriesRow title="New Series" series={newSeries} />
                    
                    {/* Genre Sections */}
                    {Object.entries(seriesByGenre).map(([genre, genreShows]) => (
                      genreShows.length > 0 && (
                        <SeriesRow key={genre} title={genre} series={genreShows} />
                      )
                    ))}
                  </div>
                </>
              ) : (
                /* Empty state for non-demo users */
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-4">No series available</h2>
                  <p className="text-gray-400">Series will appear here once they're added to the platform</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Series;
