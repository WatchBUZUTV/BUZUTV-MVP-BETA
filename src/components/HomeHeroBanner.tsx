
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HomeHeroBanner = () => {
  const { isLoggedIn, setShowLoginModal } = useAuth();

  const handleSignUpClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="relative h-[60vh] overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
        {/* Matrix effect overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="matrix-rain"></div>
        </div>
        
        {/* Fade gradient to blend with navy below */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-start h-full">
        <div className="text-left max-w-4xl px-4 ml-32">
          {/* Updated heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-white">Stream Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">Favorites</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Discover and watch all of your favorite Ethiopian Movies and TV Shows all in one place. Entertainment the modern way.
          </p>

          {/* Sign Up Button - only show if not logged in */}
          {!isLoggedIn && (
            <button
              onClick={handleSignUpClick}
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 transition-all duration-300 text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 border border-white/10 backdrop-blur-sm"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          )}
        </div>
      </div>

      {/* Matrix rain CSS */}
      <style>{`
        .matrix-rain {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, #0f4c75, transparent),
            radial-gradient(1px 1px at 40% 70%, #3282b8, transparent),
            radial-gradient(1px 1px at 90% 40%, #0f4c75, transparent),
            radial-gradient(1px 1px at 30% 80%, #3282b8, transparent),
            radial-gradient(1px 1px at 60% 10%, #0f4c75, transparent);
          background-repeat: repeat;
          background-size: 100px 80px;
          animation: matrix-scroll 20s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </div>
  );
};

export default HomeHeroBanner;
