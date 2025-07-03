import { Star, Heart, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "@/data/mockMovies";
import SeriesCard from "@/components/SeriesCard";
import MovieCard from "@/components/MovieCard";
import HomeRow from "@/components/HomeRow";

interface Episode {
  id: string;
  title: string;
  episode_number: number;
  duration_minutes?: number;
  description?: string;
  video_url?: string;
}

interface Season {
  season_number: number;
  episodes: Episode[];
}

interface SeriesModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  series: Movie;
  isSaved: boolean;
  onSave: () => void;
  onPlayEpisode: (videoUrl: string, episodeTitle: string) => void;
  videoUrl?: string;
  contentItem?: any;
  channel?: any;
  recommendedContent: any[];
  seasons?: Season[];
}

const SeriesModal = ({
  isOpen,
  onClose,
  series,
  isSaved,
  onSave,
  onPlayEpisode,
  videoUrl,
  contentItem,
  channel,
  recommendedContent,
  seasons = []
}: SeriesModalProps) => {
  // Format duration from minutes to "Xh Ym" format
  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  // Get seasons data from contentItem
  const getSeasonsData = (): Season[] => {
    console.log('Getting seasons data for:', series.title);
    console.log('ContentItem:', contentItem);
    console.log('ContentItem seasons_data:', contentItem?.seasons_data);
    
    // Try to get real seasons data from the database
    if (contentItem?.seasons_data) {
      try {
        let seasonsData;
        
        // Handle both string and object formats of JSONB data
        if (typeof contentItem.seasons_data === 'string') {
          seasonsData = JSON.parse(contentItem.seasons_data);
        } else {
          seasonsData = contentItem.seasons_data;
        }
        
        console.log('Parsed seasons data:', seasonsData);
        
        // Check if it's an array of seasons
        if (Array.isArray(seasonsData) && seasonsData.length > 0) {
          console.log('Using real seasons data from database');
          // Map the database format to frontend format
          return seasonsData.map((season: any) => ({
            season_number: season.seasonNumber, // Map from camelCase to snake_case
            episodes: (season.episodes || []).map((episode: any) => ({
              id: episode.id || `ep-${season.seasonNumber}-${episode.episodeNumber}`,
              title: episode.title,
              episode_number: episode.episodeNumber, // Map from camelCase to snake_case
              duration_minutes: episode.duration_minutes || 45,
              description: episode.description,
              video_url: episode.videoUrl // Map from camelCase to snake_case
            }))
          }));
        }
      } catch (error) {
        console.error('Error parsing seasons_data:', error);
      }
    }

    // If no real data or parsing failed, return empty array
    console.log('No seasons data available');
    return [];
  };

  const seasonsData = getSeasonsData();

  const handlePlayFirstEpisode = () => {
    const firstEpisode = seasonsData[0]?.episodes[0];
    if (firstEpisode?.video_url) {
      console.log('Playing first episode:', firstEpisode.title, 'URL:', firstEpisode.video_url);
      onPlayEpisode(firstEpisode.video_url, `${series.title} - ${firstEpisode.title}`);
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (episode.video_url) {
      console.log('Playing episode:', episode.title, 'URL:', episode.video_url);
      onPlayEpisode(episode.video_url, `${series.title} - ${episode.title}`);
    }
  };

  // Show play button if there are episodes available
  const showPlayButton = seasonsData.length > 0 && seasonsData[0]?.episodes?.length > 0;

  // Filter recommended content by same genre or channel
  const filteredRecommendedContent = recommendedContent.filter(item => 
    item.id !== series.id && 
    (item.genre === series.genre || item.channel_id === series.channelId || item.channel_id === contentItem?.channel_id)
  );

  const normalizedRecommendedContent = filteredRecommendedContent.map(item => ({
    ...item,
    posterUrl: item.posterUrl || item.poster_url,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] max-h-[90vh] bg-gray-900 text-white border-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">{series.title}</DialogTitle>
        <ScrollArea className="h-[90vh]">
          <div className="relative">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={series.posterUrl}
                  alt={series.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h1 className="text-5xl font-bold text-white mb-6">{series.title}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  {showPlayButton && (
                    <button
                      onClick={handlePlayFirstEpisode}
                      className="px-8 py-3 rounded-lg font-semibold flex items-center space-x-3 transition-colors bg-white text-black hover:bg-gray-200"
                    >
                      <Play className="w-6 h-6 fill-current" />
                      <span>Play</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onSave}
                    className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  </button>

                  {seasonsData.length > 0 && (
                    <span className="text-white text-xl font-medium">
                      {seasonsData.length} Season{seasonsData.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-green-400 font-semibold">{series.rating}</span>
                  </div>
                  <span className="text-white font-medium">{series.year}</span>
                  <span className="border border-gray-400 px-2 py-0.5 text-xs text-gray-300 font-medium">
                    TV-MA
                  </span>
                  <span className="text-white">{series.genre}</span>
                  
                  {channel && channel.logo_url && (
                    <div className="flex items-center">
                      <img
                        src={channel.logo_url}
                        alt={channel.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-gray-900 p-8 pt-4">
              {/* Episodes Section - Only show for series with seasons */}
              {seasonsData.length > 0 && (
                <div className="mb-8">
                  <Tabs defaultValue="season-1" className="w-full">
                    <TabsList className="grid w-full grid-cols-auto bg-gray-800">
                      {seasonsData.map((season) => (
                        <TabsTrigger 
                          key={season.season_number} 
                          value={`season-${season.season_number}`}
                          className="data-[state=active]:bg-white data-[state=active]:text-black"
                        >
                          Season {season.season_number}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {seasonsData.map((season) => (
                      <TabsContent key={season.season_number} value={`season-${season.season_number}`} className="mt-4">
                        <div className="space-y-1">
                          {season.episodes.map((episode, index) => (
                            <div key={episode.id} className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors group h-16">
                              <div className="flex-shrink-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {episode.episode_number}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate text-sm">{episode.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-400 truncate max-w-96">
                                    {episode.description || `Episode ${episode.episode_number} of ${series.title}`}
                                  </p>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">{formatDuration(episode.duration_minutes)}</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handlePlayEpisode(episode)}
                                disabled={!episode.video_url}
                                className={`p-2 rounded-full transition-colors ${
                                  episode.video_url 
                                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <Play className="w-4 h-4 fill-current" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* More Like This Section */}
              {filteredRecommendedContent.length > 0 && (
                <HomeRow title="More Like This" items={normalizedRecommendedContent} onCardClick={() => onClose(false)} />
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeriesModal;
