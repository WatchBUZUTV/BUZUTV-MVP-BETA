
import React from "react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/data/mockMovies";

interface OptimizedMovieCardProps {
  movie: Movie;
  showSaveButton?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  showResumeButton?: boolean;
  onPlayFullscreen?: (videoUrl: string) => void;
}

const OptimizedMovieCard = React.memo(({ 
  movie, 
  showSaveButton = true, 
  showProgress = false, 
  progressPercent = 0,
  showResumeButton = false,
  onPlayFullscreen
}: OptimizedMovieCardProps) => {
  return (
    <MovieCard 
      movie={movie}
      showSaveButton={showSaveButton}
      showProgress={showProgress}
      progressPercent={progressPercent}
      showResumeButton={showResumeButton}
      onPlayFullscreen={onPlayFullscreen}
    />
  );
});

OptimizedMovieCard.displayName = "OptimizedMovieCard";

export default OptimizedMovieCard;
