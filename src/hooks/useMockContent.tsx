
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockMovies, channels } from '@/data/mockMovies';

// Demo users who should see mock content
const demoUsers = ['user@example.com', 'admin@example.com'];

export const useMockContent = () => {
  const [content, setContent] = useState<typeof mockMovies>([]);
  const [channelsData, setChannelsData] = useState<typeof channels>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if this is a demo user
      const isDemoUser = user.email && demoUsers.includes(user.email);
      
      if (isDemoUser) {
        // Demo user gets all mock content
        setContent(mockMovies);
        setChannelsData(channels);
      } else {
        // Real user gets empty content
        setContent([]);
        setChannelsData([]);
      }
      setIsLoading(false);
    } else {
      // Not logged in - show empty content
      setContent([]);
      setChannelsData([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    movies: content,
    channels: channelsData,
    isLoading
  };
};
