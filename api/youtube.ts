interface YouTubeChannelAPIResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        high?: { url: string };
        medium?: { url: string };
        default: { url: string };
      };
    };
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }[];
}

interface YouTubePlaylistAPIResponse {
  items: {
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        default: { url: string };
      };
    };
    contentDetails: {
      videoId: string;
    };
  }[];
}


export async function fetchYoutubeChannel(
  youtubeChannelId: string
): Promise<YouTubeChannelAPIResponse> {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/channels';
  const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    throw new Error('YouTube API key is not defined');
  }

  const params = new URLSearchParams({
    part: 'contentDetails,snippet',
    id: youtubeChannelId,
    key: API_KEY,
  });

  const res = await fetch(`${baseUrl}?${params.toString()}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `YouTube API error: ${errorData.error?.message || res.status}`
    );
  }

  return res.json();
}

export async function fetchYoutubePlaylistVideos(
  playlistId: string,
  maxResults = 50
): Promise<YouTubePlaylistAPIResponse> {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
  const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    throw new Error('YouTube API key is not defined');
  }

  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    playlistId,
    maxResults: maxResults.toString(),
    key: API_KEY,
  });

  const res = await fetch(`${baseUrl}?${params.toString()}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `YouTube API error: ${errorData.error?.message || res.status}`
    );
  }

  return res.json();
}