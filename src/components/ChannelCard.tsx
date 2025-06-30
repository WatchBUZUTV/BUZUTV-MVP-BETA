
import { UserPlus, UserCheck } from "lucide-react";
import { Channel } from "@/data/mockMovies";

interface ChannelCardProps {
  channel: Channel;
  isSubscribed?: boolean;
  onSubscribe?: (channelId: string) => void;
}

const ChannelCard = ({ channel, isSubscribed = false, onSubscribe }: ChannelCardProps) => {
  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Subscribe button clicked for channel:', channel.id);
    if (onSubscribe) {
      onSubscribe(channel.id);
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <img
            src={channel.logoUrl}
            alt={channel.name}
            className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
          />
        </div>
        
        {/* Subscribe Button */}
        {onSubscribe && (
          <button
            onClick={handleSubscribe}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
              isSubscribed 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {isSubscribed ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-xs text-gray-300 line-clamp-2">{channel.description}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="font-medium text-white text-sm">{channel.name}</h3>
      </div>
    </div>
  );
};

export default ChannelCard;
