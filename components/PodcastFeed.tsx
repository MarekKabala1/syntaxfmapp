import { useLastPlayedEpisode, usePodcastFeed } from '@/hooks/podcast';
import { formatDuration } from '@/utils/formatTime';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

interface PodcastFeedProps {
	onEpisodeSelect: ({ podcastUrl, title, imageUrl }: { podcastUrl: string; title: string; imageUrl: string }) => void;
}

export default function PodcastFeed({ onEpisodeSelect }: PodcastFeedProps) {
	const { data, isLoading, error } = usePodcastFeed('https://feeds.megaphone.fm/FSI1483080183');
	const { saveLastPlayed } = useLastPlayedEpisode();
	const handleEpisodePress = (data: PodcastEpisode) => {
		if (data) {
			onEpisodeSelect({
				podcastUrl: data.enclosures[0].url,
				title: data.title,
				imageUrl: data.itunes.image,
			});
			saveLastPlayed.mutate({
				podcastUrl: data.enclosures[0].url,
				title: data.title,
				imageUrl: data.itunes.image,
				currentTime: 0,
			});
		} else {
			console.error('Failed to load podcast episodes', error);
		}
	};

	const renderEpisodeItem = ({ data }: { data: PodcastEpisode }) => (
		<TouchableOpacity style={styles.episode} onPress={() => handleEpisodePress(data)}>
			<View style={styles.episodeHeader}>
				<Image source={{ uri: data.itunes.image }} style={styles.episodeImage} resizeMode='cover' />
				<View style={styles.episodeInfo}>
					<Text style={styles.title} numberOfLines={2}>
						{data.title}
					</Text>
					<Text style={styles.duration}>Duration: {formatDuration(data.itunes.duration)}</Text>
				</View>
			</View>

			<Text style={styles.description} numberOfLines={3}>
				{data.description}
			</Text>

			<View style={styles.episodeFooter}>
				<Text style={styles.date}>{new Date(data.published).toLocaleDateString()}</Text>
			</View>
		</TouchableOpacity>
	);

	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size='large' color='#FABF47' />
				<Text>Loading episodes...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.error}>{error.message}</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={data}
			keyExtractor={(data: PodcastEpisode) => data.id}
			renderItem={({ item }) => renderEpisodeItem({ data: item })}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={
				<View style={styles.center}>
					<Text>No episodes found</Text>
				</View>
			}
			contentContainerStyle={styles.listContent}
		/>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listContent: {
		paddingBottom: 20,
	},
	episode: {
		backgroundColor: 'rgba(250, 191, 71, 0.8)',
		marginVertical: 8,
		padding: 16,
		borderRadius: 12,
	},
	episodeHeader: {
		flexDirection: 'row',
		marginBottom: 12,
	},
	episodeImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		marginRight: 12,
	},
	episodeInfo: {
		flex: 1,
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
	},
	duration: {
		fontSize: 14,
		color: '#000',
	},
	description: {
		fontSize: 14,
		color: '#000',
		lineHeight: 20,
		marginBottom: 12,
	},
	episodeFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	date: {
		fontSize: 12,
		color: '#000',
	},
	error: {
		color: 'red',
		textAlign: 'center',
		fontSize: 16,
	},
});
