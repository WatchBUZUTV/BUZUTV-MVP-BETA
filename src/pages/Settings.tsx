
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Bell, Shield, Palette } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState("1080p");

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <button onClick={handleBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  BUZUTV
                </span>
              </button>
            </div>
          </div>
        </nav>

        <div className="pt-16 max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* User Profile Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                <p className="text-gray-400">{user?.email || "user@example.com"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || "User"}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || "user@example.com"}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Playback Settings */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Playback
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Autoplay</h3>
                  <p className="text-sm text-gray-400">Automatically play next episode</p>
                </div>
                <button 
                  onClick={() => setAutoplay(!autoplay)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${autoplay ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600' : 'bg-gray-600'}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${autoplay ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default Quality</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">Get notified about new content and updates</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Account
            </h2>
            
            <div className="space-y-4">
              <button className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors">
                Download Data
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left bg-red-600 hover:bg-red-700 rounded-lg p-3 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
