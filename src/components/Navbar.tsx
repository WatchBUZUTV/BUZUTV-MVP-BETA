
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Restore NavbarProps interface
interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

// Restore Navbar to accept props
const Navbar = ({ searchQuery, onSearchChange, onSearchClear }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn, user, logout, setShowLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleSignUpClick = () => {
    navigate('/auth?mode=signup');
  };

  const handleLogout = () => {
    logout();
  };

  // New: Intercept nav for unauth users
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (!isLoggedIn && path !== "/") {
      e.preventDefault();
      setShowLoginModal(true);
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Collapse search if input loses focus and query is empty
  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchOpen(false);
    }
  };

  // Collapse on Escape if query is empty
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && !searchQuery) {
      setIsSearchOpen(false);
    }
  };

  // EXPERIMENTAL: Transparent-on-scroll navbar
  // --------------------------------------------------
  // const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 10);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);
  // --------------------------------------------------
  // END EXPERIMENTAL

  return (
    <nav
      className={
        // Always solid background now
        'fixed top-0 left-0 right-0 z-50 flex items-center h-14 bg-black transition-colors duration-500'
      }
      style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.25)' }}
    >
      <div className="max-w-full px-6 w-full flex items-center justify-between h-14 relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              BUZUTV
            </h1>
          </Link>
        </div>

        {/* Center Navigation - always centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-1">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-white hover:text-gray-300 transition-colors text-base" onClick={e => handleNavClick(e, "/")}>Home</Link>
            <Link to="/movies" className="text-white hover:text-gray-300 transition-colors text-base" onClick={e => handleNavClick(e, "/movies")}>Movies</Link>
            <Link to="/series" className="text-white hover:text-gray-300 transition-colors text-base" onClick={e => handleNavClick(e, "/series")}>TV Shows</Link>
            <Link to="/my-list" className="text-white hover:text-gray-300 transition-colors text-base" onClick={e => handleNavClick(e, "/my-list")}>Favorites</Link>
          </div>
        </div>

        {/* Right Side - Search and User */}
        <div className="flex items-center gap-4">
            {/* Search - icon by default, expands on click */}
            <div className="relative">
              {isSearchOpen || searchQuery ? (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={onSearchChange}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleSearchKeyDown}
                  className="bg-black text-white pl-3 pr-10 py-0.5 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-gray-600 border border-gray-700 transition-all duration-200"
                  style={{ height: '32px' }}
                />
              ) : (
                <button
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginModal(true);
                      return;
                    }
                    setIsSearchOpen(true);
                  }}
                  aria-label="Open search"
                >
                  <Search className="text-gray-400 w-5 h-5" />
                </button>
              )}
              {(isSearchOpen || searchQuery) && (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignUpClick}
                  className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={handleLoginClick}
                  className="text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#601EF9' }}
                >
                  Log In
                </button>
                <button
                  onClick={handleLoginClick}
                  className="flex items-center text-white hover:text-gray-300 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Fade effect at bottom of navbar - REMOVED for experimental transparent navbar */}
        {/* <div className="absolute left-0 right-0 bottom-0 h-4 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))' }} /> */}
      </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-800">
            <Link to="/" className="block text-white hover:text-gray-300 transition-colors py-2" onClick={e => handleNavClick(e, "/")}>Home</Link>
            <Link to="/movies" className="block text-white hover:text-gray-300 transition-colors py-2" onClick={e => handleNavClick(e, "/movies")}>Movies</Link>
            <Link to="/series" className="block text-white hover:text-gray-300 transition-colors py-2" onClick={e => handleNavClick(e, "/series")}>TV Shows</Link>
            <Link to="/my-list" className="block text-white hover:text-gray-300 transition-colors py-2" onClick={e => handleNavClick(e, "/my-list")}>Favorites</Link>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
