import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as rssParser from 'react-native-rss-parser';

import localPodcastData from '../assets/data/podcastFeed.json';
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
	onEpisodeSelect: (episode: PodcastEpisode) => void;
}

export default function PodcastFeed({ onEpisodeSelect }: PodcastFeedProps) {
	const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchFeed() {
			try {
				try {
					let episodes: PodcastEpisode[];
					episodes = localPodcastData as PodcastEpisode[];
					setEpisodes(episodes);
					console.log('data from local json');
					setLoading(false);
					setError(null);
					return;
				} catch (localError) {
					console.log('Local asset not found.', localError);
				}
				const response = await fetch('https://feeds.megaphone.fm/FSI1483080183');
				const rssText = await response.text();
				const feed = await rssParser.parse(rssText);
				setEpisodes(feed.items as PodcastEpisode[]);
				console.log('data from rssFeed');
				setError(null);
			} catch (error) {
				console.error('Error parsing RSS:', error);
				setError('Failed to load podcast episodes');
			} finally {
				setLoading(false);
			}
		}

		fetchFeed();
	}, []);

	const handleEpisodePress = (episode: PodcastEpisode) => {
		onEpisodeSelect(episode);
	};

	const formatDuration = (duration: string): string => {
		const seconds = parseInt(duration);
		if (isNaN(seconds)) return duration;

		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	};

	const renderEpisodeItem = ({ item }: { item: PodcastEpisode }) => (
		<TouchableOpacity style={styles.episode} onPress={() => handleEpisodePress(item)}>
			<View style={styles.episodeHeader}>
				<Image source={{ uri: item.itunes.image }} style={styles.episodeImage} resizeMode='cover' />
				<View style={styles.episodeInfo}>
					<Text style={styles.title} numberOfLines={2}>
						{item.title}
					</Text>
					<Text style={styles.duration}>Duration: {formatDuration(item.itunes.duration)}</Text>
				</View>
			</View>

			<Text style={styles.description} numberOfLines={3}>
				{item.description}
			</Text>

			<View style={styles.episodeFooter}>
				<Text style={styles.date}>{new Date(item.published).toLocaleDateString()}</Text>
			</View>
		</TouchableOpacity>
	);

	if (loading) {
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
				<Text style={styles.error}>{error}</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={episodes}
			keyExtractor={(item) => item.id}
			renderItem={renderEpisodeItem}
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
