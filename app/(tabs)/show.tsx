import AudioPlayer from '@/components/AudioPlayer';
import BgWrapper from '@/components/BgWrapper';
import PodcastFeed, { PodcastEpisode } from '@/components/PodcastFeed';
import React, { useState } from 'react';

export default function Show() {
	const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);

	return (
		<BgWrapper>
			{!selectedEpisode ? (
				<AudioPlayer />
			) : (
				<AudioPlayer title={selectedEpisode.title} imageUrl={selectedEpisode.itunes.image} podcastUrl={selectedEpisode?.enclosures[0]?.url} />
			)}
			<PodcastFeed onEpisodeSelect={setSelectedEpisode} />
		</BgWrapper>
	);
}
