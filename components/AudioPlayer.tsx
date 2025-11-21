import { useLastPlayedEpisode } from '@/hooks/podcast';
import { formatDuration } from '@/utils/formatTime';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
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
	const [modalVisible, setModalVisible] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(player.playbackRate);
	player.shouldCorrectPitch = true;

	const progressBarrWidth = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

	useEffect(() => {
		if (activeEpisode?.podcastUrl) {
			player.replace(activeEpisode.podcastUrl);
			player.seekTo(activeEpisode.currentTime || 0);
		}
	}, [activeEpisode?.podcastUrl, player, activeEpisode?.currentTime]);

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

	const goForward = () => {
		const currentTime = player.currentTime;
		const goTo = currentTime + 15;
		player.seekTo(goTo);
		if (activeEpisode?.podcastUrl && status.duration && status.currentTime > 0) {
			saveLastPlayed.mutate({
				podcastUrl: activeEpisode.podcastUrl,
				title: activeEpisode.title,
				imageUrl: activeEpisode.imageUrl,
				currentTime: goTo,
			});
		}
	};
	const skipBack = () => {
		const currentTime = player.currentTime;
		const goTo = currentTime - 15;
		player.seekTo(goTo);
		if (activeEpisode?.podcastUrl && status.duration && status.currentTime > 0) {
			saveLastPlayed.mutate({
				podcastUrl: activeEpisode.podcastUrl,
				title: activeEpisode.title,
				imageUrl: activeEpisode.imageUrl,
				currentTime: goTo,
			});
		}
	};

	const PlaybackRateModal = () => {
		return (
			<View style={styles.modalContainer}>
				<Text style={styles.modalTitle}>Playback Rate</Text>
				<Text style={{ color: '#FABF47' }}>{playbackRate.toFixed(1)}x</Text>
				<Slider
					style={{ width: '70%', height: 0, backgroundColor: '#FABF47' }}
					minimumValue={0.5}
					maximumValue={2}
					maximumTrackTintColor='#FABF47'
					value={Number(playbackRate)}
					onValueChange={async (value) => {
						setPlaybackRate(Number(value.toFixed(1)));
						player.setPlaybackRate(Number(value.toFixed(1)), 'high');
					}}
					step={0.1}
				/>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<View style={styles.logoContainer}>
					<Image source={require('../assets/images/SyntaxLogoWide.png')} style={styles.titleImage} resizeMode='contain' />
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Player</Text>
					</View>
				</View>
				{activeEpisode?.imageUrl ? <Image style={{ width: 50, height: 50 }} source={{ uri: activeEpisode.imageUrl }} /> : null}
			</View>
			<Text style={styles.title}>{activeEpisode?.title || 'No episode selected'}</Text>
			<View style={styles.bottomContainer}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity onPress={skipBack}>
						<Ionicons name='arrow-back' size={12} color='#FABF47' />
					</TouchableOpacity>
					<TouchableOpacity onPress={handlePlayPause}>
						<Ionicons name={status.playing ? 'pause' : 'play'} size={30} color='#FABF47' />
					</TouchableOpacity>
					<TouchableOpacity onPress={goForward}>
						<Ionicons name='arrow-forward' size={12} color='#FABF47' />
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
					<MaterialCommunityIcons name='play-speed' size={24} color='#FABF47' />
				</TouchableOpacity>
				{modalVisible ? <PlaybackRateModal /> : null}
				<View style={styles.progressBarContainer}>
					<Text style={styles.progressBarTime}>{formatDuration(status.currentTime.toString())}</Text>
					<View style={styles.progressBar}>
						<Text style={[styles.progressBarFill, { width: `${progressBarrWidth}%` }]}>{progressBarrWidth}</Text>
					</View>
					<Text style={styles.progressBarTime}>{formatDuration(status.duration.toString())}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 130,
		borderWidth: 1,
		borderColor: '#FABF47',
		borderRadius: 10,
		justifyContent: 'center',
		backgroundColor: '#000',
		padding: 10,
		zIndex: 1,
		position: 'relative',
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
		width: 100,
		height: 30,
	},
	title: {
		color: '#FABF47',
		fontSize: 10,
		fontWeight: 'bold',
		width: '100%',
		textAlign: 'center',
		marginBottom: 5,
	},
	titleContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bottomContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	progressBarContainer: {
		flexDirection: 'row',
		width: '80%',
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
	modalContainer: {
		width: '106%',
		height: 90,
		position: 'absolute',
		top: -90,
		left: -10,
		borderWidth: 1,
		borderColor: '#FABF47',
		borderRadius: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalTitle: {
		color: '#FABF47',
		fontSize: 16,
		fontWeight: 'bold',
	},
	modalContent: {
		height: '100%',
		width: '100%',
		backgroundColor: '#000',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
