import AudioPlayer from '@/components/AudioPlayer';
import BgWrapper from '@/components/BgWrapper';
import PodcastFeed from '@/components/PodcastFeed';
import React, { useState } from 'react';

export default function Show() {
	const [selectedEpisode, setSelectedEpisode] = useState<{ podcastUrl: string; title: string; imageUrl: string } | null>(null);

	return (
		<BgWrapper>
			<AudioPlayer title={selectedEpisode?.title} imageUrl={selectedEpisode?.imageUrl} podcastUrl={selectedEpisode?.podcastUrl} />
			<PodcastFeed onEpisodeSelect={setSelectedEpisode} />
		</BgWrapper>
	);
}
