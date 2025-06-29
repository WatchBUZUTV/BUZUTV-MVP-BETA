
import { Star, Heart, Play } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import { useState } from "react";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useContent } from "@/hooks/useContent";
import { useChannels } from "@/hooks/useChannels";
import SeriesModal from "@/components/SeriesModal";
import FullscreenPlayer from "@/components/FullscreenPlayer";

interface SeriesCardProps {
  series: Movie;
  showSaveButton?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  showResumeButton?: boolean;
  onPlayFullscreen?: (videoUrl: string) => void;
}

const SeriesCard = ({ 
  series, 
  showSaveButton = true, 
  showProgress = false, 
  progressPercent = 0,
  showResumeButton = false,
  onPlayFullscreen
}: SeriesCardProps) => {
  const { favoriteIds, addToFavorites, removeFromFavorites } = useUserFavorites();
  const { content } = useContent();
  const { channels } = useChannels();
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  const isSaved = favoriteIds.includes(series.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeFromFavorites(series.id);
    } else {
      addToFavorites(series.id);
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handlePlayEpisode = (videoUrl: string, episodeTitle: string) => {
    console.log('Playing episode:', episodeTitle, 'URL:', videoUrl);
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(episodeTitle);
    
    if (onPlayFullscreen) {
      onPlayFullscreen(videoUrl);
      setShowModal(false);
    } else {
      setShowModal(false);
      setTimeout(() => {
        setIsFullscreen(true);
      }, 200);
    }
  };

  const handleExitFullscreen = () => {
    console.log('Exiting fullscreen for series:', series.title);
    setIsFullscreen(false);
    setCurrentVideoUrl("");
    setCurrentVideoTitle("");
  };

  const handleSaveModal = () => {
    if (isSaved) {
      removeFromFavorites(series.id);
    } else {
      addToFavorites(series.id);
    }
  };

  const recommendedContent = content
    .filter(item => 
      item.id !== series.id && 
      (item.genre === series.genre || item.channel_id === series.channelId)
    )
    .slice(0, 6);

  const contentItem = content.find(item => item.id === series.id);
  const videoUrl = contentItem?.video_url;
  const channel = channels.find(ch => ch.id === series.channelId);

  return (
    <>
      {isFullscreen && currentVideoUrl && (
        <FullscreenPlayer
          isOpen={isFullscreen}
          onClose={handleExitFullscreen}
          videoUrl={currentVideoUrl}
          title={currentVideoTitle}
        />
      )}

      <div className="series-card group">
        <div className="block cursor-pointer" onClick={handleCardClick}>
          <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg"
               style={{ aspectRatio: '16/9' }}>
            <div className="w-full h-full overflow-hidden">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </div>
            
            {showProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="font-medium text-white text-sm line-clamp-2">{series.title}</h3>
            </div>

            {showResumeButton && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SeriesModal
        isOpen={showModal && !isFullscreen}
        onClose={setShowModal}
        series={series}
        isSaved={isSaved}
        onSave={handleSaveModal}
        onPlayEpisode={handlePlayEpisode}
        videoUrl={videoUrl}
        contentItem={contentItem}
        channel={channel}
        recommendedContent={recommendedContent}
      />
    </>
  );
};

export default SeriesCard;
