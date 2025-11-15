import AudioPlayer from '@/components/AudioPlayer';
import BgWrapper from '@/components/BgWrapper';
import PodcastFeed, { PodcastEpisode } from '@/components/PodcastFeed';
import React, { useState } from 'react';

export default function Show() {
	const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
	console.log(selectedEpisode?.enclosures[0].url);

	return (
		<BgWrapper>
			{!selectedEpisode ? <AudioPlayer /> : <AudioPlayer uri={selectedEpisode?.enclosures[0]?.url} />}
			<PodcastFeed onEpisodeSelect={setSelectedEpisode} />
		</BgWrapper>
	);
}
