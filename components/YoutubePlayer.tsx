import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YoutubePlayerProps {
	videoId: string;
}

export default function YoutubeVideoPlayer({ videoId }: YoutubePlayerProps) {
	return (
		<SafeAreaView>
			<YoutubePlayer height={500} width={400} videoId={videoId} />
		</SafeAreaView>
	);
}
