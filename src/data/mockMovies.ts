
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

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    youtubeId: "EXeTwQWrcwY",
    rating: 9.0,
    year: 2008,
    genre: "Action",
    isTrending: false,
    isFeatured: true,
    type: "movie"
  },
  {
    id: "2",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    posterUrl: "https://images.unsplash.com/photo-1489599904821-97473bfa5d34?w=400",
    youtubeId: "mnd7sFt5c3A",
    rating: 8.7,
    year: 2016,
    genre: "Drama",
    isTrending: true,
    isFeatured: true,
    type: "tv",
    seasons: 4,
    episodes: 32
  },
  {
    id: "3",
    title: "The Matrix",
    description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    youtubeId: "vKQi3bBA1y8",
    rating: 8.7,
    year: 1999,
    genre: "Action",
    isTrending: true,
    isFeatured: false,
    type: "movie"
  },
  {
    id: "4",
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
    youtubeId: "HhesaQXLuRY",
    rating: 9.5,
    year: 2008,
    genre: "Drama",
    isTrending: false,
    isFeatured: true,
    type: "tv",
    seasons: 5,
    episodes: 62
  },
  {
    id: "5",
    title: "Inception",
    description: "A thief who enters people's dreams and steals their secrets from their subconscious is given the chance to regain his old life.",
    posterUrl: "https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?w=400",
    youtubeId: "YoHD9XEInc0",
    rating: 8.8,
    year: 2010,
    genre: "Action",
    isTrending: false,
    isFeatured: false,
    type: "movie"
  },
  {
    id: "6",
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    youtubeId: "JWtnJjn6ng0",
    rating: 8.6,
    year: 2016,
    genre: "Drama",
    isTrending: true,
    isFeatured: false,
    type: "tv",
    seasons: 4,
    episodes: 40
  },
  {
    id: "7",
    title: "Pride and Prejudice",
    description: "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy.",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    youtubeId: "1dYv5u6v55Y",
    rating: 8.1,
    year: 2005,
    genre: "Romance",
    isTrending: false,
    isFeatured: false,
    type: "movie"
  },
  {
    id: "8",
    title: "The Office",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    posterUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
    youtubeId: "LHhbdXCzt_A",
    rating: 9.0,
    year: 2005,
    genre: "Comedy",
    isTrending: true,
    isFeatured: true,
    type: "tv",
    seasons: 9,
    episodes: 201
  },
  {
    id: "9",
    title: "Planet Earth",
    description: "A groundbreaking documentary series that takes viewers on an incredible journey through our planet's most spectacular landscapes and wildlife.",
    posterUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400",
    youtubeId: "hFJBPVCdppE",
    rating: 9.3,
    year: 2006,
    genre: "Documentary",
    isTrending: false,
    isFeatured: false,
    type: "tv",
    seasons: 1,
    episodes: 11
  },
  {
    id: "10",
    title: "How It's Made",
    description: "An educational series that explains the manufacturing processes of everyday items and products.",
    posterUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    youtubeId: "iO7_Ep6j8LM",
    rating: 8.2,
    year: 2001,
    genre: "Informational",
    isTrending: false,
    isFeatured: false,
    type: "tv",
    seasons: 1,
    episodes: 13
  }
];

export const channels: Channel[] = [
  {
    id: "1",
    name: "HBO Max",
    logoUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200",
    description: "Premium entertainment with blockbuster movies, HBO originals, and more.",
    contentCount: 0
  },
  {
    id: "2",
    name: "Disney+",
    logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200",
    description: "The ultimate Disney destination with Pixar, Marvel, Star Wars, and National Geographic.",
    contentCount: 0
  },
  {
    id: "3",
    name: "Netflix",
    logoUrl: "https://images.unsplash.com/photo-1489599904821-97473bfa5d34?w=200",
    description: "Original series, documentaries and feature films across a variety of genres.",
    contentCount: 0
  },
  {
    id: "4",
    name: "Amazon Prime",
    logoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200",
    description: "Prime Video originals, movies, and TV shows with your Prime membership.",
    contentCount: 0
  },
  {
    id: "5",
    name: "Hulu",
    logoUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200",
    description: "Stream current season episodes, classic series, and acclaimed Hulu Originals.",
    contentCount: 0
  },
  {
    id: "6",
    name: "Apple TV+",
    logoUrl: "https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?w=200",
    description: "Original shows and movies from Apple with new premieres every month.",
    contentCount: 0
  }
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
