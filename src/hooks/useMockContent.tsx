
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockMovies, channels } from '@/data/mockMovies';
import { useContent } from '@/hooks/useContent';
import { useChannels } from '@/hooks/useChannels';

// Demo users who should see mock content
const demoUsers = ['user@example.com', 'admin@example.com'];

// Transform database content to match mock data structure
const transformDatabaseContent = (dbContent: any[]) => {
  return dbContent.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    type: item.type,
    genre: item.genre || 'Drama',
    year: item.year || new Date().getFullYear(),
    rating: item.rating || 0,
    posterUrl: item.poster_url || '/placeholder.svg',
    backdropUrl: item.backdrop_url || '/placeholder.svg',
    videoUrl: item.video_url || '',
    duration: item.duration_minutes || 120,
    seasons: item.seasons,
    episodes: item.episodes,
    isFeatured: item.is_featured || false,
    isTrending: item.is_trending || false,
    channelId: item.channel_id
  }));
};

// Transform database channels to match mock data structure
const transformDatabaseChannels = (dbChannels: any[]) => {
  return dbChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    description: channel.description || '',
    logoUrl: channel.logo_url || '/placeholder.svg',
    bannerUrl: channel.banner_url || '/placeholder.svg',
    isActive: channel.is_active !== false
  }));
};

export const useMockContent = () => {
  const [content, setContent] = useState<typeof mockMovies>([]);
  const [channelsData, setChannelsData] = useState<typeof channels>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch real content from database
  const { content: dbContent, isLoading: dbContentLoading } = useContent();
  const { channels: dbChannels, isLoading: dbChannelsLoading } = useChannels();

  useEffect(() => {
    if (user && !dbContentLoading && !dbChannelsLoading) {
      // Check if this is a demo user (for mock content)
      const isDemoUser = user.email && demoUsers.includes(user.email);
      
      // Transform database content to match mock structure
      const transformedDbContent = transformDatabaseContent(dbContent);
      const transformedDbChannels = transformDatabaseChannels(dbChannels);
      
      if (isDemoUser) {
        // Demo user gets mock content + real content
        setContent([...mockMovies, ...transformedDbContent]);
        setChannelsData([...channels, ...transformedDbChannels]);
      } else {
        // Real user gets only real content from database
        setContent(transformedDbContent);
        setChannelsData(transformedDbChannels);
      }
      setIsLoading(false);
    } else if (!user && !dbContentLoading && !dbChannelsLoading) {
      // Not logged in - show empty content
      setContent([]);
      setChannelsData([]);
      setIsLoading(false);
    }
  }, [user, dbContent, dbChannels, dbContentLoading, dbChannelsLoading]);

  return {
    movies: content,
    channels: channelsData,
    isLoading: isLoading || dbContentLoading || dbChannelsLoading
  };
};
