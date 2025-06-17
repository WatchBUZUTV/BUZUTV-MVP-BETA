
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onSearchClear }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { isLoggedIn, user, logout, setShowLoginModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavbarStyle = () => {
    if (scrollY === 0) {
      return "bg-transparent";
    } else if (scrollY < 300) {
      return "bg-gray-800/70 backdrop-blur-sm";
    } else {
      return "bg-gray-900";
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyle()}`}>
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              Buzu<span className="text-blue-500">TV</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-white hover:text-blue-400 transition-colors">
              Movies
            </Link>
            <Link to="/series" className="text-white hover:text-blue-400 transition-colors">
              TV Shows
            </Link>
            <Link to="/my-list" className="text-white hover:text-blue-400 transition-colors">
              My List
            </Link>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={onSearchChange}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={onSearchClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Authentication */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/series"
              className="block text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link
              to="/my-list"
              className="block text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              My List
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
