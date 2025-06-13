
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Play } from "lucide-react";
import { mockMovies } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = mockMovies.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get recommended items (same genre, excluding current movie)
  const recommendedItems = mockMovies
    .filter(m => m.id !== movie.id && m.genre === movie.genre)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                Bizu<span className="text-blue-500">TV</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>

        {/* Movie Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.youtubeId}`}
                  title={movie.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span>{movie.year}</span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded">
                    {movie.genre}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white">{movie.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Now</span>
              </button>
            </div>
          </div>

          {/* Recommended Section */}
          {recommendedItems.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">More Like This</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-64">
                      <MovieCard movie={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
