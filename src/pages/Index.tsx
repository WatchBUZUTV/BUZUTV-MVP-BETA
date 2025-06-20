import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import SearchOverlay from "@/components/SearchOverlay";
import ProtectedContent from "@/components/auth/ProtectedContent";
import Navbar from "@/components/Navbar";
import HomeHeroBanner from "@/components/HomeHeroBanner";
import { useMockContent } from "@/hooks/useMockContent";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";

const Index = () => {
  console.log('Index component rendering');
  
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, channels, isLoading } = useMockContent();
  const { subscriptionIds, toggleSubscription } = useUserSubscriptions();

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

  // Show search overlay when there's a search query
  const showSearchOverlay = searchQuery.trim().length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
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
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4 px-4">
                    {channels.map((channel) => (
                      <div key={channel.id} className="flex-shrink-0 w-48">
                        <ProtectedContent>
                          <ChannelCard 
                            channel={channel}
                            isSubscribed={subscriptionIds.includes(channel.id)}
                            onSubscribe={toggleSubscription}
                          />
                        </ProtectedContent>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Show content only if we have any */}
            {movies.length > 0 || channels.length > 0 ? (
              <>
                {/* Trending Now */}
                {trendingMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Trending Now</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {trendingMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Genre Sections */}
                {actionMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Action</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {actionMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {dramaMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Drama</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {dramaMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {romanceMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Romance</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {romanceMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {comedyMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Comedy</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {comedyMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {documentaryMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Documentary</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {documentaryMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {informationalMovies.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-2xl font-bold mb-4 px-4">Informational</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {informationalMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard movie={movie} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </>
            ) : (
              // Empty state for non-demo users
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
