
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useUserFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteIds([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('content_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      setFavoriteIds(data?.map(fav => fav.content_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (contentId: string) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          content_id: contentId
        });

      if (error) {
        console.error('Error adding favorite:', error);
        toast.error('Failed to add to favorites');
        return;
      }

      setFavoriteIds(prev => [...prev, contentId]);
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (contentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast.error('Failed to remove from favorites');
        return;
      }

      setFavoriteIds(prev => prev.filter(id => id !== contentId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    favoriteIds,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites
  };
};
