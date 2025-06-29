import { Star, Heart, Play, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Movie } from "@/data/mockMovies";
import { useState, useRef } from "react";

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
  onRecommendedClick?: (item: any) => void;
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
  onRecommendedClick
}: SeriesModalProps) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getSeasonsData = () => {
    if (!contentItem?.seasons_data) {
      console.log('No seasons_data found for series:', series.title);
      return [];
    }

    console.log('Raw seasons_data:', contentItem.seasons_data);
    
    try {
      let parsedData;
      if (typeof contentItem.seasons_data === 'string') {
        parsedData = JSON.parse(contentItem.seasons_data);
      } else {
        parsedData = contentItem.seasons_data;
      }
      
      console.log('Parsed seasons data:', parsedData);
      
      // Validate the structure
      if (Array.isArray(parsedData)) {
        const validatedData = parsedData.filter(season => {
          const isValid = season && 
                         typeof season.seasonNumber === 'number' && 
                         Array.isArray(season.episodes);
          if (!isValid) {
            console.warn('Invalid season data:', season);
          }
          return isValid;
        });
        
        console.log('Validated seasons data:', validatedData);
        return validatedData;
      } else {
        console.warn('Seasons data is not an array:', parsedData);
        return [];
      }
    } catch (error) {
      console.error('Error parsing seasons data:', error);
      return [];
    }
  };

  const seasonsData = getSeasonsData();
  console.log('Final seasons data for rendering:', seasonsData);

  // Get current season data
  const currentSeasonData = seasonsData.find(season => season.seasonNumber === selectedSeason);
  const episodes = currentSeasonData?.episodes || [];

  // Show play button if there are episodes available
  const showPlayButton = seasonsData.length > 0 && seasonsData[0]?.episodes?.length > 0;

  // Filter recommended content by BOTH same genre AND channel
  const filteredRecommendedContent = recommendedContent.filter(item => 
    item.id !== series.id && 
    item.genre === series.genre && 
    (item.channel_id === series.channelId || item.channel_id === contentItem?.channel_id)
  );

  const handlePlayFirstEpisode = () => {
    if (seasonsData.length > 0 && seasonsData[0].episodes.length > 0) {
      const firstEpisode = seasonsData[0].episodes[0];
      const episodeTitle = `${series.title} - S${seasonsData[0].seasonNumber}E${firstEpisode.episodeNumber}: ${firstEpisode.title}`;
      console.log('Playing first episode:', episodeTitle, 'URL:', firstEpisode.videoUrl);
      onPlayEpisode(firstEpisode.videoUrl, episodeTitle);
    }
  };

  const handleEpisodePlay = (episode: any, seasonNumber: number) => {
    const episodeTitle = `${series.title} - S${seasonNumber}E${episode.episodeNumber}: ${episode.title}`;
    console.log('Playing episode:', episodeTitle, 'URL:', episode.videoUrl);
    onPlayEpisode(episode.videoUrl, episodeTitle);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleRecommendedClick = (item: any) => {
    if (onRecommendedClick) {
      onRecommendedClick(item);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] max-h-[90vh] bg-gray-900 text-white border-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">{series.title}</DialogTitle>
        <ScrollArea className="h-[90vh]">
          <div className="relative">
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
                  <button
                    onClick={handlePlayFirstEpisode}
                    disabled={!showPlayButton}
                    className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-3 transition-colors ${
                      showPlayButton 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>Play</span>
                  </button>
                  
                  <button
                    onClick={onSave}
                    className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  </button>
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
              {/* Seasons and Episodes */}
              {seasonsData.length > 0 && (
                <div className="mb-8">
                  {/* Season Selector */}
                  <div className="relative mb-4">
                    <button
                      onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium"
                    >
                      <span>Season {selectedSeason}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showSeasonDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[120px]">
                        {seasonsData.map((season) => (
                          <button
                            key={season.seasonNumber}
                            onClick={() => {
                              setSelectedSeason(season.seasonNumber);
                              setShowSeasonDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                          >
                            Season {season.seasonNumber}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Episodes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {episodes.map((episode: any, index: number) => (
                      <div 
                        key={index}
                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleEpisodePlay(episode, selectedSeason)}
                      >
                        <div className="aspect-video bg-gray-700 flex items-center justify-center relative group">
                          <Play className="w-12 h-12 text-white/70 group-hover:text-white transition-colors" />
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            E{episode.episodeNumber}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-white mb-1 line-clamp-1">{episode.title}</h4>
                          <p className="text-gray-400 text-sm line-clamp-2">{episode.description || 'No description available'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More Like This Section */}
              {filteredRecommendedContent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">More Like This</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={scrollLeft}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={scrollRight}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={scrollRef}
                    className="flex space-x-2 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredRecommendedContent.map((item) => (
                      <div 
                        key={item.id} 
                        className="group cursor-pointer flex-shrink-0"
                        onClick={() => handleRecommendedClick(item)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800 w-48">
                          <img
                            src={item.poster_url || '/placeholder.svg'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current" />
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-white mt-2 line-clamp-2 w-48">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeriesModal;
