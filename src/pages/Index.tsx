import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import { mockMovies, channels } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import SearchOverlay from "@/components/SearchOverlay";
import ProtectedContent from "@/components/auth/ProtectedContent";
import AdminAccessModal from "@/components/auth/AdminAccessModal";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { user, isLoggedIn, setShowLoginModal, logout } = useAuth();

  const trendingMovies = mockMovies.filter(movie => movie.isTrending);
  const continueWatchingMovies = mockMovies.slice(0, 4); // Mock continue watching

  const actionMovies = mockMovies.filter(movie => movie.genre === "Action");
  const dramaMovies = mockMovies.filter(movie => movie.genre === "Drama");
  const romanceMovies = mockMovies.filter(movie => movie.genre === "Romance");
  const comedyMovies = mockMovies.filter(movie => movie.genre === "Comedy");
  const documentaryMovies = mockMovies.filter(movie => movie.genre === "Documentary");
  const informationalMovies = mockMovies.filter(movie => movie.genre === "Informational");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAdminClick = () => {
    if (user?.isAdmin) {
      setShowAdminModal(true);
    }
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

      {/* Admin Access Modal */}
      <AdminAccessModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                Bizu<span className="text-blue-500">TV</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <ProtectedContent>
                <Link to="/movies" className="hover:text-blue-400 transition-colors">Movies</Link>
              </ProtectedContent>
              <ProtectedContent>
                <Link to="/series" className="hover:text-blue-400 transition-colors">Series</Link>
              </ProtectedContent>
              <ProtectedContent>
                <Link to="/my-list" className="hover:text-blue-400 transition-colors">My List</Link>
              </ProtectedContent>
            </div>

            {/* Search and User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Hi, {user?.name}</span>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
              
              {isLoggedIn && user?.isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Admin
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <Link to="/" className="block hover:text-blue-400 transition-colors">Home</Link>
                <ProtectedContent>
                  <Link to="/movies" className="block hover:text-blue-400 transition-colors">Movies</Link>
                </ProtectedContent>
                <ProtectedContent>
                  <Link to="/series" className="block hover:text-blue-400 transition-colors">Series</Link>
                </ProtectedContent>
                <ProtectedContent>
                  <Link to="/my-list" className="block hover:text-blue-400 transition-colors">My List</Link>
                </ProtectedContent>
                
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Hi, {user?.name}</div>
                    <button
                      onClick={logout}
                      className="block text-left text-gray-400 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block text-left text-gray-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                
                {isLoggedIn && user?.isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="block text-left text-gray-400 hover:text-white transition-colors"
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Only show home content when not searching */}
      {!showSearchOverlay && (
        <div className="pt-16">
          {/* Hero Section - Black background with logo */}
          <div className="h-[50vh] bg-black flex items-center justify-center">
            <h1 className="text-6xl font-bold">
              Bizu<span className="text-blue-500">TV</span>
            </h1>
          </div>

          {/* Commented out Hero Banner for potential reuse */}
          {/* <HeroBanner movies={featuredMovies} /> */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Popular Channels */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Channels</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
              <p>&copy; 2024 BizuTV. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
