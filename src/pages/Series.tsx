
import { useState, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
import SeriesModal from "@/components/SeriesModal";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useContent } from "@/hooks/useContent";
import { useChannels } from "@/hooks/useChannels";
import FullscreenPlayer from "@/components/FullscreenPlayer";

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { seriesContent, isLoading } = useAppContent();
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenVideoUrl, setFullscreenVideoUrl] = useState("");
  const [fullscreenVideoTitle, setFullscreenVideoTitle] = useState("");
  const { favoriteIds, addToFavorites, removeFromFavorites } = useUserFavorites();
  const { content } = useContent();
  const { channels } = useChannels();

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

const SeriesRow = ({ title, series }: { title: string; series: typeof seriesContent.all }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  if (series.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto scrollbar-hide px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowY: "hidden" }}
      >
        <MovieHoverRow className="flex space-x-2">
          {series.map((show) => (
            <div key={show.id} className="flex-shrink-0 w-64">
              <SeriesCard series={show} />
            </div>
          ))}
        </MovieHoverRow>
      </div>
    </section>
  );
};

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
                        <div className="flex flex-col space-y-2 w-full" style={{ height: 'calc(60vh - 2rem)' }}>
                          {seriesContent.topRanked.slice(0, 5).map((show, index) => (
                            <div
                              key={show.id}
                              className="relative flex items-center bg-gray-800 rounded-lg shadow-lg p-2 group border-2 border-transparent hover:border-blue-500 hover:border-opacity-80 min-h-[60px] h-[calc((60vh-2rem)/5-0.5rem)] cursor-pointer"
                              onClick={() => setSelectedSeries(show)}
                            >
                              {/* Ranking Badge */}
                              <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-10">
                                <span className="bg-blue-600 text-white text-base font-bold px-3 py-1 rounded-full shadow-lg border-4 border-gray-900">#{index + 1}</span>
                              </div>
                              {/* Poster Image */}
                              <img
                                src={show.posterUrl}
                                alt={show.title}
                                className="w-16 h-20 object-cover rounded-lg mr-3 flex-shrink-0 border-2 border-gray-700"
                              />
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base mb-0.5 line-clamp-1">{show.title}</h3>
                                <div className="flex items-center space-x-2 text-xs text-gray-300 mb-0.5">
                                  <span>{show.year}</span>
                                  <span>•</span>
                                  <span className="flex items-center"><span className="text-yellow-400">★</span> {show.rating}</span>
                                </div>
                                <span className="inline-block bg-black/60 text-xs text-white px-2 py-0.5 rounded">{show.genre}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedSeries && (() => {
                          // Match SeriesCard modal logic
                          const isSaved = favoriteIds.includes(selectedSeries.id);
                          const contentItem = content.find(item => item.id === selectedSeries.id);
                          const videoUrl = contentItem?.video_url;
                          const channel = channels.find(ch => ch.id === selectedSeries.channelId);
                          const recommendedContent = content
                            .filter(item => item.id !== selectedSeries.id && (item.genre === selectedSeries.genre || item.channel_id === selectedSeries.channelId))
                            .slice(0, 6);
                          const handleSaveModal = () => {
                            if (isSaved) {
                              removeFromFavorites(selectedSeries.id);
                            } else {
                              addToFavorites(selectedSeries.id);
                            }
                          };
                          const handlePlayEpisode = (videoUrl: string, episodeTitle: string) => {
                            setFullscreenVideoUrl(videoUrl);
                            setFullscreenVideoTitle(episodeTitle);
                            setIsFullscreen(true);
                          };
                          const handleExitFullscreen = () => {
                            setIsFullscreen(false);
                            setFullscreenVideoUrl("");
                            setFullscreenVideoTitle("");
                          };
                          return (
                            <>
                              {isFullscreen && fullscreenVideoUrl && (
                                <FullscreenPlayer
                                  isOpen={isFullscreen}
                                  onClose={handleExitFullscreen}
                                  videoUrl={fullscreenVideoUrl}
                                  title={fullscreenVideoTitle}
                                />
                              )}
                              <SeriesModal
                                isOpen={!!selectedSeries && !isFullscreen}
                                onClose={() => setSelectedSeries(null)}
                                series={selectedSeries}
                                isSaved={isSaved}
                                onSave={handleSaveModal}
                                onPlayEpisode={handlePlayEpisode}
                                videoUrl={videoUrl}
                                contentItem={contentItem}
                                channel={channel}
                                recommendedContent={recommendedContent}
                              />
                            </>
                          );
                        })()}
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
