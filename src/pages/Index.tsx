
import { useState } from "react";
import { mockMovies, channels } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import SearchOverlay from "@/components/SearchOverlay";
import ProtectedContent from "@/components/auth/ProtectedContent";
import Navbar from "@/components/Navbar";

const Index = () => {
  console.log('Index component rendering');
  console.log('mockMovies:', mockMovies);
  console.log('channels:', channels);
  
  const [searchQuery, setSearchQuery] = useState("");

  // Safety checks for data
  const safeMovies = mockMovies || [];
  const safeChannels = channels || [];

  const trendingMovies = safeMovies.filter(movie => movie?.isTrending);
  const continueWatchingMovies = safeMovies.slice(0, 4); // Mock continue watching

  const actionMovies = safeMovies.filter(movie => movie?.genre === "Action");
  const dramaMovies = safeMovies.filter(movie => movie?.genre === "Drama");
  const romanceMovies = safeMovies.filter(movie => movie?.genre === "Romance");
  const comedyMovies = safeMovies.filter(movie => movie?.genre === "Comedy");
  const documentaryMovies = safeMovies.filter(movie => movie?.genre === "Documentary");
  const informationalMovies = safeMovies.filter(movie => movie?.genre === "Informational");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Show search overlay when there's a search query
  const showSearchOverlay = searchQuery.trim().length > 0;

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

          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
            {/* Popular Channels */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Channels</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {safeChannels.map((channel) => (
                    <div key={channel.id} className="flex-shrink-0 w-48">
                      <ProtectedContent>
                        <ChannelCard channel={channel} />
                      </ProtectedContent>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Trending Now */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            {/* Continue Watching */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            {/* Genre Sections */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Action</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Drama</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Romance</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Comedy</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Documentary</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Informational</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 text-center text-gray-400">
              <p>&copy; 2024 BizuTV. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
