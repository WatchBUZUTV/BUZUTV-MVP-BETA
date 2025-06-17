
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import MovieForm from '@/components/forms/MovieForm';
import { supabase } from '@/integrations/supabase/client';

const AdminEditMovie = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to load movie');
        navigate('/admin/movies');
        return;
      }

      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Failed to load movie');
      navigate('/admin/movies');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('content')
        .update({
          title: data.title,
          description: data.description || null,
          type: data.type,
          genre: data.genre || null,
          year: data.year ? parseInt(data.year) : null,
          rating: data.rating ? parseFloat(data.rating) : null,
          poster_url: data.posterUrl || null,
          backdrop_url: data.backdropUrl || null,
          video_url: data.videoUrl || null,
          duration_minutes: data.durationMinutes ? parseInt(data.durationMinutes) : null,
          seasons: data.seasons ? parseInt(data.seasons) : null,
          episodes: data.episodes ? parseInt(data.episodes) : null,
          is_featured: data.isFeatured || false,
          is_trending: data.isTrending || false,
          channel_id: data.channelId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating movie:', error);
        toast.error('Failed to update movie');
        return;
      }

      toast.success('Movie updated successfully');
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error('Failed to update movie');
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading movie...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!movie) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Movie not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Edit Movie</h2>
          <p className="text-gray-400">Update movie information</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <MovieForm
            onSubmit={handleSubmit}
            initialData={{
              title: movie.title,
              description: movie.description || '',
              type: movie.type,
              genre: movie.genre || '',
              year: movie.year?.toString() || '',
              rating: movie.rating?.toString() || '',
              posterUrl: movie.poster_url || '',
              backdropUrl: movie.backdrop_url || '',
              videoUrl: movie.video_url || '',
              durationMinutes: movie.duration_minutes?.toString() || '',
              seasons: movie.seasons?.toString() || '',
              episodes: movie.episodes?.toString() || '',
              isFeatured: movie.is_featured || false,
              isTrending: movie.is_trending || false,
              channelId: movie.channel_id || ''
            }}
            isLoading={isLoading}
            submitLabel="Update Movie"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditMovie;
