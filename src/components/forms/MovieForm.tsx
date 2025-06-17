
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useChannels } from '@/hooks/useChannels';
import { Plus, Trash2 } from 'lucide-react';

const seasonSchema = z.object({
  seasonNumber: z.number().min(1),
  episodeCount: z.number().min(1)
});

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
  seasons: z.array(seasonSchema).optional(),
  totalSeasons: z.string().optional(),
  totalEpisodes: z.string().optional(),
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
      seasons: initialData?.seasons || [],
      totalSeasons: initialData?.totalSeasons || '',
      totalEpisodes: initialData?.totalEpisodes || '',
      isFeatured: initialData?.isFeatured ?? false,
      isTrending: initialData?.isTrending ?? false,
      channelId: initialData?.channelId || ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'seasons'
  });

  const watchType = form.watch('type');
  const watchSeasons = form.watch('seasons');

  // Calculate total episodes when seasons change
  React.useEffect(() => {
    if (watchType === 'series' && watchSeasons) {
      const totalEpisodes = watchSeasons.reduce((sum, season) => sum + (season.episodeCount || 0), 0);
      form.setValue('totalEpisodes', totalEpisodes.toString());
      form.setValue('totalSeasons', watchSeasons.length.toString());
    }
  }, [watchSeasons, watchType, form]);

  const addSeason = () => {
    append({ seasonNumber: fields.length + 1, episodeCount: 1 });
  };

  const handleSubmit = (data: MovieFormData) => {
    // Transform seasons data for backend
    const transformedData = {
      ...data,
      seasons: data.type === 'series' ? data.totalSeasons : undefined,
      episodes: data.type === 'series' ? data.totalEpisodes : undefined,
      seasonsData: data.type === 'series' ? data.seasons : undefined
    };
    onSubmit(transformedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Episode Management</h3>
              <Button
                type="button"
                onClick={addSeason}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Season
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`seasons.${index}.seasonNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Season Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-600 border-gray-500 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`seasons.${index}.episodeCount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Episodes</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-600 border-gray-500 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {fields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="totalSeasons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Total Seasons</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-gray-600 border-gray-500 text-white cursor-not-allowed"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalEpisodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Total Episodes</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-gray-600 border-gray-500 text-white cursor-not-allowed"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
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
