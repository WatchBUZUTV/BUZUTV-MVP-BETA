
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import ChannelModal from "@/components/ChannelModal";
import SearchOverlay from "@/components/SearchOverlay";
import ProtectedContent from "@/components/auth/ProtectedContent";
import Navbar from "@/components/Navbar";
import HomeHeroBanner from "@/components/HomeHeroBanner";
import MovieHoverRow from "@/components/MovieHoverRow";
import { useMockContent } from "@/hooks/useMockContent";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { Movie } from "@/data/mockMovies";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  console.log('Index component rendering');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const { movies, channels, isLoading } = useMockContent();
  const { subscriptionIds, toggleSubscription } = useUserSubscriptions();
  const { isLoggedIn, setShowLoginModal } = useAuth();

  console.log('Channels data:', channels);
  console.log('Subscription IDs:', subscriptionIds);

  // Filter and organize content
  const trendingMovies = movies.filter(item => item.isTrending);
  const actionMovies = movies.filter(item => item.genre === "Action");
  const dramaMovies = movies.filter(item => item.genre === "Drama");
  const romanceMovies = movies.filter(item => item.genre === "Romance");
  const comedyMovies = movies.filter(item => item.genre === "Comedy");
  const documentaryMovies = movies.filter(item => item.genre === "Documentary");
  const informationalMovies = movies.filter(item => item.genre === "Informational");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleChannelClick = (channel: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedChannel(channel);
    setShowChannelModal(true);
  };

  const handleCloseChannelModal = () => {
    setShowChannelModal(false);
    setSelectedChannel(null);
  };

  const showSearchOverlay = searchQuery.trim().length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const ContentRow = ({ title, movies: movieList }: { title: string; movies: Movie[] }) => (
    <section className="mb-3">
      <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          skipSnaps: false,
        }}
        className="w-full px-4"
      >
        <CarouselContent className="-ml-1">
          <MovieHoverRow className="flex">
            {movieList.map((movie) => (
              <CarouselItem key={movie.id} className="pl-1 basis-auto">
                <div className="w-64">
                  <ProtectedContent>
                    <MovieCard movie={movie} />
                  </ProtectedContent>
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Channel Modal */}
      <ChannelModal 
        isOpen={showChannelModal}
        onClose={handleCloseChannelModal}
        channel={selectedChannel}
      />

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

      {/* Only show home content when not searching */}
      {!showSearchOverlay && (
        <div className="pt-16">
          {/* Hero Banner */}
          <HomeHeroBanner />

          <div className="max-w-full px-2 py-8">
            {/* Top Channels */}
            {channels && channels.length > 0 && (
              <section className="mb-3">
                <h2 className="text-2xl font-bold mb-4 px-4">Top Channels</h2>
                <Carousel
                  opts={{
                    align: "start",
                    skipSnaps: false,
                  }}
                  className="w-full px-4"
                >
                  <CarouselContent className="-ml-1">
                    {channels.map((channel) => (
                      <CarouselItem key={channel.id} className="pl-1 basis-auto">
                        <div className="w-48">
                          <div onClick={() => handleChannelClick(channel)}>
                            <ChannelCard 
                              channel={channel}
                              isSubscribed={subscriptionIds.includes(channel.id)}
                              onSubscribe={toggleSubscription}
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </section>
            )}

            {/* Show content only if we have any */}
            {movies.length > 0 || channels.length > 0 ? (
              <>
                {/* Content Rows */}
                {trendingMovies.length > 0 && <ContentRow title="Trending Now" movies={trendingMovies} />}
                {actionMovies.length > 0 && <ContentRow title="Action" movies={actionMovies} />}
                {dramaMovies.length > 0 && <ContentRow title="Drama" movies={dramaMovies} />}
                {romanceMovies.length > 0 && <ContentRow title="Romance" movies={romanceMovies} />}
                {comedyMovies.length > 0 && <ContentRow title="Comedy" movies={comedyMovies} />}
                {documentaryMovies.length > 0 && <ContentRow title="Documentary" movies={documentaryMovies} />}
                {informationalMovies.length > 0 && <ContentRow title="Informational" movies={informationalMovies} />}
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No content available</h2>
                <p className="text-gray-400">Content will appear here once it's added to the platform</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
              <p>&copy; 2024 BUZUTV. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
