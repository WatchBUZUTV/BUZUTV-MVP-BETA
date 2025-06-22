
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MovieCard from '@/components/MovieCard';
import { useContent } from '@/hooks/useContent';
import { Movie } from '@/data/mockMovies';

interface Channel {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  logo_url?: string;
  banner_url?: string;
}

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
}

const ChannelModal = ({ isOpen, onClose, channel }: ChannelModalProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'year' | 'rating'>('newest');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { content } = useContent();

  // Get content associated with this channel from backend data
  const channelContent = useMemo(() => {
    if (!channel) return [];
    
    // Filter content by channel_id
    const filteredContent = content.filter(item => item.channel_id === channel.id);
    
    // Convert backend content to Movie format for compatibility with MovieCard
    return filteredContent.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      year: item.year || new Date().getFullYear(),
      genre: item.genre || 'Unknown',
      rating: item.rating?.toString() || '0',
      posterUrl: item.poster_url || '/placeholder.svg',
      backdropUrl: item.backdrop_url || '/placeholder.svg',
      duration: item.duration_minutes || 0,
      channelId: item.channel_id || '',
      youtubeId: '', // We'll use video_url instead
      isTrending: item.is_trending || false,
      type: item.type as 'movie' | 'series'
    } as Movie));
  }, [channel, content]);

  // Apply filters and sorting
  const filteredAndSortedContent = useMemo(() => {
    let filtered = [...channelContent];

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Filter by genre
    if (genreFilter !== 'all') {
      filtered = filtered.filter(item => item.genre === genreFilter);
    }

    // Filter by year
    if (yearFilter !== 'all') {
      filtered = filtered.filter(item => item.year.toString() === yearFilter);
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
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        default:
          return 0;
      }
    });

    return filtered;
  }, [channelContent, sortBy, genreFilter, yearFilter, typeFilter]);

  // Get unique values for filters
  const availableGenres = useMemo(() => {
    const genres = [...new Set(channelContent.map(item => item.genre))];
    return genres.filter(Boolean);
  }, [channelContent]);

  const availableYears = useMemo(() => {
    const years = [...new Set(channelContent.map(item => item.year.toString()))];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [channelContent]);

  const availableTypes = useMemo(() => {
    const types = [...new Set(channelContent.map(item => item.type))];
    return types.filter(Boolean);
  }, [channelContent]);

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] bg-gray-900 text-white border-gray-700 overflow-hidden p-0">
        <div className="flex flex-col h-[95vh]">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {(channel.logo_url || channel.logoUrl) && (
                  <img
                    src={channel.logo_url || channel.logoUrl}
                    alt={channel.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
                <div>
                  <DialogTitle className="text-3xl font-bold">{channel.name}</DialogTitle>
                  {channel.description && (
                    <p className="text-gray-400 mt-1">{channel.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </DialogHeader>

          {/* Filters */}
          <div className="p-6 pb-4 border-b border-gray-700">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Filters:</span>
              </div>
              
              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'year' | 'rating')}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="year">By Year</option>
                <option value="rating">By Rating</option>
              </select>

              {/* Type filter */}
              {availableTypes.length > 1 && (
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="all">All Types</option>
                  {availableTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'movie' ? 'Movies' : 'Series'}
                    </option>
                  ))}
                </select>
              )}

              {/* Genre filter */}
              {availableGenres.length > 0 && (
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="all">All Genres</option>
                  {availableGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              )}

              {/* Year filter */}
              {availableYears.length > 0 && (
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {/* Content count */}
              <span className="text-sm text-gray-400 ml-auto">
                {filteredAndSortedContent.length} item{filteredAndSortedContent.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {filteredAndSortedContent.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {filteredAndSortedContent.map((movie) => (
                      <div key={movie.id} className="w-full">
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl font-medium text-white mb-3">No content found</h3>
                      <p className="text-gray-400">
                        {channelContent.length === 0 
                          ? `No content has been added to ${channel.name} yet.`
                          : "No content matches your current filters for this channel."
                        }
                      </p>
                      {channelContent.length > 0 && (
                        <button
                          onClick={() => {
                            setSortBy('newest');
                            setGenreFilter('all');
                            setYearFilter('all');
                            setTypeFilter('all');
                          }}
                          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelModal;
