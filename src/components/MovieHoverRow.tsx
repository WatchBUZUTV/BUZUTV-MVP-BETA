
import React from 'react';

interface MovieHoverRowProps {
  children: React.ReactNode;
  className?: string;
}

const MovieHoverRow = ({ children, className = "" }: MovieHoverRowProps) => {
  return (
    <div className={`movie-hover-container ${className}`}>
      {children}
    </div>
  );
};

export default MovieHoverRow;
