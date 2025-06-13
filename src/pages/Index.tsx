
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { mockMovies, channels } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import ChannelCard from "@/components/ChannelCard";
import HeroBanner from "@/components/HeroBanner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const featuredMovies = mockMovies.filter(movie => movie.isFeatured);
  const trendingMovies = mockMovies.filter(movie => movie.isTrending);
  
  const filteredMovies = mockMovies.filter(movie => {
    return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const actionMovies = mockMovies.filter(movie => movie.genre === "Action");
  const dramaMovies = mockMovies.filter(movie => movie.genre === "Drama");
  const romanceMovies = mockMovies.filter(movie => movie.genre === "Romance");
  const comedyMovies = mockMovies.filter(movie => movie.genre === "Comedy");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
              <Link to="/movies" className="hover:text-blue-400 transition-colors">Movies</Link>
              <Link to="/series" className="hover:text-blue-400 transition-colors">Series</Link>
              <Link to="/my-list" className="hover:text-blue-400 transition-colors">My List</Link>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <Link to="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                Admin
              </Link>
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
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Link to="/" className="block hover:text-blue-400 transition-colors">Home</Link>
                <Link to="/movies" className="block hover:text-blue-400 transition-colors">Movies</Link>
                <Link to="/series" className="block hover:text-blue-400 transition-colors">Series</Link>
                <Link to="/my-list" className="block hover:text-blue-400 transition-colors">My List</Link>
                <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16">
        {/* Hero Banner */}
        <HeroBanner movies={featuredMovies} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Results */}
          {searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Search Results ({filteredMovies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Channels */}
          {!searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Channels</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex-shrink-0 w-48">
                      <ChannelCard channel={channel} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Trending Now */}
          {!searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {trendingMovies.map((movie) => (
                    <div key={movie.id} className="flex-shrink-0 w-64">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Genre Sections */}
          {!searchQuery && (
            <>
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Action</h2>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                    {actionMovies.map((movie) => (
                      <div key={movie.id} className="flex-shrink-0 w-64">
                        <MovieCard movie={movie} />
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
                        <MovieCard movie={movie} />
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
                        <MovieCard movie={movie} />
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
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <p>&copy; 2024 BizuTV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
