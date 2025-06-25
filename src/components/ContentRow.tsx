
import React, { useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import ProtectedContent from "@/components/auth/ProtectedContent";
import MovieHoverRow from "@/components/MovieHoverRow";

interface ContentRowProps {
  title: string;
  movies: Movie[];
}

const ContentRow = React.memo(({ title, movies }: ContentRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <MovieHoverRow className="flex space-x-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-64">
              <ProtectedContent>
                <MovieCard movie={movie} />
              </ProtectedContent>
            </div>
          ))}
        </MovieHoverRow>
      </div>
    </section>
  );
});

ContentRow.displayName = "ContentRow";

export default ContentRow;
