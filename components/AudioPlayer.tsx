import { useLastPlayedEpisode } from '@/hooks/usePodcast';
import { formatDuration } from '@/utils/formatTime';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface AudioPlayerProps {
	podcastUrl?: string;
	imageUrl?: string;
	title?: string;
	currentTime?: number;
}

export default function AudioPlayer({ podcastUrl, imageUrl, title }: AudioPlayerProps) {
	const { data: lastPlayedEpisode, saveLastPlayed } = useLastPlayedEpisode();
	const activeEpisode = useMemo(() => (podcastUrl ? { podcastUrl, title, imageUrl } : lastPlayedEpisode), [podcastUrl, title, imageUrl, lastPlayedEpisode]);

	const player = useAudioPlayer(activeEpisode?.podcastUrl || '');
	const status = useAudioPlayerStatus(player);
	const [playbackRate, setPlaybackRate] = useState(player.playbackRate);
	player.shouldCorrectPitch = true;

	const progressBarrWidth = useMemo(() => {
		return status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;
	}, [status.currentTime, status.duration]);

	useEffect(() => {
		if (Math.abs(player.playbackRate - playbackRate) > 0.01) {
			setPlaybackRate(player.playbackRate);
		}
	}, [player.playbackRate, playbackRate]);

	useEffect(() => {
		setAudioModeAsync({
			playsInSilentMode: true,
			shouldPlayInBackground: true,
			interruptionModeAndroid: 'duckOthers',
			interruptionMode: 'doNotMix',
		});
	}, []);

	useEffect(() => {
		if (activeEpisode?.podcastUrl) {
			player.replace(activeEpisode.podcastUrl);
			player.seekTo(activeEpisode.currentTime || 0);
		}
	}, [activeEpisode?.podcastUrl, activeEpisode?.currentTime, player]);

	const handlePlayPause = useCallback(() => {
		if (status.playing) {
			player.pause();
			if (activeEpisode?.podcastUrl && status.duration && status.currentTime > 0) {
				saveLastPlayed.mutate({
					podcastUrl: activeEpisode.podcastUrl,
					title: activeEpisode.title,
					imageUrl: activeEpisode.imageUrl,
					currentTime: status.currentTime,
				});
			}
		} else {
			player.play();
		}
	}, [status.playing, status.currentTime, status.duration, player, activeEpisode, saveLastPlayed]);

	const goForward = useCallback(() => {
		const currentTime = player.currentTime;
		const goTo = Math.max(0, Math.min(currentTime + 15, status.duration || 0));
		player.seekTo(goTo);
		if (activeEpisode?.podcastUrl && status.duration && goTo > 0) {
			saveLastPlayed.mutate({
				podcastUrl: activeEpisode.podcastUrl,
				title: activeEpisode.title,
				imageUrl: activeEpisode.imageUrl,
				currentTime: goTo,
			});
		}
	}, [player, status.duration, activeEpisode, saveLastPlayed]);

	const skipBack = useCallback(() => {
		const currentTime = player.currentTime;
		const goTo = Math.max(0, currentTime - 15);
		player.seekTo(goTo);
		if (activeEpisode?.podcastUrl && status.duration && goTo > 0) {
			saveLastPlayed.mutate({
				podcastUrl: activeEpisode.podcastUrl,
				title: activeEpisode.title,
				imageUrl: activeEpisode.imageUrl,
				currentTime: goTo,
			});
		}
	}, [player, status.duration, activeEpisode, saveLastPlayed]);
	const PlaybackRate = useMemo(() => {
		const rates = [1.0, 1.2, 1.5, 1.8, 2.0];

		const handleRatePress = () => {
			const currentIndex = rates.findIndex((rate) => Math.abs(rate - playbackRate) < 0.01);
			const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % rates.length;
			const nextRate = rates[nextIndex];

			setPlaybackRate(nextRate);
			player.setPlaybackRate(nextRate, 'high');
		};

		return (
			<TouchableOpacity style={styles.playbackRateButton} onPress={handleRatePress}>
				<Text style={styles.playbackRateText}>{playbackRate.toFixed(1)}x</Text>
			</TouchableOpacity>
		);
	}, [playbackRate, player]);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<View style={styles.logoContainer}>
					<Image source={require('../assets/images/SyntaxLogoWide.png')} style={styles.titleImage} resizeMode='contain' />
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Player</Text>
					</View>
				</View>
				{activeEpisode?.imageUrl ? <Image style={styles.image} source={{ uri: activeEpisode.imageUrl }} /> : null}
			</View>
			<Text style={styles.title}>{activeEpisode?.title || 'No episode selected'}</Text>
			<View style={styles.progressBarContainer}>
				<Text style={styles.progressBarTime}>{formatDuration(status.currentTime.toString())}</Text>
				<View style={styles.progressBar}>
					<View style={[styles.progressBarFill, { width: `${progressBarrWidth}%` }]} />
				</View>
				<Text style={styles.progressBarTime}>{formatDuration(status.duration.toString())}</Text>
			</View>
			<View style={styles.bottomContainer}>
				<View style={styles.controlsContainer}>
					<View style={styles.controlsRow}>
						<TouchableOpacity onPress={skipBack}>
							<Ionicons name='arrow-undo-outline' size={18} color='#FABF47' />
							<Text style={styles.skipText}>15</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handlePlayPause}>
							<Ionicons name={status.playing ? 'pause-outline' : 'play-outline'} size={35} color='#FABF47' />
						</TouchableOpacity>
						<TouchableOpacity onPress={goForward}>
							<Ionicons name='arrow-redo-outline' size={18} color='#FABF47' />
							<Text style={styles.skipText}>15</Text>
						</TouchableOpacity>
					</View>
				</View>
				{PlaybackRate}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#FABF47',
		borderRadius: 10,
		justifyContent: 'center',
		backgroundColor: '#000',
		padding: 10,
		zIndex: 1,
		position: 'relative',
		marginBottom: 10,
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	logoContainer: {
		justifyContent: 'center',
	},
	titleImage: {
		width: 120,
		height: 40,
	},
	title: {
		color: '#FABF47',
		fontSize: 12,
		fontWeight: 'bold',
		width: '100%',
		textAlign: 'center',
		marginBottom: 8,
	},
	image: {
		width: 90,
		height: 90,
	},
	titleContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressBarContainer: {
		flexDirection: 'row',
		width: '100%',
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: '#FABF47',
		borderRadius: 2,
		marginHorizontal: 10,
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: '#806d48ff',
		borderRadius: 2,
	},
	progressBarTime: {
		color: '#FABF47',
		fontSize: 10,
		fontWeight: 'bold',
	},
	bottomContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	controlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	controlsRow: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	skipText: {
		color: '#FABF47',
		fontSize: 10,
		fontWeight: 'bold',
	},
	playbackRateButton: {
		position: 'absolute',
		right: '20%',
		top: '50%',
		transform: [{ translateY: '-50%' }],
		justifyContent: 'center',
	},
	playbackRateText: {
		color: '#FABF47',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
