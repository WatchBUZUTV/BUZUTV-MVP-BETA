
import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Movie } from "@/data/mockMovies";
import MovieCard from "@/components/MovieCard";
import ProtectedContent from "@/components/auth/ProtectedContent";
import MovieHoverRow from "@/components/MovieHoverRow";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ContentRowProps {
  title: string;
  movies: Movie[];
}

const ContentRow = React.memo(({ title, movies }: ContentRowProps) => {
  const carouselRef = useRef<CarouselApi>();
  
  const scrollPrev = () => {
    carouselRef.current?.scrollPrev();
  };

  const scrollNext = () => {
    carouselRef.current?.scrollNext();
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-3">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Carousel
        setApi={(api) => {
          carouselRef.current = api;
        }}
        opts={{
          align: "start",
          skipSnaps: false,
        }}
        className="w-full px-4"
      >
        <CarouselContent className="-ml-1">
          <MovieHoverRow className="flex">
            {movies.map((movie) => (
              <CarouselItem key={movie.id} className="pl-1 basis-auto">
                <div className="w-64">
                  <ProtectedContent>
                    <MovieCard movie={movie} />
                  </ProtectedContent>
                </div>
              </CarouselItem>
            ))}
          </MovieHoverRow>
        </CarouselContent>
      </Carousel>
    </section>
  );
});

ContentRow.displayName = "ContentRow";

export default ContentRow;
