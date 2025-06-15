
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Episode {
  id: string;
  season: number;
  episode: number;
  title: string;
  description: string;
  duration: string;
  posterUrl: string;
}

const AdminAddMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const isChannel = location.pathname.includes('channel');
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    year: "",
    rating: "",
    duration: "",
    posterUrl: "",
    trailerUrl: "",
    type: "movie",
    isTrending: false,
    isFeatured: false,
    seasons: "",
    totalEpisodes: ""
  });

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [episodeForm, setEpisodeForm] = useState({
    season: 1,
    episode: 1,
    title: "",
    description: "",
    duration: "",
    posterUrl: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEpisodeInputChange = (field: string, value: string | number) => {
    setEpisodeForm(prev => ({ ...prev, [field]: value }));
  };

  const addOrUpdateEpisode = () => {
    if (!episodeForm.title.trim()) {
      toast.error("Episode title is required");
      return;
    }

    const episodeData = {
      id: editingEpisode?.id || Date.now().toString(),
      season: episodeForm.season,
      episode: episodeForm.episode,
      title: episodeForm.title,
      description: episodeForm.description,
      duration: episodeForm.duration,
      posterUrl: episodeForm.posterUrl
    };

    if (editingEpisode) {
      setEpisodes(prev => prev.map(ep => ep.id === editingEpisode.id ? episodeData : ep));
      toast.success("Episode updated successfully");
    } else {
      setEpisodes(prev => [...prev, episodeData]);
      toast.success("Episode added successfully");
    }

    setEpisodeForm({ season: 1, episode: 1, title: "", description: "", duration: "", posterUrl: "" });
    setShowEpisodeForm(false);
    setEditingEpisode(null);
  };

  const editEpisode = (episode: Episode) => {
    setEpisodeForm({
      season: episode.season,
      episode: episode.episode,
      title: episode.title,
      description: episode.description,
      duration: episode.duration,
      posterUrl: episode.posterUrl
    });
    setEditingEpisode(episode);
    setShowEpisodeForm(true);
  };

  const deleteEpisode = (episodeId: string) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
    toast.success("Episode deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const action = isEditing ? "updated" : "added";
    const contentType = isChannel ? "channel" : formData.type;
    toast.success(`${contentType} ${action} successfully`);
    navigate(isChannel ? "/admin/channels" : "/admin/movies");
  };

  const getSeasonOptions = () => {
    const maxSeasons = parseInt(formData.seasons) || 1;
    return Array.from({ length: maxSeasons }, (_, i) => i + 1);
  };

  const getEpisodeOptions = (season: number) => {
    const maxEpisodes = parseInt(formData.totalEpisodes) || 1;
    return Array.from({ length: maxEpisodes }, (_, i) => i + 1);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit" : "Add"} {isChannel ? "Channel" : "Content"}
            </h2>
            <p className="text-gray-400">
              {isEditing ? "Update" : "Create new"} {isChannel ? "channel" : "content"} for your platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {!isChannel && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="tv">TV Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter description"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Documentary">Documentary</SelectItem>
                    <SelectItem value="Informational">Informational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <Input
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2024"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
                <Input
                  value={formData.rating}
                  onChange={(e) => handleInputChange("rating", e.target.value)}
                  placeholder="8.5"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {formData.type === "tv" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Seasons
                  </label>
                  <Input
                    value={formData.seasons}
                    onChange={(e) => handleInputChange("seasons", e.target.value)}
                    placeholder="3"
                    type="number"
                    min="1"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Episodes per Season
                  </label>
                  <Input
                    value={formData.totalEpisodes}
                    onChange={(e) => handleInputChange("totalEpisodes", e.target.value)}
                    placeholder="10"
                    type="number"
                    min="1"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster URL
                </label>
                <Input
                  value={formData.posterUrl}
                  onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {formData.type === "movie" ? "Duration" : "Trailer URL"}
                </label>
                <Input
                  value={formData.type === "movie" ? formData.duration : formData.trailerUrl}
                  onChange={(e) => handleInputChange(formData.type === "movie" ? "duration" : "trailerUrl", e.target.value)}
                  placeholder={formData.type === "movie" ? "120 min" : "https://example.com/trailer.mp4"}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={formData.isTrending}
                  onCheckedChange={(checked) => handleInputChange("isTrending", checked as boolean)}
                />
                <label htmlFor="trending" className="text-sm text-gray-300">
                  Mark as Trending
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
                />
                <label htmlFor="featured" className="text-sm text-gray-300">
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>

          {/* Episodes Section for TV Series */}
          {formData.type === "tv" && (
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Episodes</h3>
                <Button
                  type="button"
                  onClick={() => setShowEpisodeForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Episode
                </Button>
              </div>

              {showEpisodeForm && (
                <div className="border border-gray-600 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-white">
                      {editingEpisode ? "Edit Episode" : "Add New Episode"}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowEpisodeForm(false);
                        setEditingEpisode(null);
                        setEpisodeForm({ season: 1, episode: 1, title: "", description: "", duration: "", posterUrl: "" });
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Season
                      </label>
                      <Select
                        value={episodeForm.season.toString()}
                        onValueChange={(value) => handleEpisodeInputChange("season", parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getSeasonOptions().map(season => (
                            <SelectItem key={season} value={season.toString()}>
                              Season {season}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Episode Number
                      </label>
                      <Select
                        value={episodeForm.episode.toString()}
                        onValueChange={(value) => handleEpisodeInputChange("episode", parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getEpisodeOptions(episodeForm.season).map(episode => (
                            <SelectItem key={episode} value={episode.toString()}>
                              Episode {episode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Episode Title *
                    </label>
                    <Input
                      value={episodeForm.title}
                      onChange={(e) => handleEpisodeInputChange("title", e.target.value)}
                      placeholder="Enter episode title"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Episode Description
                    </label>
                    <Textarea
                      value={episodeForm.description}
                      onChange={(e) => handleEpisodeInputChange("description", e.target.value)}
                      placeholder="Enter episode description"
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration
                      </label>
                      <Input
                        value={episodeForm.duration}
                        onChange={(e) => handleEpisodeInputChange("duration", e.target.value)}
                        placeholder="45 min"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Episode Poster URL
                      </label>
                      <Input
                        value={episodeForm.posterUrl}
                        onChange={(e) => handleEpisodeInputChange("posterUrl", e.target.value)}
                        placeholder="https://example.com/episode-poster.jpg"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={addOrUpdateEpisode}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {editingEpisode ? "Update Episode" : "Add Episode"}
                  </Button>
                </div>
              )}

              {/* Episodes List */}
              {episodes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-white">Added Episodes ({episodes.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {episodes.map((episode) => (
                      <div key={episode.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                        <div>
                          <div className="text-white font-medium">
                            S{episode.season}E{episode.episode}: {episode.title}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {episode.description.slice(0, 50)}...
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editEpisode(episode)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEpisode(episode.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Create"} {isChannel ? "Channel" : "Content"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddMovie;
