
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import SearchOverlay from "@/components/SearchOverlay";
import ProtectedContent from "@/components/auth/ProtectedContent";
import Navbar from "@/components/Navbar";
import { useMockContent } from "@/hooks/useMockContent";

const Index = () => {
  console.log('Index component rendering');
  
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, channels, isLoading } = useMockContent();

  // Filter and organize content - only if we have content
  const trendingMovies = movies.filter(item => item.isTrending);
  const continueWatchingMovies = movies.slice(0, 4); // Mock continue watching

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
          {/* Hero Section - Black background with logo */}
          <div className="h-[50vh] bg-black flex items-center justify-center">
            <h1 className="text-6xl font-bold">
              Bizu<span className="text-blue-500">TV</span>
            </h1>
          </div>

          <div className="max-w-full px-2 py-8">
            {/* Show content only if we have any */}
            {movies.length > 0 ? (
              <>
                {/* Popular Channels */}
                {channels.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Popular Channels</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {channels.map((channel) => (
                          <div key={channel.id} className="flex-shrink-0 w-48">
                            <ProtectedContent>
                              <ChannelCard channel={channel} />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Trending Now */}
                {trendingMovies.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Trending Now</h2>
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

                {/* Continue Watching */}
                {continueWatchingMovies.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Continue Watching</h2>
                    <div className="overflow-x-auto">
                      <div className="flex space-x-4 pb-4 px-4">
                        {continueWatchingMovies.map((movie) => (
                          <div key={movie.id} className="flex-shrink-0 w-64">
                            <ProtectedContent>
                              <MovieCard 
                                movie={movie} 
                                showProgress={true}
                                progressPercent={Math.floor(Math.random() * 70) + 10}
                                showResumeButton={true}
                              />
                            </ProtectedContent>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Genre Sections */}
                {actionMovies.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Action</h2>
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
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Drama</h2>
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
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Romance</h2>
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
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Comedy</h2>
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
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Documentary</h2>
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
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4">Informational</h2>
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
              <p>&copy; 2024 BizuTV. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
