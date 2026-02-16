import type { AudioPlayerProps } from '@/components/AudioPlayer';
import { PodcastEpisode } from '@/types/podcast';
import { useQuery } from '@tanstack/react-query';
import { useMMKVObject } from 'react-native-mmkv';
import { fetchAndParsePodcast } from '../api/podcast';
import { storage } from '../api/storage';

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
  const [lastPlayed, setLastPlayed] = useMMKVObject<AudioPlayerProps>(
    'lastPlayedEpisode',
    storage
  );

  return {
    data: lastPlayed ?? null,
    saveLastPlayed: (episode: AudioPlayerProps) => setLastPlayed(episode),
  };
}