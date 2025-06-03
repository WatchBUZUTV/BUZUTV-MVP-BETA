
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  youtubeId: string;
  genre: string;
  rating: number;
  year: number;
  isFeatured: boolean;
  isTrending: boolean;
}

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750&fit=crop",
    youtubeId: "EXeTwQWrcwY",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    isFeatured: true,
    isTrending: true
  },
  {
    id: "2",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=750&fit=crop",
    youtubeId: "YoHD9XEInc0",
    genre: "Sci-Fi",
    rating: 8.8,
    year: 2010,
    isFeatured: true,
    isTrending: false
  },
  {
    id: "3",
    title: "The Lion King",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    posterUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&h=750&fit=crop",
    youtubeId: "7TavVZMewpY",
    genre: "Family",
    rating: 8.5,
    year: 2019,
    isFeatured: false,
    isTrending: true
  },
  {
    id: "4",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=750&fit=crop",
    youtubeId: "zSWdZVtXT7E",
    genre: "Sci-Fi",
    rating: 8.6,
    year: 2014,
    isFeatured: false,
    isTrending: false
  },
  {
    id: "5",
    title: "Guardians of the Galaxy",
    description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    posterUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&h=750&fit=crop",
    youtubeId: "d96cjJhvlMA",
    genre: "Action",
    rating: 8.0,
    year: 2014,
    isFeatured: false,
    isTrending: true
  },
  {
    id: "6",
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750&fit=crop",
    youtubeId: "6hB3S9bIaco",
    genre: "Drama",
    rating: 9.3,
    year: 1994,
    isFeatured: true,
    isTrending: false
  }
];

export const genres = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Family", "Crime"];
