
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface ChannelCardProps {
  channel: Channel;
  isSubscribed?: boolean;
  onSubscribe?: (channelId: string) => void;
}

const ChannelCard = ({ channel, isSubscribed = false, onSubscribe }: ChannelCardProps) => {
  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSubscribe) {
      onSubscribe(channel.id);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {channel.logoUrl ? (
            <img 
              src={channel.logoUrl} 
              alt={channel.name}
              className="w-20 h-20 object-contain" // Increased from w-16 h-16 to w-20 h-20
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {channel.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-white truncate">{channel.name}</h3>
          {channel.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{channel.description}</p>
          )}
          
          <Button
            onClick={handleSubscribe}
            variant={isSubscribed ? "secondary" : "default"}
            size="sm"
            className={`w-full ${
              isSubscribed 
                ? "bg-gray-600 hover:bg-gray-500 text-white" 
                : "bg-[#601EF9] hover:bg-[#5016d4] text-white"
            }`}
          >
            {isSubscribed ? (
              <>
                <HeartOff className="w-4 h-4 mr-2" />
                Unsubscribe
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;
