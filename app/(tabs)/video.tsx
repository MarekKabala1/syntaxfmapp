import BgWrapper from '@/components/BgWrapper';
import { useSyntaxFMVideos } from '@/hooks/useYouTube';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

export default function Video() {
	const { isLoading, error, videos } = useSyntaxFMVideos();

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
	const selectedVideo = (id: string) => {
		router.push({
			pathname: '/[id]',
			params: { id },
		});
	};

	return (
		<BgWrapper>
			<ScrollView>
				{videos?.map((video) => (
					<Pressable key={video.id} style={styles.videoContainer} onPress={() => selectedVideo(video.id)}>
						<Image source={{ uri: video.thumbnail }} style={styles.videoImage} resizeMode='cover' />
						<Text style={styles.videoTitle}>{video.title}</Text>
					</Pressable>
				))}
			</ScrollView>
		</BgWrapper>
	);
}

const styles = StyleSheet.create({
	videoContainer: {
		marginBottom: 20,
		borderWidth: 2,
		borderColor: 'rgba(241, 243, 244,0.5)',
		borderRadius: 10,
		padding: 10,
	},
	videoImage: {
		width: '100%',
		height: 200,
		borderRadius: 10,
		marginBottom: 10,
	},
	videoTitle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '900',
		fontFamily: 'JetBrainsMono',
		fontStyle: 'italic',
		letterSpacing: -1,
	},
});
