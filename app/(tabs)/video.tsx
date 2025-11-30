import BgWrapper from '@/components/BgWrapper';
import { useSyntaxFMVideos } from '@/hooks/useYouTube';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

export default function Video() {
	const { isLoading, error, videos } = useSyntaxFMVideos();
	// useEffect(() => {
	// 	console.log(videos);
	// }, [videos]);
	if (isLoading) {
		return (
			<BgWrapper>
				<Text>Loading...</Text>
			</BgWrapper>
		);
	}
	if (error) {
		return (
			<BgWrapper>
				<Text>Error loading videos: {error.message}</Text>
			</BgWrapper>
		);
	}
	return (
		<BgWrapper>
			<ScrollView>
				{videos?.map((video) => (
					<View key={video.id} style={{ marginBottom: 20 }}>
						<Image source={{ uri: video.thumbnail }} style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }} resizeMode='cover' />
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{video.title}</Text>
					</View>
				))}
			</ScrollView>
		</BgWrapper>
	);
}
