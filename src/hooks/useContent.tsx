
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useContentCache } from '@/hooks/useContentCache';

export interface Content {
  id: string;
  title: string;
  description: string | null;
  type: 'movie' | 'series';
  genre: string | null;
  year: number | null;
  rating: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  seasons: number | null;
  episodes: number | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  channel_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  seasons_data?: any;
}

const fetchContentData = async (): Promise<Content[]> => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content:', error);
    toast.error('Failed to load content');
    throw error;
  }

  // Transform the data to ensure type compatibility
  return (data || []).map(item => ({
    ...item,
    type: item.type as 'movie' | 'series' // Type assertion for database data
  }));
};

export const useContent = () => {
  const { data: content, isLoading, error, refetch } = useContentCache(
    'content',
    fetchContentData,
    []
  );

  return {
    content: content || [],
    isLoading,
    error,
    refetch
  };
};
