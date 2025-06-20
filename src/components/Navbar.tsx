
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onSearchClear }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLoggedIn, user, logout, setShowLoginModal } = useAuth();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when opening
      setTimeout(() => {
        const input = document.querySelector('input[placeholder="Search movies..."]') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    } else {
      onSearchClear();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                BUZUTV
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-gray-300 transition-colors text-sm">
                Home
              </Link>
              <Link to="/movies" className="text-white hover:text-gray-300 transition-colors text-sm">
                Movies
              </Link>
              <Link to="/series" className="text-white hover:text-gray-300 transition-colors text-sm">
                TV Shows
              </Link>
              <Link to="/my-list" className="text-white hover:text-gray-300 transition-colors text-sm">
                Favorites
              </Link>
            </div>
          </div>

          {/* Right Side - Search and User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {!isSearchOpen ? (
                <button
                  onClick={handleSearchToggle}
                  className="text-white hover:text-gray-300 transition-colors p-2"
                >
                  <Search className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={searchQuery}
                      onChange={onSearchChange}
                      className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-gray-600 border border-gray-700"
                    />
                  </div>
                  <button
                    onClick={handleSearchToggle}
                    className="ml-2 text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* User Authentication */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-300 transition-colors">
                  <User className="w-6 h-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2 cursor-pointer">
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="flex items-center space-x-2 cursor-pointer">
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer">
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex items-center text-white hover:text-gray-300 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-800">
            <Link
              to="/"
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/series"
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link
              to="/my-list"
              className="block text-white hover:text-gray-300 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
