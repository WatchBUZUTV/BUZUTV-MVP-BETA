
// Helper function to convert YouTube URLs to embed format
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return null;
};
