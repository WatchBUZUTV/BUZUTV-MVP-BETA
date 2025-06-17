
import { Content } from '@/hooks/useContent';

// Movie interface that matches what the MovieCard component expects
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  youtubeId: string;
  description?: string;
  genre?: string;
  year?: number;
  rating?: number;
  type?: 'movie' | 'series';
  duration?: number;
  seasons?: number;
  episodes?: number;
  isTrending?: boolean;
  isFeatured?: boolean;
}

// Channel interface that matches what the ChannelCard component expects
export interface Channel {
  id: string;
  name: string;
  description?: string;
  logoUrl: string;
  contentCount: number;
  bannerUrl?: string;
}

export const contentToMovie = (content: Content): Movie => ({
  id: content.id,
  title: content.title,
  posterUrl: content.poster_url || 'https://images.unsplash.com/photo-1489599904821-97473bfa5d34?w=400',
  youtubeId: content.video_url || '',
  description: content.description || undefined,
  genre: content.genre || undefined,
  year: content.year || undefined,
  rating: content.rating ? Number(content.rating) : undefined,
  type: content.type,
  duration: content.duration_minutes || undefined,
  seasons: content.seasons || undefined,
  episodes: content.episodes || undefined,
  isTrending: content.is_trending || false,
  isFeatured: content.is_featured || false,
});

export const channelToChannelCard = (channel: any): Channel => ({
  id: channel.id,
  name: channel.name,
  description: channel.description || undefined,
  logoUrl: channel.logo_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200',
  contentCount: 0, // We'll need to fetch this separately if needed
  bannerUrl: channel.banner_url || undefined,
});
