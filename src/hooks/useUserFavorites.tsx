
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
      // Check if this is a demo user
      const isDemoUser = user.email && demoUserFavorites[user.email];
      
      if (isDemoUser) {
        // Demo user gets predefined favorites
        setFavoriteIds(demoUserFavorites[user.email]);
      } else {
        // Real user - check localStorage for their favorites
        const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (savedFavorites) {
          setFavoriteIds(JSON.parse(savedFavorites));
        } else {
          setFavoriteIds([]); // New user starts with empty favorites
        }
      }
      setIsLoading(false);
    } else {
      setFavoriteIds([]);
      setIsLoading(false);
    }
  }, [user]);

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
    
    // Store in localStorage (for both demo and real users)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    toast.success('Added to favorites');
  };

  const removeFromFavorites = async (contentId: string) => {
    if (!user) return;

    const newFavorites = favoriteIds.filter(id => id !== contentId);
    setFavoriteIds(newFavorites);
    
    // Store in localStorage
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    toast.success('Removed from favorites');
  };

  return {
    favoriteIds,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    refetch: () => {} // No-op for mock system
  };
};
