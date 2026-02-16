export interface PodcastEpisode {
  channel?: {
    title: string;
  };
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

export interface PodcastFeedProps {
  onEpisodeSelect: ({ podcastUrl, title, imageUrl, channelTitle }: { podcastUrl: string; title: string; imageUrl: string; channelTitle: string }) => void;
}