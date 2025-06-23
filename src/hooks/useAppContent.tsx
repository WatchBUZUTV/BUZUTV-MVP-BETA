
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/hooks/useContent';
import { useChannels } from '@/hooks/useChannels';
import { genres } from '@/data/mockMovies';

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

  // Early return for loading state
  const isLoading = dbContentLoading || dbChannelsLoading;
  
  // Only transform when data is available and not loading
  const transformedContent = useMemo(() => {
    if (isLoading || !dbContent.length) return [];
    return transformDatabaseContent(dbContent);
  }, [dbContent, isLoading]);

  const transformedChannels = useMemo(() => {
    if (isLoading || !dbChannels.length) return [];
    return transformDatabaseChannels(dbChannels);
  }, [dbChannels, isLoading]);

  // Pre-compute all categories and filters with targeted memoization
  const processedContent = useMemo(() => {
    if (!transformedContent.length) {
      return {
        movies: {
          all: [],
          featured: [],
          trending: [],
          topRanked: [],
          recommended: [],
          new: [],
          byGenre: {}
        },
        series: {
          all: [],
          featured: [],
          trending: [],
          topRanked: [],
          recommended: [],
          new: [],
          byGenre: {}
        },
        home: {
          trending: [],
          action: [],
          drama: [],
          romance: [],
          comedy: [],
          documentary: [],
          informational: [],
        },
        allContent: []
      };
    }

    const movies = transformedContent.filter(item => item.type === "movie");
    const series = transformedContent.filter(item => item.type === "tv");
    
    // Pre-compute movie categories
    const movieCategories = {
      all: movies,
      featured: movies.filter(movie => movie.isFeatured),
      trending: movies.filter(movie => movie.isTrending),
      topRanked: [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5),
      recommended: movies.slice(0, 6),
      new: movies.slice(2, 8),
      byGenre: genres.reduce((acc, genre) => {
        acc[genre] = movies.filter(movie => movie.genre === genre);
        return acc;
      }, {} as Record<string, typeof movies>)
    };

    // Pre-compute series categories
    const seriesCategories = {
      all: series,
      featured: series.filter(show => show.isFeatured),
      trending: series.filter(show => show.isTrending),
      topRanked: [...series].sort((a, b) => b.rating - a.rating).slice(0, 5),
      recommended: series.slice(0, 6),
      new: series.slice(2, 8),
      byGenre: genres.reduce((acc, genre) => {
        acc[genre] = series.filter(show => show.genre === genre);
        return acc;
      }, {} as Record<string, typeof series>)
    };

    // Pre-compute home page categories
    const homeCategories = {
      trending: transformedContent.filter(item => item.isTrending),
      action: transformedContent.filter(item => item.genre === "Action"),
      drama: transformedContent.filter(item => item.genre === "Drama"),
      romance: transformedContent.filter(item => item.genre === "Romance"),
      comedy: transformedContent.filter(item => item.genre === "Comedy"),
      documentary: transformedContent.filter(item => item.genre === "Documentary"),
      informational: transformedContent.filter(item => item.genre === "Informational"),
    };

    return {
      movies: movieCategories,
      series: seriesCategories,
      home: homeCategories,
      allContent: transformedContent
    };
  }, [transformedContent]);

  return {
    // Legacy support - return all movies for components that still need it
    movies: transformedContent,
    channels: transformedChannels,
    isLoading,
    // New optimized data structure
    content: processedContent,
    // Quick access to specific categories
    movieContent: processedContent.movies,
    seriesContent: processedContent.series,
    homeContent: processedContent.home
  };
};
