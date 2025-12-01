
import { PodcastEpisode } from '@/types/podcast';
import * as rssParser from 'react-native-rss-parser';
// import localPodcastData from '../assets/data/podcastFeed.json';


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
  console.log('url fetch')
  if (!res.ok) {
    throw new Error('Failed to fetch podcast feed');
  }
  const rssText = await res.text();
  const feed = await rssParser.parse(rssText);
  return feed.items as PodcastEpisode[];

}