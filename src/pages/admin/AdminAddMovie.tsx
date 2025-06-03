
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockMovies, genres } from "@/data/mockMovies";

const AdminAddMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
    posterUrl: "",
    genre: "Action",
    rating: 0,
    year: new Date().getFullYear(),
    isFeatured: false,
    isTrending: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const movie = mockMovies.find(m => m.id === id);
      if (movie) {
        setFormData({
          title: movie.title,
          description: movie.description,
          youtubeId: movie.youtubeId,
          posterUrl: movie.posterUrl,
          genre: movie.genre,
          rating: movie.rating,
          year: movie.year,
          isFeatured: movie.isFeatured,
          isTrending: movie.isTrending
        });
      }
    }
  }, [isEdit, id]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else {
          delete newErrors.title;
        }
        break;
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else {
          delete newErrors.description;
        }
        break;
      case "youtubeId":
        if (!value.trim()) {
          newErrors.youtubeId = "YouTube ID is required";
        } else if (!/^[a-zA-Z0-9_-]{11}$/.test(value)) {
          newErrors.youtubeId = "Invalid YouTube ID format";
        } else {
          delete newErrors.youtubeId;
        }
        break;
      case "posterUrl":
        if (!value.trim()) {
          newErrors.posterUrl = "Poster URL is required";
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value)) {
          newErrors.posterUrl = "Invalid image URL";
        } else {
          delete newErrors.posterUrl;
        }
        break;
      case "rating":
        if (value < 0 || value > 10) {
          newErrors.rating = "Rating must be between 0 and 10";
        } else {
          delete newErrors.rating;
        }
        break;
      case "year":
        if (value < 1900 || value > 2030) {
          newErrors.year = "Year must be between 1900 and 2030";
        } else {
          delete newErrors.year;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                    type === "number" ? Number(value) : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           formData.title && formData.description && formData.youtubeId && formData.posterUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(isEdit ? "Movie updated successfully!" : "Movie added successfully!");
      navigate("/admin/movies");
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Movie" : "Add New Movie"}
          </h2>
          <p className="text-gray-400">
            {isEdit ? "Update movie details" : "Add a new movie to your platform"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.title ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder="Enter movie title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {genres.slice(1).map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating (0-10) *
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.rating ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                />
                {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max="2030"
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.year ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                />
                {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                  errors.description ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                }`}
                placeholder="Enter movie description"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube Video ID *
                </label>
                <input
                  type="text"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.youtubeId ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder="e.g., dQw4w9WgXcQ"
                />
                {errors.youtubeId && <p className="text-red-400 text-sm mt-1">{errors.youtubeId}</p>}
                <p className="text-gray-400 text-sm mt-1">Extract from YouTube URL: youtube.com/watch?v=YOUR_ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster Image URL *
                </label>
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.posterUrl ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                  }`}
                  placeholder="https://example.com/poster.jpg"
                />
                {errors.posterUrl && <p className="text-red-400 text-sm mt-1">{errors.posterUrl}</p>}
              </div>
            </div>

            {formData.youtubeId && !errors.youtubeId && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
            )}

            {showPreview && formData.youtubeId && (
              <div className="mt-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                    title="Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Featured Movie</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Trending Movie</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/movies")}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isEdit ? "Update Movie" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <p className="font-medium">Please fix the following errors:</p>
          <ul className="text-sm mt-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAddMovie;
