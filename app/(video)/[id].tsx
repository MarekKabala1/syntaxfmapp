import BgWrapper from '@/components/BgWrapper';

import YoutubeVideoPlayer from '@/components/YoutubePlayer';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function VideoId() {
	const { id } = useLocalSearchParams<{ id: string }>();
	return (
		<BgWrapper>
			<YoutubeVideoPlayer videoId={id} />
		</BgWrapper>
	);
}
