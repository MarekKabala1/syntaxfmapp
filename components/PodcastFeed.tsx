import { getEpisodeProgress, saveLastPlayed } from '@/api/storage';
import { usePodcastFeed } from '@/hooks/usePodcast';
import { PodcastEpisode, PodcastFeedProps } from '@/types/podcast';
import { formatDuration } from '@/utils/formatTime';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const extractEpisodeNumber = (title: string): string | null => {
	const match = title.match(/^(\d+):/);
	return match ? match[1] : null;
};

const getShowType = (published: string): string | null => {
	if (!published) return null;

	const date = new Date(published);
	if (isNaN(date.getTime())) return null;

	const dayOfWeek = date.getDay();
	if (dayOfWeek === 3) return 'Tasty';
	if (dayOfWeek === 1) return 'Hasty';
	return null;
};

const formatDate = (published: string): string => {
	const date = new Date(published);
	if (isNaN(date.getTime())) return published;

	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
};

const formatPublishedLabel = (published: string): string => {
	const date = new Date(published);
	if (isNaN(date.getTime())) return published;

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
};

interface EpisodeItemProps {
	episode: PodcastEpisode;
	isExpanded: boolean;
	isFinished: boolean;
	duration: string | number;
	status: 'finished' | 'in progress' | 'not started';
	onPress: () => void;
	onToggleExpand: () => void;
}

const EpisodeItem = memo(function EpisodeItem({ episode, isExpanded, isFinished, duration, status, onPress, onToggleExpand }: EpisodeItemProps) {
	const episodeNumber = extractEpisodeNumber(episode.title);
	const showType = getShowType(episode.published);
	const publishedLabel = formatPublishedLabel(episode.published);
	const durationOfEpisode = formatDuration(episode.itunes.duration);
	const titleWithoutNumber = episode.title.replace(/^\d+:\s*/, '');

	return (
		<Pressable style={styles.episode} onPress={onPress}>
			<Text style={styles.episodeNumber}>{episodeNumber}</Text>
			<View style={styles.contentContainer}>
				<View style={styles.episodeContent}>
					<View style={styles.metaRow}>
						{showType && <Text style={styles.showType}>{showType} ×</Text>}
						<Text style={styles.date}>{publishedLabel}</Text>
					</View>
					<Text style={styles.date}>Episode Duration: {durationOfEpisode}</Text>
					<Text style={styles.title} numberOfLines={3}>
						{titleWithoutNumber}
					</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
						<Pressable onPress={onToggleExpand} hitSlop={8}>
							<Text style={styles.expandButtonText}>{isExpanded ? 'Hide' : 'Read more'}</Text>
						</Pressable>
						{isFinished ? (
							<Text style={styles.finishedText}>Finished</Text>
						) : (
							<View style={{ alignItems: 'center', gap: 4 }}>
								<Text style={[styles.finishedText, { color: '#FABF47' }]}>{duration} left</Text>
								<Text style={[styles.finishedText, { color: '#FABF47' }]}>{status}</Text>
							</View>
						)}
					</View>

					<View style={styles.descriptionContainer}>
						{isExpanded && (
							<>
								<Text style={styles.description}>{episode.description}</Text>
								<Pressable onPress={onToggleExpand}>
									<Text style={styles.expandButtonText}>{isExpanded ? 'Hide' : ''}</Text>
								</Pressable>
							</>
						)}
					</View>
				</View>
			</View>
		</Pressable>
	);
});

export default function PodcastFeed({ onEpisodeSelect }: PodcastFeedProps) {
	const { data: episodes, isLoading, error } = usePodcastFeed('https://feeds.megaphone.fm/FSI1483080183');
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const finishedMap = useMemo(() => {
		if (!episodes) return new Map<string, boolean>();
		return new Map(episodes.map((episode) => [episode.enclosures[0]?.url, getEpisodeProgress(episode.enclosures[0]?.url)?.isFinished ?? false]));
	}, [episodes]);

	const durationToFinished = useMemo(() => {
		if (!episodes) return new Map();
		return new Map(
			episodes?.map((episode) => {
				const url = episode.enclosures[0]?.url;
				const progress = getEpisodeProgress(url);

				const parseDuration = (durationStr: string): number => {
					if (!durationStr) return 0;
					const num = Number(durationStr);
					return isNaN(num) ? 0 : num;
				};
				if (!progress) {
					const duration = parseDuration(episode.itunes.duration);
					return [
						url,
						{
							duration,
							position: 0,
							isFinished: false,
							timeLeft: duration,
							status: 'not started',
						},
					];
				}

				return [
					url,
					{
						duration: progress?.duration ?? 0,
						position: progress?.position ?? 0,
						isFinished: progress?.isFinished ?? false,
						timeLeft: progress?.duration ? progress.duration - progress.position : 0,
						status: progress?.isFinished ? 'finished' : 'in progress',
					},
				];
			}),
		);
	}, [episodes]);

	const handleEpisodePress = useCallback(
		(episode: PodcastEpisode) => {
			const podcastUrl = episode.enclosures[0]?.url;
			if (!podcastUrl) {
				console.error('Episode missing podcast URL');
				return;
			}

			onEpisodeSelect({
				podcastUrl,
				title: episode.title,
				imageUrl: episode.itunes.image,
				channelTitle: episode.channel?.title || '',
			});
			saveLastPlayed({
				podcastUrl,
				title: episode.title,
				imageUrl: episode.itunes.image,
				currentTime: 0,
			});
		},
		[onEpisodeSelect],
	);

	const handleToggleExpand = useCallback((episodeId: string) => {
		setExpandedId((prev) => (prev === episodeId ? null : episodeId));
	}, []);

	const renderEpisodeItem = useCallback(
		({ item }: { item: PodcastEpisode }) => (
			<EpisodeItem
				episode={item}
				isExpanded={expandedId === item.id}
				isFinished={finishedMap.get(item.enclosures[0]?.url) ?? false}
				duration={formatDuration(durationToFinished.get(item.enclosures[0]?.url)?.timeLeft)}
				onPress={() => handleEpisodePress(item)}
				onToggleExpand={() => handleToggleExpand(item.id)}
				status={durationToFinished.get(item.enclosures[0]?.url)?.status ?? 'not started'}
			/>
		),
		[expandedId, finishedMap, durationToFinished, handleEpisodePress, handleToggleExpand],
	);

	const keyExtractor = useCallback((item: PodcastEpisode) => item.id, []);

	const ListEmptyComponent = useMemo(
		() => (
			<View style={styles.center}>
				<Text style={styles.loadingText}>No episodes found</Text>
			</View>
		),
		[],
	);

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
			data={episodes}
			keyExtractor={keyExtractor}
			renderItem={renderEpisodeItem}
			extraData={expandedId}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={ListEmptyComponent}
			contentContainerStyle={styles.listContent}
			initialNumToRender={10}
			maxToRenderPerBatch={10}
			windowSize={5}
			removeClippedSubviews={true}
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
		top: -20,
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
		textShadowColor: '#000',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 1,
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
		fontWeight: 'bold',
		fontFamily: 'JetBrainsMono',
		fontStyle: 'italic',
	},
	descriptionContainer: {
		width: '100%',
		marginTop: 8,
	},
	finishedText: {
		color: '#00FF00',
		fontSize: 14,
		fontWeight: 'bold',
		fontFamily: 'JetBrainsMono',
		fontStyle: 'italic',
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
