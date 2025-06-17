
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock favorites for predefined users
const mockUserFavorites: Record<string, string[]> = {
  'user-1': ['1', '2', '8'], // Demo user has some favorites
  'admin-1': ['1', '3', '4', '6'] // Admin has different favorites
};

export const useUserFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    setIsLoading(true);
    
    if (!user) {
      setFavoriteIds([]);
      setIsLoading(false);
      return;
    }

    // Get mock favorites for predefined users, empty for new users
    const userFavorites = mockUserFavorites[user.id] || [];
    setFavoriteIds(userFavorites);
    setIsLoading(false);
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

    const newFavorites = [...favoriteIds, contentId];
    setFavoriteIds(newFavorites);
    
    // Store in localStorage for persistence
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    toast.success('Added to favorites');
  };

  const removeFromFavorites = async (contentId: string) => {
    if (!user) return;

    const newFavorites = favoriteIds.filter(id => id !== contentId);
    setFavoriteIds(newFavorites);
    
    // Store in localStorage for persistence
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    toast.success('Removed from favorites');
  };

  useEffect(() => {
    if (user) {
      // Check localStorage first for user's favorites
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavoriteIds(JSON.parse(savedFavorites));
        setIsLoading(false);
      } else {
        fetchFavorites();
      }
    } else {
      setFavoriteIds([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    favoriteIds,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites
  };
};
