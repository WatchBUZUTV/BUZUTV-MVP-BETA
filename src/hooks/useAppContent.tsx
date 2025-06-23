
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/hooks/useContent';
import { useChannels } from '@/hooks/useChannels';

// Transform database content to match Movie interface
const transformDatabaseContent = (dbContent: any[]) => {
  return dbContent.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    type: item.type === 'series' ? 'tv' : item.type,
    genre: item.genre || 'Drama',
    year: item.year || new Date().getFullYear(),
    rating: item.rating || 0,
    posterUrl: item.poster_url || '/placeholder.svg',
    backdropUrl: item.backdrop_url || '/placeholder.svg',
    videoUrl: item.video_url || '',
    youtubeId: '', // Required for Movie type compatibility
    duration: item.duration_minutes || 120,
    seasons: item.seasons,
    episodes: item.episodes,
    isFeatured: item.is_featured || false,
    isTrending: item.is_trending || false,
    channelId: item.channel_id
  }));
};

// Transform database channels to match Channel interface
const transformDatabaseChannels = (dbChannels: any[]) => {
  return dbChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    description: channel.description || '',
    logoUrl: channel.logo_url || '/placeholder.svg',
    bannerUrl: channel.banner_url || '/placeholder.svg',
    isActive: channel.is_active !== false,
    contentCount: 0
  }));
};

export const useAppContent = () => {
  const { content: dbContent, isLoading: dbContentLoading } = useContent();
  const { channels: dbChannels, isLoading: dbChannelsLoading } = useChannels();

  // Memoize transformed content to prevent unnecessary re-computations
  const transformedContent = useMemo(() => 
    transformDatabaseContent(dbContent), 
    [dbContent]
  );

  const transformedChannels = useMemo(() => 
    transformDatabaseChannels(dbChannels), 
    [dbChannels]
  );

  const isLoading = dbContentLoading || dbChannelsLoading;

  return {
    movies: transformedContent,
    channels: transformedChannels,
    isLoading
  };
};
