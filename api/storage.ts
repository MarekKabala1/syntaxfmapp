import type { AudioPlayerProps } from '@/components/AudioPlayer';
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'podcast-storage' });

export interface EpisodeProgress {
  episodeId: string;
  position: number;
  duration: number;
  isFinished: boolean;
  lastPlayed: number;
}

export function saveEpisodeProgress(progress: EpisodeProgress) {
  storage.set(`episode_progress_${progress.episodeId}`, JSON.stringify(progress));
}

export function getEpisodeProgress(episodeId: string): EpisodeProgress | null {
  const data = storage.getString(`episode_progress_${episodeId}`);
  return data ? JSON.parse(data) : null;
}

export function markEpisodeFinished(episodeId: string) {
  const existing = getEpisodeProgress(episodeId);
  if (existing) {
    saveEpisodeProgress({ ...existing, isFinished: true });
  }
}

export function saveLastPlayed(episode: AudioPlayerProps) {
  storage.set('lastPlayedEpisode', JSON.stringify(episode));
}

export function getLastPlayed(): AudioPlayerProps | null {
  const data = storage.getString('lastPlayedEpisode');
  return data ? JSON.parse(data) : null;
}