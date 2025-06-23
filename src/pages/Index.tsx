
import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const { homeContent, channels, isLoading } = useAppContent();
  const { subscriptionIds, toggleSubscription } = useUserSubscriptions();
  const { isLoggedIn, setShowLoginModal } = useAuth();

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
            {Object.values(homeContent).some(arr => arr.length > 0) || channels.length > 0 ? (
              <>
                {/* Content Rows - using pre-computed categories */}
                <ContentRow title="Trending Now" movies={homeContent.trending} />
                <ContentRow title="Action" movies={homeContent.action} />
                <ContentRow title="Drama" movies={homeContent.drama} />
                <ContentRow title="Romance" movies={homeContent.romance} />
                <ContentRow title="Comedy" movies={homeContent.comedy} />
                <ContentRow title="Documentary" movies={homeContent.documentary} />
                <ContentRow title="Informational" movies={homeContent.informational} />
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
