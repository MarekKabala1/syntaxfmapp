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

export interface PodcastFeedProps {
  onEpisodeSelect: ({ podcastUrl, title, imageUrl }: { podcastUrl: string; title: string; imageUrl: string }) => void;
}