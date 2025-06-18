
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useUserSubscriptions = () => {
  const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptionIds([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('channel_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
      }

      setSubscriptionIds(data?.map(sub => sub.channel_id).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const toggleSubscription = async (channelId: string) => {
    if (!user) {
      toast.error('Please log in to subscribe to channels');
      return;
    }

    try {
      const isSubscribed = subscriptionIds.includes(channelId);

      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('channel_id', channelId);

        if (error) {
          console.error('Error unsubscribing:', error);
          toast.error('Failed to unsubscribe');
          return;
        }

        setSubscriptionIds(prev => prev.filter(id => id !== channelId));
        toast.success('Unsubscribed successfully');
      } else {
        // Subscribe
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            channel_id: channelId
          });

        if (error) {
          console.error('Error subscribing:', error);
          toast.error('Failed to subscribe');
          return;
        }

        setSubscriptionIds(prev => [...prev, channelId]);
        toast.success('Subscribed successfully');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('An error occurred');
    }
  };

  return {
    subscriptionIds,
    isLoading,
    toggleSubscription,
    refetch: fetchSubscriptions
  };
};
