
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
      // Prevent body scroll when fullscreen is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Set up iframe with autoplay when opened
  useEffect(() => {
    if (isOpen && iframeRef.current && videoUrl) {
      console.log('Setting up fullscreen video with URL:', videoUrl);
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      console.log('Converted embed URL:', embedUrl);
      
      if (embedUrl) {
        const autoplayUrl = `${embedUrl}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
        console.log('Final autoplay URL:', autoplayUrl);
        iframeRef.current.src = autoplayUrl;
      }
    } else if (!isOpen && iframeRef.current) {
      // Clear the iframe when closing to stop playback
      console.log('Clearing iframe src to stop playback');
      iframeRef.current.src = '';
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black" 
      style={{ 
        zIndex: 2147483647, // Maximum z-index value
        position: 'fixed !important' as any,
        top: '0 !important' as any,
        left: '0 !important' as any,
        width: '100vw !important' as any,
        height: '100vh !important' as any,
        transform: 'translateZ(0)',
        isolation: 'isolate',
        contain: 'layout style paint',
        willChange: 'transform'
      }}
    >
      <div 
        className="relative w-full h-full" 
        style={{ 
          isolation: 'isolate',
          width: '100% !important' as any,
          height: '100% !important' as any,
          position: 'relative !important' as any
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Close fullscreen player"
          style={{ 
            zIndex: 2147483647,
            isolation: 'isolate',
            position: 'absolute !important' as any
          }}
        >
          <X className="w-6 h-6" />
        </button>
        <iframe
          ref={iframeRef}
          title={title}
          className="w-full h-full border-0"
          style={{
            width: '100% !important' as any,
            height: '100% !important' as any,
            border: 'none !important' as any,
            isolation: 'isolate',
            position: 'absolute !important' as any,
            top: '0 !important' as any,
            left: '0 !important' as any
          }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </div>
  );
};

export default FullscreenPlayer;
