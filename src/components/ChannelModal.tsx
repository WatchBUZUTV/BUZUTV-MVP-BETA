
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Filter } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { mockMovies } from '@/data/mockMovies';

interface Channel {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
}

const ChannelModal = ({ isOpen, onClose, channel }: ChannelModalProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'year'>('newest');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Get movies associated with this channel (for demo, we'll show random movies)
  const channelMovies = useMemo(() => {
    if (!channel) return [];
    
    // For demo purposes, assign some movies to each channel
    const channelMovieMap: { [key: string]: string[] } = {
      'ebs-tv': ['1', '2', '3', '4', '5', '6'],
      'arts-tv': ['7', '8', '9', '10', '11', '12'],
      'kana-tv': ['13', '14', '15', '1', '2', '3'],
      'fana-tv': ['4', '5', '6', '7', '8', '9'],
      'walta-tv': ['10', '11', '12', '13', '14', '15'],
    };

    const movieIds = channelMovieMap[channel.id] || [];
    return mockMovies.filter(movie => movieIds.includes(movie.id));
  }, [channel]);

  // Apply filters and sorting
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...channelMovies];

    // Filter by genre
    if (genreFilter !== 'all') {
      filtered = filtered.filter(movie => movie.genre === genreFilter);
    }

    // Filter by year
    if (yearFilter !== 'all') {
      filtered = filtered.filter(movie => movie.year.toString() === yearFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    return filtered;
  }, [channelMovies, sortBy, genreFilter, yearFilter]);

  // Get unique genres and years for filters
  const availableGenres = useMemo(() => {
    const genres = [...new Set(channelMovies.map(movie => movie.genre))];
    return genres.filter(Boolean);
  }, [channelMovies]);

  const availableYears = useMemo(() => {
    const years = [...new Set(channelMovies.map(movie => movie.year.toString()))];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [channelMovies]);

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-gray-800 text-white border-gray-700 overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{channel.name}</DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters:</span>
          </div>
          
          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'year')}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="year">By Year</option>
          </select>

          {/* Genre filter */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Genres</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Movies Grid */}
        <div className="overflow-y-auto max-h-96">
          {filteredAndSortedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAndSortedMovies.map((movie) => (
                <div key={movie.id} className="w-full">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
              <p className="text-gray-400">
                No movies or series match your current filters for this channel.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelModal;
