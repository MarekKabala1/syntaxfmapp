import type { AudioPlayerProps } from '@/components/AudioPlayer.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as rssParser from 'react-native-rss-parser';
// import localPodcastData from '../assets/data/podcastFeed.json';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  published: string;
  enclosures: { url: string }[];
  itunes: {
    duration: string;
    image: string;
  };
}
//ToDo:Add __DEV__ check to use local data only in dev mode
export async function fetchAndParsePodcast(url: string): Promise<PodcastEpisode[]> {
  // try {
  //   const episodes = localPodcastData as PodcastEpisode[];
  //   if (episodes && episodes.length > 0) {
  //     console.log('Using local podcast data');
  //     return episodes;
  //   }
  // } catch (localError) {
  //   console.log('Local asset not found.', localError);
  // }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch podcast feed');
  }
  const rssText = await res.text();
  const feed = await rssParser.parse(rssText);
  return feed.items as PodcastEpisode[];
}

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