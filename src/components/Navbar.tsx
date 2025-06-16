
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, ChevronDown, LogOut, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AdminAccessModal from "@/components/auth/AdminAccessModal";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onSearchClear }: NavbarProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { logout, user, isLoggedIn, setShowLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Store current path for back navigation
  useEffect(() => {
    if (!searchQuery) {
      localStorage.setItem('lastMainPage', location.pathname);
    }
  }, [location.pathname, searchQuery]);

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    if (searchExpanded) {
      onSearchClear();
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowProfileDropdown(false);
  };

  const handleAdminClick = () => {
    if (user?.isAdmin) {
      setShowAdminModal(true);
      setShowProfileDropdown(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowProfileDropdown(false);
  };

  const handleMainLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const getNavBackground = () => {
    const scrollY = window.scrollY;
    
    if (scrollY === 0) {
      return 'bg-transparent';
    } else if (scrollY > 0 && scrollY < 200) {
      return 'bg-gray-700/60 backdrop-blur-sm';
    } else {
      return 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-800';
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavBackground()}`}>
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              Bizu<span className="text-blue-500">TV</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/movies" className="hover:text-blue-400 transition-colors">
                Movies
              </Link>
              <Link to="/series" className="hover:text-blue-400 transition-colors">
                Series
              </Link>
              <Link to="/my-list" className="hover:text-blue-400 transition-colors">
                Favorites
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                {searchExpanded ? (
                  <div className="flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search movies, series..."
                      value={searchQuery}
                      onChange={onSearchChange}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all duration-300"
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Login/Profile Section */}
              {isLoggedIn ? (
                <>
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2">
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-sm text-gray-300">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                          {user?.isAdmin && (
                            <span className="text-xs text-blue-400">Admin</span>
                          )}
                        </div>
                        <button
                          onClick={handleSettingsClick}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        {user?.isAdmin && (
                          <button
                            onClick={handleAdminClick}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </button>
                        )}
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleMainLogout}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Access Modal */}
      <AdminAccessModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </>
  );
};

export default Navbar;
