import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";
import ProtectedContent from "@/components/auth/ProtectedContent";
import MovieHoverRow from "@/components/MovieHoverRow";

interface HomeRowProps {
  title: string;
  items: any[]; // mixed array
}

const HomeRow = ({ title, items }: HomeRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button onClick={scrollLeft} className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={scrollRight} className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto px-4"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          overflowY: 'hidden',
        }}
      >
        <MovieHoverRow className="flex space-x-2">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-64">
              {item.type === "series" ? (
                <SeriesCard series={item} />
              ) : (
                <ProtectedContent>
                  <MovieCard movie={item} />
                </ProtectedContent>
              )}
            </div>
          ))}
        </MovieHoverRow>
      </div>
    </section>
  );
};

export default HomeRow; 