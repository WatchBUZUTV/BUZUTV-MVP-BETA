export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  youtubeId: string;
  rating: number;
  year: number;
  genre: string;
  isTrending: boolean;
  isFeatured: boolean;
  type: 'movie' | 'tv';
  channelId?: string;
  // Series-specific fields
  seasons?: number;
  episodes?: number;
}

export interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  contentCount: number;
}

// Mock data commented out - using backend data now
export const mockMovies: Movie[] = [
  // Mock data removed for performance - using backend data
];

export const channels: Channel[] = [
  // Mock data removed for performance - using backend data
];

export const genres = [
  "All",
  "Action",
  "Drama", 
  "Romance",
  "Comedy",
  "Documentary",
  "Informational"
];
