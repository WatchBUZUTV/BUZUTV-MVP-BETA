
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import ProtectedContent from "@/components/auth/ProtectedContent";
import AdminAccessModal from "@/components/auth/AdminAccessModal";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onSearchClear }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [scrollBackground, setScrollBackground] = useState("transparent");
  
  const { user, isLoggedIn, setShowLoginModal, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = window.innerHeight * 0.3; // Assuming header is 30vh
      
      if (scrollY === 0) {
        setScrollBackground("transparent");
      } else if (scrollY < headerHeight) {
        setScrollBackground("gray");
      } else {
        setScrollBackground("navy");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = () => {
    console.log('Admin click, user:', user);
    if (user?.isAdmin) {
      setShowAdminModal(true);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowProfileDropdown(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleProfileDropdownLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const getNavbarBackground = () => {
    switch (scrollBackground) {
      case "transparent":
        return "bg-transparent";
      case "gray":
        return "bg-gray-900/70";
      case "navy":
        return "bg-gray-900/95";
      default:
        return "bg-transparent";
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/movies":
        return "Movies";
      case "/series":
        return "Series";
      case "/my-list":
        return "Favorites";
      default:
        return "Home";
    }
  };

  return (
    <>
      {/* Admin Access Modal */}
      <AdminAccessModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${getNavbarBackground()} backdrop-blur-sm border-b border-gray-800/50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                Bizu<span className="text-blue-500">TV</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`hover:text-blue-400 transition-colors ${location.pathname === '/' ? 'text-blue-400' : ''}`}
              >
                Home
              </Link>
              <ProtectedContent>
                <Link 
                  to="/movies" 
                  className={`hover:text-blue-400 transition-colors ${location.pathname === '/movies' ? 'text-blue-400' : ''}`}
                >
                  Movies
                </Link>
              </ProtectedContent>
              <ProtectedContent>
                <Link 
                  to="/series" 
                  className={`hover:text-blue-400 transition-colors ${location.pathname === '/series' ? 'text-blue-400' : ''}`}
                >
                  Series
                </Link>
              </ProtectedContent>
              <ProtectedContent>
                <Link 
                  to="/my-list" 
                  className={`hover:text-blue-400 transition-colors ${location.pathname === '/my-list' ? 'text-blue-400' : ''}`}
                >
                  Favorites
                </Link>
              </ProtectedContent>
            </div>

            {/* Search and User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                {!isSearchExpanded ? (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={onSearchChange}
                      onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                      autoFocus
                      className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          onSearchClear();
                          setIsSearchExpanded(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user?.name}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                        <div className="py-2">
                          <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <button
                            onClick={handleProfileDropdownLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleLogoutClick}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
              
              {isLoggedIn && user?.isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Admin
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={onSearchChange}
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors"
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
              <div className="space-y-2">
                <Link to="/" className="block hover:text-blue-400 transition-colors">Home</Link>
                <ProtectedContent>
                  <Link to="/movies" className="block hover:text-blue-400 transition-colors">Movies</Link>
                </ProtectedContent>
                <ProtectedContent>
                  <Link to="/series" className="block hover:text-blue-400 transition-colors">Series</Link>
                </ProtectedContent>
                <ProtectedContent>
                  <Link to="/my-list" className="block hover:text-blue-400 transition-colors">Favorites</Link>
                </ProtectedContent>
                
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Hi, {user?.name}</div>
                    <button className="block text-left text-gray-400 hover:text-white transition-colors">
                      Settings
                    </button>
                    <button
                      onClick={handleProfileDropdownLogout}
                      className="block text-left text-gray-400 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block text-left text-gray-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                
                {isLoggedIn && user?.isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="block text-left text-gray-400 hover:text-white transition-colors"
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close profile dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;
