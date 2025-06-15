import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Upload, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockMovies, genres, channels } from "@/data/mockMovies";

const AdminAddMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
    posterFile: null as File | null,
    posterUrl: "",
    genre: "Action",
    rating: 0,
    year: new Date().getFullYear(),
    isTrending: false,
    type: "movie" as "movie" | "tv",
    channelId: "",
    // Series-specific fields
    seasons: 1,
    episodes: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [channelSearch, setChannelSearch] = useState("");
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  useEffect(() => {
    if (isEdit && id) {
      const movie = mockMovies.find(m => m.id === id);
      if (movie) {
        setFormData({
          title: movie.title,
          description: movie.description,
          youtubeId: movie.youtubeId,
          posterFile: null,
          posterUrl: movie.posterUrl,
          genre: movie.genre,
          rating: movie.rating,
          year: movie.year,
          isTrending: movie.isTrending,
          type: movie.type,
          channelId: movie.channelId || "",
          seasons: movie.seasons || 1,
          episodes: movie.episodes || 1
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
      case "posterFile":
        if (!value && !formData.posterUrl) {
          newErrors.posterFile = "Poster image is required";
        } else {
          delete newErrors.posterFile;
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
      case "seasons":
        if (formData.type === "tv" && value < 1) {
          newErrors.seasons = "Must have at least 1 season";
        } else {
          delete newErrors.seasons;
        }
        break;
      case "episodes":
        if (formData.type === "tv" && value < 1) {
          newErrors.episodes = "Must have at least 1 episode";
        } else {
          delete newErrors.episodes;
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, posterFile: file, posterUrl: URL.createObjectURL(file) }));
      validateField("posterFile", file);
    }
  };

  const selectChannel = (channel: typeof channels[0]) => {
    setFormData(prev => ({ ...prev, channelId: channel.id }));
    setChannelSearch(channel.name);
    setShowChannelDropdown(false);
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           formData.title && formData.description && formData.youtubeId && 
           (formData.posterFile || formData.posterUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(isEdit ? `${formData.type === 'movie' ? 'Movie' : 'Series'} updated successfully!` : `${formData.type === 'movie' ? 'Movie' : 'Series'} added successfully!`);
      navigate("/admin/movies");
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? `Edit ${formData.type === 'movie' ? 'Movie' : 'Series'}` : `Add New ${formData.type === 'movie' ? 'Movie' : 'Series'}`}
          </h2>
          <p className="text-gray-400">
            {isEdit ? `Update ${formData.type} details` : `Add a new ${formData.type} to your platform`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">Series</option>
                </select>
              </div>

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
                  placeholder={`Enter ${formData.type} title`}
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

              {formData.type === "tv" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Seasons *
                    </label>
                    <input
                      type="number"
                      name="seasons"
                      value={formData.seasons}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                        errors.seasons ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                      }`}
                    />
                    {errors.seasons && <p className="text-red-400 text-sm mt-1">{errors.seasons}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Episodes *
                    </label>
                    <input
                      type="number"
                      name="episodes"
                      value={formData.episodes}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                        errors.episodes ? "border-red-500" : "border-gray-600 focus:border-blue-500"
                      }`}
                    />
                    {errors.episodes && <p className="text-red-400 text-sm mt-1">{errors.episodes}</p>}
                  </div>
                </>
              )}
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
                placeholder={`Enter ${formData.type} description`}
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
                  Poster Image *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> poster image
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {formData.posterUrl && (
                    <div className="relative">
                      <img
                        src={formData.posterUrl}
                        alt="Poster preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, posterFile: null, posterUrl: "" }))}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.posterFile && <p className="text-red-400 text-sm mt-1">{errors.posterFile}</p>}
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
            <h3 className="text-lg font-semibold text-white mb-4">Channel Assignment</h3>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assign to Channel (Optional)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={channelSearch}
                  onChange={(e) => {
                    setChannelSearch(e.target.value);
                    setShowChannelDropdown(true);
                  }}
                  onFocus={() => setShowChannelDropdown(true)}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Search for a channel..."
                />
              </div>
              
              {showChannelDropdown && filteredChannels.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => selectChannel(channel)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors text-white flex items-center space-x-3"
                    >
                      <img
                        src={channel.logoUrl}
                        alt={channel.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-gray-400">{channel.description.slice(0, 50)}...</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Trending {formData.type === 'movie' ? 'Movie' : 'Series'}</span>
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
              {isEdit ? `Update ${formData.type === 'movie' ? 'Movie' : 'Series'}` : `Add ${formData.type === 'movie' ? 'Movie' : 'Series'}`}
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
