
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock favorites for demo users only
const demoUserFavorites: Record<string, string[]> = {
  'user@example.com': ['1', '2', '8'], // Demo user has some favorites
  'admin@example.com': ['1', '3', '4', '6'] // Admin has different favorites
};

export const useUserFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavoriteIds([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      // Check if this is a demo user
      const isDemoUser = user.email && demoUserFavorites[user.email];
      
      if (isDemoUser) {
        // Demo user gets predefined favorites
        setFavoriteIds(demoUserFavorites[user.email]);
        setIsLoading(false);
        return;
      }

      // Real user - fetch from Supabase
      const { data, error } = await supabase
        .from('user_favorites')
        .select('content_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        // Fallback to localStorage for non-demo users
        const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (savedFavorites) {
          setFavoriteIds(JSON.parse(savedFavorites));
        } else {
          setFavoriteIds([]);
        }
      } else {
        const ids = data.map(fav => fav.content_id);
        setFavoriteIds(ids);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (contentId: string) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    if (favoriteIds.includes(contentId)) {
      toast.error('Already in favorites');
      return;
    }

    // Check if this is a demo user
    const isDemoUser = user.email && demoUserFavorites[user.email];
    
    if (isDemoUser) {
      // Demo user - just update local state
      const newFavorites = [...favoriteIds, contentId];
      setFavoriteIds(newFavorites);
      toast.success('Added to favorites');
      return;
    }

    try {
      // Real user - save to Supabase
      const { error } = await supabase
        .from('user_favorites')
        .insert([
          {
            user_id: user.id,
            content_id: contentId
          }
        ]);

      if (error) {
        console.error('Error adding to favorites:', error);
        // Fallback to localStorage
        const newFavorites = [...favoriteIds, contentId];
        setFavoriteIds(newFavorites);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
        toast.success('Added to favorites');
      } else {
        setFavoriteIds([...favoriteIds, contentId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (contentId: string) => {
    if (!user) return;

    // Check if this is a demo user
    const isDemoUser = user.email && demoUserFavorites[user.email];
    
    if (isDemoUser) {
      // Demo user - just update local state
      const newFavorites = favoriteIds.filter(id => id !== contentId);
      setFavoriteIds(newFavorites);
      toast.success('Removed from favorites');
      return;
    }

    try {
      // Real user - remove from Supabase
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId);

      if (error) {
        console.error('Error removing from favorites:', error);
        // Fallback to localStorage
        const newFavorites = favoriteIds.filter(id => id !== contentId);
        setFavoriteIds(newFavorites);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
        toast.success('Removed from favorites');
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== contentId));
        toast.success('Removed from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  return {
    favoriteIds,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites
  };
};
