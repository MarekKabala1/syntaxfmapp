import { useLastPlayedEpisode, usePodcastFeed } from '@/hooks/usePodcast';
import { PodcastEpisode, PodcastFeedProps } from '@/types/podcast';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const extractEpisodeNumber = (title: string): string | null => {
	const match = title.match(/^(\d+):/);
	return match ? match[1] : null;
};

const getShowType = (published: string): string | null => {
	if (!published) return null;

	try {
		const date = new Date(published);
		const dayOfWeek = date.getDay();

		if (dayOfWeek === 3) {
			return 'Tasty';
		} else if (dayOfWeek === 1) {
			return 'Hasty';
		}
	} catch {}

	return null;
};

const formatDate = (published: string): string => {
	try {
		const date = new Date(published);
		const options: Intl.DateTimeFormatOptions = {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		};
		return date.toLocaleDateString('en-US', options);
	} catch {
		return new Date(published).toLocaleDateString();
	}
};

const formatPublishedLabel = (published: string): string => {
	try {
		const date = new Date(published);
		const diffMs = Date.now() - date.getTime();
		if (!Number.isFinite(diffMs) || diffMs < 0) return formatDate(published);

		const minutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (days >= 21) return formatDate(published);
		if (days >= 7) return `${Math.max(1, Math.floor(days / 7))} weeks ago`;
		if (days >= 1) return `${days} days ago`;
		if (hours >= 1) return `${hours} hours ago`;
		return `${Math.max(1, minutes)} minutes ago`;
	} catch {
		return formatDate(published);
	}
};

export default function PodcastFeed({ onEpisodeSelect }: PodcastFeedProps) {
	const { data, isLoading, error } = usePodcastFeed('https://feeds.megaphone.fm/FSI1483080183');
	const { saveLastPlayed } = useLastPlayedEpisode();
	const [expandedId, setExpandedId] = useState<string | null>(null);
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

	const renderEpisodeItem = ({ data }: { data: PodcastEpisode }) => {
		const episodeNumber = extractEpisodeNumber(data.title);
		const showType = getShowType(data.published);
		const publishedLabel = formatPublishedLabel(data.published);

		const titleWithoutNumber = data.title.replace(/^\d+:\s*/, '');
		const isExpanded = expandedId === data.id;

		return (
			<Pressable style={styles.episode} onPress={() => handleEpisodePress(data)}>
				<Text style={styles.episodeNumber}>{episodeNumber}</Text>
				<View style={styles.contentContainer}>
					<View style={styles.episodeContent}>
						<View style={styles.metaRow}>
							{showType && <Text style={styles.showType}>{showType} ×</Text>}
							<Text style={styles.date}>{publishedLabel}</Text>
						</View>
						<Text style={styles.title} numberOfLines={2}>
							{titleWithoutNumber}
						</Text>
						<Pressable
							onPress={(e) => {
								(e as any)?.stopPropagation?.();
								setExpandedId((prev) => (prev === data.id ? null : data.id));
							}}>
							<Text style={styles.expandButtonText}>{isExpanded ? 'Hide' : 'Read more'}</Text>
						</Pressable>
						{isExpanded ? <Text style={styles.description}>{data.description}</Text> : null}
					</View>
				</View>
			</Pressable>
		);
	};

	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size='large' color='#FABF47' />
				<Text style={styles.loadingText}>Loading episodes...</Text>
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
					<Text style={styles.loadingText}>No episodes found</Text>
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
		zIndex: 1,
	},
	listContent: {
		paddingBottom: 20,
	},
	episode: {
		backgroundColor: 'transparent',
		width: '100%',
		marginVertical: 24,
		paddingHorizontal: 16,
		paddingVertical: 20,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'rgba(241, 243, 244,0.5)',
		overflow: 'hidden',
	},
	episodeNumber: {
		fontSize: 120,
		fontWeight: 'bold',
		color: '#FABF47',
		position: 'absolute',
		top: -25,
		right: -20,
		zIndex: 0,
		lineHeight: 120,
	},
	contentContainer: {
		flexDirection: 'row',
		zIndex: 1,
	},
	playButton: {
		marginRight: 16,
		justifyContent: 'flex-start',
		paddingTop: 4,
	},
	episodeContent: {
		flex: 1,
		paddingTop: 6,
		paddingRight: 72,
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	showType: {
		fontSize: 14,
		fontWeight: '400',
		color: '#F1F3F4',
	},
	date: {
		fontSize: 14,
		fontWeight: '400',
		color: '#F1F3F4',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		fontStyle: 'italic',
		color: '#FFFFFF',
		marginTop: 8,
		marginBottom: 12,
		lineHeight: 32,
	},
	description: {
		fontSize: 16,
		color: '#F1F3F4',
		lineHeight: 24,
		marginBottom: 8,
	},
	expandButtonText: {
		color: '#FABF47',
		fontSize: 14,
		marginBottom: 8,
	},
	loadingText: {
		color: '#FFFFFF',
		fontSize: 16,
	},
	error: {
		color: '#FF6B6B',
		textAlign: 'center',
		fontSize: 16,
	},
});
