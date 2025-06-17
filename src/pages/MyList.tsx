
import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useMockContent } from "@/hooks/useMockContent";

const MyList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { favoriteIds, isLoading } = useUserFavorites();
  const { movies } = useMockContent();
  
  const savedContent = favoriteIds.length > 0 
    ? movies.filter(item => favoriteIds.includes(item.id))
    : [];
  
  // Filter saved movies based on search
  const filteredSavedMovies = savedContent.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          {/* Header - Black background with logo */}
          <div className="h-[40vh] bg-black flex items-center justify-center">
            <h1 className="text-5xl font-bold">
              Buzu<span className="text-blue-500">TV</span>
            </h1>
          </div>

          <div className="max-w-full px-2 py-8">
            {savedContent.length > 0 ? (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 px-4">
                  Favorites ({filteredSavedMovies.length})
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4 px-4">
                    {filteredSavedMovies.map((movie) => (
                      <div key={movie.id} className="flex-shrink-0 w-64">
                        <MovieCard movie={movie} showSaveButton={false} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">Your favorites list is empty</h2>
                <p className="text-gray-400 mb-8">Start adding movies and series to your favorites</p>
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Content
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyList;
