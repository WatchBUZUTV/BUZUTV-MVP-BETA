
import { useState, useMemo } from "react";
import { genres } from "@/data/mockMovies";
import SeriesCard from "@/components/SeriesCard";
import MovieHoverRow from "@/components/MovieHoverRow";
import HeroBanner from "@/components/HeroBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import { useAppContent } from "@/hooks/useAppContent";
import ContentRow from "@/components/ContentRow";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { seriesContent, isLoading } = useAppContent();

  const filteredSeries = useMemo(() => 
    searchQuery.trim() 
      ? seriesContent.all.filter(show => 
          show.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [],
    [seriesContent.all, searchQuery]
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

  const SeriesRow = ({ title, series }: { title: string; series: typeof seriesContent.all }) => (
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
            {series.map((show) => (
              <CarouselItem key={show.id} className="pl-1 basis-auto">
                <div className="w-64">
                  <SeriesCard series={show} />
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
        {showSearchOverlay && (
          <SearchOverlay 
            isOpen={true} 
            onClose={handleClearSearch}
            searchQuery={searchQuery}
          />
        )}

        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchClear={handleClearSearch}
        />

        <div className="pt-16">
          {searchQuery && !showSearchOverlay && (
            <div className="max-w-full px-2 py-4">
              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-3 px-4">
                  Search Results ({filteredSeries.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4">
                  {filteredSeries.map((show) => (
                    <SeriesCard key={show.id} series={show} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {!searchQuery && (
            <>
              {seriesContent.all.length > 0 ? (
                <>
                  <div className="max-w-full px-2 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 px-4">
                      <div className="lg:col-span-2">
                        <HeroBanner movies={seriesContent.featured.length > 0 ? seriesContent.featured : seriesContent.all.slice(0, 3)} />
                      </div>
                      
                      <div>
                        <h2 className="text-2xl font-bold mb-3">Top Ranked Series</h2>
                        <div className="space-y-2">
                          {seriesContent.topRanked.map((show, index) => (
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

                  <div className="max-w-full pb-4">
                    <SeriesRow title="Recommended" series={seriesContent.recommended} />
                    <SeriesRow title="Trending Series" series={seriesContent.trending} />
                    <SeriesRow title="New Series" series={seriesContent.new} />
                    
                    {Object.entries(seriesContent.byGenre).map(([genre, genreShows]) => (
                      genreShows.length > 0 && (
                        <SeriesRow key={genre} title={genre} series={genreShows} />
                      )
                    ))}
                  </div>
                </>
              ) : (
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
