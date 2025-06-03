
import AdminLayout from "@/components/admin/AdminLayout";
import { mockMovies, genres } from "@/data/mockMovies";
import { Film, Star, TrendingUp, Users } from "lucide-react";

const AdminDashboard = () => {
  const totalMovies = mockMovies.length;
  const totalGenres = genres.length - 1; // Exclude "All"
  const featuredCount = mockMovies.filter(movie => movie.isFeatured).length;
  const trendingCount = mockMovies.filter(movie => movie.isTrending).length;

  const stats = [
    {
      title: "Total Movies",
      value: totalMovies,
      icon: Film,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Total Genres",
      value: totalGenres,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Featured Movies",
      value: featuredCount,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Trending Movies",
      value: trendingCount,
      icon: TrendingUp,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ];

  const genreStats = genres.slice(1).map(genre => ({
    genre,
    count: mockMovies.filter(movie => movie.genre === genre).length
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
          <p className="text-gray-400">Welcome to BizuTV Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Genre Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Movies by Genre</h3>
          <div className="space-y-3">
            {genreStats.map((stat) => (
              <div key={stat.genre} className="flex items-center justify-between">
                <span className="text-gray-300">{stat.genre}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(stat.count / totalMovies) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-white font-medium w-8 text-right">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Movies */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Movies</h3>
          <div className="space-y-3">
            {mockMovies.slice(0, 5).map((movie) => (
              <div key={movie.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{movie.title}</h4>
                  <p className="text-gray-400 text-sm">{movie.genre} • {movie.year}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
