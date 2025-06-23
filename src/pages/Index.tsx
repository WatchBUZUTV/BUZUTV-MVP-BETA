
import { useState, useMemo } from "react";
import ChannelModal from "@/components/ChannelModal";
import SearchOverlay from "@/components/SearchOverlay";
import Navbar from "@/components/Navbar";
import HomeHeroBanner from "@/components/HomeHeroBanner";
import ContentRow from "@/components/ContentRow";
import ChannelRow from "@/components/ChannelRow";
import { useAppContent } from "@/hooks/useAppContent";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  console.log('Index component rendering');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const { movies, channels, isLoading } = useAppContent();
  const { subscriptionIds, toggleSubscription } = useUserSubscriptions();
  const { isLoggedIn, setShowLoginModal } = useAuth();

  console.log('Channels data:', channels);
  console.log('Subscription IDs:', subscriptionIds);

  // Memoize filtered content to prevent unnecessary re-computations
  const contentSections = useMemo(() => ({
    trending: movies.filter(item => item.isTrending),
    action: movies.filter(item => item.genre === "Action"),
    drama: movies.filter(item => item.genre === "Drama"),
    romance: movies.filter(item => item.genre === "Romance"),
    comedy: movies.filter(item => item.genre === "Comedy"),
    documentary: movies.filter(item => item.genre === "Documentary"),
    informational: movies.filter(item => item.genre === "Informational"),
  }), [movies]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleChannelClick = (channel: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedChannel(channel);
    setShowChannelModal(true);
  };

  const handleCloseChannelModal = () => {
    setShowChannelModal(false);
    setSelectedChannel(null);
  };

  const showSearchOverlay = searchQuery.trim().length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Channel Modal */}
      <ChannelModal 
        isOpen={showChannelModal}
        onClose={handleCloseChannelModal}
        channel={selectedChannel}
      />

      {/* Search Overlay */}
      {showSearchOverlay && (
        <SearchOverlay 
          isOpen={true} 
          onClose={handleClearSearch}
          searchQuery={searchQuery}
        />
      )}

      {/* Navigation */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleClearSearch}
      />

      {/* Only show home content when not searching */}
      {!showSearchOverlay && (
        <div className="pt-16">
          {/* Hero Banner */}
          <HomeHeroBanner />

          <div className="max-w-full px-2 py-8">
            {/* Top Channels */}
            <ChannelRow 
              channels={channels}
              onChannelClick={handleChannelClick}
              subscriptionIds={subscriptionIds}
              onSubscribe={toggleSubscription}
            />

            {/* Show content only if we have any */}
            {movies.length > 0 || channels.length > 0 ? (
              <>
                {/* Content Rows */}
                <ContentRow title="Trending Now" movies={contentSections.trending} />
                <ContentRow title="Action" movies={contentSections.action} />
                <ContentRow title="Drama" movies={contentSections.drama} />
                <ContentRow title="Romance" movies={contentSections.romance} />
                <ContentRow title="Comedy" movies={contentSections.comedy} />
                <ContentRow title="Documentary" movies={contentSections.documentary} />
                <ContentRow title="Informational" movies={contentSections.informational} />
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No content available</h2>
                <p className="text-gray-400">Content will appear here once it's added to the platform</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
              <p>&copy; 2024 BUZUTV. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
