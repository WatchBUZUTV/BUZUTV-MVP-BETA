
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/utils/youtubeUtils";

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const FullscreenPlayer = ({ isOpen, onClose, videoUrl, title }: FullscreenPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Set up iframe with autoplay when opened
  useEffect(() => {
    if (isOpen && iframeRef.current && videoUrl) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      if (embedUrl) {
        iframeRef.current.src = `${embedUrl}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
      }
    } else if (!isOpen && iframeRef.current) {
      iframeRef.current.src = '';
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <iframe
          ref={iframeRef}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default FullscreenPlayer;
