import { getEpisodeProgress, markEpisodeFinished, saveEpisodeProgress } from '@/api/storage';
import { useLastPlayedEpisode } from '@/hooks/usePodcast';
import { formatDuration } from '@/utils/formatTime';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShowDisplay from './ShowDisplay';

export interface AudioPlayerProps {
	channelTitle?: string;
	podcastUrl?: string;
	imageUrl?: string;
	title?: string;
	currentTime?: number;
	published?: string;
}

const SAVE_INTERVAL_MS = 5000;
const FINISH_THRESHOLD = 0.95;

export default function AudioPlayer({ podcastUrl, imageUrl, title, channelTitle }: AudioPlayerProps) {
	const { data: lastPlayedEpisode, saveLastPlayed } = useLastPlayedEpisode();
	const activeEpisode = useMemo(
		() => (podcastUrl ? { podcastUrl, title, imageUrl, channelTitle } : lastPlayedEpisode),
		[podcastUrl, title, imageUrl, lastPlayedEpisode, channelTitle],
	);

	const player = useAudioPlayer(activeEpisode?.podcastUrl || '');
	const status = useAudioPlayerStatus(player);
	const [playbackRate, setPlaybackRate] = useState(player.playbackRate);

	const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const statusRef = useRef(status);
	const activeEpisodeRef = useRef(activeEpisode);
	const lastLoadedUrlRef = useRef<string | null>(null);

	player.shouldCorrectPitch = true;

	useEffect(() => {
		statusRef.current = status;
	}, [status]);

	useEffect(() => {
		activeEpisodeRef.current = activeEpisode;
	}, [activeEpisode]);

	const progressBarWidth = useMemo(() => {
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
		if (!activeEpisode?.podcastUrl) return;

		if (lastLoadedUrlRef.current !== activeEpisode.podcastUrl) {
			player.replace(activeEpisode.podcastUrl);
			lastLoadedUrlRef.current = activeEpisode.podcastUrl;

			const saved = getEpisodeProgress(activeEpisode.podcastUrl);
			if (saved && !saved.isFinished && saved.position > 0) {
				const checkLoaded = setInterval(() => {
					if (status.isLoaded) {
						clearInterval(checkLoaded);
						player.seekTo(saved.position);
					}
				}, 100);

				setTimeout(() => clearInterval(checkLoaded), 5000);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeEpisode?.podcastUrl]);

	useEffect(() => {
		if (!status.playing || !activeEpisode?.podcastUrl) {
			if (saveIntervalRef.current) {
				clearInterval(saveIntervalRef.current);
				saveIntervalRef.current = null;
			}
			return;
		}

		saveIntervalRef.current = setInterval(() => {
			const s = statusRef.current;
			const ep = activeEpisodeRef.current;

			if (!ep?.podcastUrl || s.duration <= 0) return;

			saveEpisodeProgress({
				episodeId: ep.podcastUrl,
				position: s.currentTime,
				duration: s.duration,
				isFinished: s.currentTime / s.duration >= FINISH_THRESHOLD,
				lastPlayed: Date.now(),
			});
		}, SAVE_INTERVAL_MS);

		return () => {
			if (saveIntervalRef.current) {
				clearInterval(saveIntervalRef.current);
				saveIntervalRef.current = null;
			}
		};
	}, [status.playing, activeEpisode?.podcastUrl]);

	useEffect(() => {
		if (status.didJustFinish && activeEpisodeRef.current?.podcastUrl) {
			markEpisodeFinished(activeEpisodeRef.current.podcastUrl);
		}
	}, [status.didJustFinish]);

	const handlePlayPause = useCallback(() => {
		if (status.playing) {
			player.pause();
			if (activeEpisode?.podcastUrl && status.duration && status.currentTime > 0) {
				saveLastPlayed({
					channelTitle: activeEpisode.channelTitle,
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
			saveLastPlayed({
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
			saveLastPlayed({
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
			<ShowDisplay imageUrl={activeEpisode?.imageUrl} title={activeEpisode?.title} />
			<View style={styles.progressBarContainer}>
				<Text style={styles.progressBarTime}>{formatDuration(status.currentTime.toString())}</Text>
				<View style={styles.progressBar}>
					<View style={[styles.progressBarFill, { width: `${progressBarWidth}%` }]} />
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
