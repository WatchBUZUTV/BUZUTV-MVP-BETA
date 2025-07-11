import { useState } from "react";
import { Play } from "lucide-react";
import FullscreenPlayer from "./FullscreenPlayer";

interface MoreLikeThisCardProps {
  item: any; // movie or series
}

const MoreLikeThisCard = ({ item }: MoreLikeThisCardProps) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  const [fullscreenTitle, setFullscreenTitle] = useState<string | null>(null);

  // Determine video URL and title
  let videoUrl = item.video_url;
  let title = item.title;
  if (item.type === "series" && item.seasons_data) {
    let seasonsData = Array.isArray(item.seasons_data) ? item.seasons_data : [];
    if (typeof item.seasons_data === 'string') {
      try {
        seasonsData = JSON.parse(item.seasons_data);
      } catch {}
    }
    if (seasonsData.length > 0 && seasonsData[0].episodes && seasonsData[0].episodes.length > 0) {
      videoUrl = seasonsData[0].episodes[0].videoUrl || seasonsData[0].episodes[0].video_url;
      title = `${item.title} - ${seasonsData[0].episodes[0].title}`;
    }
  }

  return (
    <>
      <div className="relative flex-shrink-0 w-64 group">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg"
        />
        {/* Play button overlay on hover */}
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            if (videoUrl) {
              setFullscreenOpen(true);
              setFullscreenUrl(videoUrl);
              setFullscreenTitle(title);
            }
          }}
          disabled={!videoUrl}
        >
          <Play className="w-12 h-12 text-white" />
        </button>
      </div>
      {fullscreenOpen && fullscreenUrl && (
        <FullscreenPlayer
          isOpen={fullscreenOpen}
          onClose={() => setFullscreenOpen(false)}
          videoUrl={fullscreenUrl}
          title={fullscreenTitle || item.title}
        />
      )}
    </>
  );
};

export default MoreLikeThisCard; 