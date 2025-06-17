
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useChannels } from '@/hooks/useChannels';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']),
  genre: z.string().optional(),
  year: z.string().optional(),
  rating: z.string().optional(),
  posterUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  backdropUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  durationMinutes: z.string().optional(),
  seasons: z.string().optional(),
  episodes: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  channelId: z.string().optional()
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  onSubmit: (data: MovieFormData) => void;
  initialData?: Partial<MovieFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

const MovieForm: React.FC<MovieFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitLabel = 'Save Movie'
}) => {
  const { channels } = useChannels();
  
  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'movie',
      genre: initialData?.genre || '',
      year: initialData?.year || '',
      rating: initialData?.rating || '',
      posterUrl: initialData?.posterUrl || '',
      backdropUrl: initialData?.backdropUrl || '',
      videoUrl: initialData?.videoUrl || '',
      durationMinutes: initialData?.durationMinutes || '',
      seasons: initialData?.seasons || '',
      episodes: initialData?.episodes || '',
      isFeatured: initialData?.isFeatured ?? false,
      isTrending: initialData?.isTrending ?? false,
      channelId: initialData?.channelId || ''
    }
  });

  const watchType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Series</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Genre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter genre"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Year</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="2024"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Rating</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="8.5"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Poster URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/poster.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backdropUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Backdrop URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/backdrop.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Video URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/video.mp4"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === 'movie' && (
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="120"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === 'series' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="seasons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Seasons</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="3"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="episodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Episodes</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="24"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="channelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Channel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-white">Featured</FormLabel>
                  <div className="text-sm text-gray-400">
                    Mark as featured content
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTrending"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-white">Trending</FormLabel>
                  <div className="text-sm text-gray-400">
                    Mark as trending content
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default MovieForm;
