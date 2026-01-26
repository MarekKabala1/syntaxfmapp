
import { SYNTAX_FM_CHANNEL_ID } from '@/const';
import { useQuery } from '@tanstack/react-query';
import { fetchYoutubeChannel, fetchYoutubePlaylistVideos } from '../api/youtube';


export interface YouTubeChannel {
  playlistId: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

export const useYouTubeChannel = (channelId: string) => {
  return useQuery({
    queryKey: ['youtube-channel', channelId],
    queryFn: async (): Promise<YouTubeChannel> => {
      const data = await fetchYoutubeChannel(channelId);

      if (!data.items || data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = data.items[0];

      return {
        playlistId: channel.contentDetails.relatedPlaylists.uploads,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail:
          channel.snippet.thumbnails.high?.url ||
          channel.snippet.thumbnails.medium?.url ||
          channel.snippet.thumbnails.default.url,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const usePlaylistVideos = (playlistId: string | undefined) => {
  return useQuery({
    queryKey: ['playlist-videos', playlistId],
    queryFn: async (): Promise<YouTubeVideo[]> => {
      if (!playlistId) {
        throw new Error('Playlist ID is required');
      }

      const data = await fetchYoutubePlaylistVideos(playlistId);

      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map((item) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
      }));
    },
    enabled: !!playlistId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSyntaxFMVideos = () => {

  const { data: channel, isLoading: channelLoading, error: channelError } =
    useYouTubeChannel(SYNTAX_FM_CHANNEL_ID);

  const { data: videos, isLoading: videosLoading, error: videosError } =
    usePlaylistVideos(channel?.playlistId);

  return {
    videos,
    channel,
    isLoading: channelLoading || videosLoading,
    error: channelError || videosError,
  };
};