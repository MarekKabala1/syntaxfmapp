import { fetchAndParsePodcast } from '@/api/podcast';
import type { AudioPlayerProps } from '@/components/AudioPlayer.tsx';
import { PodcastEpisode } from '@/types/podcast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePodcastFeed(url: string) {
  return useQuery<PodcastEpisode[], Error>({
    queryKey: ['podcastFeed', url],
    queryFn: () => fetchAndParsePodcast(url),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: !!url,
  });
}

export function useLastPlayedEpisode() {
  const key = ['lastPlayedEpisode'];
  const storageKey = 'lastPlayedEpisode';
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<AudioPlayerProps | null>({
    queryKey: key,
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as AudioPlayerProps;
        return parsed;
      }
      return null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const saveLastPlayed = useMutation({
    mutationFn: async (episode: AudioPlayerProps) => {
      await AsyncStorage.setItem(storageKey, JSON.stringify(episode));
      return episode;
    },
    onSuccess: async (episode) => {
      await queryClient.invalidateQueries({ queryKey: key })
      queryClient.setQueryData(key, episode);
    },
  });

  return { data, ...rest, saveLastPlayed };
}