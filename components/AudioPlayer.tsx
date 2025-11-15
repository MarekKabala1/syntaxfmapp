import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';

// const audioSource = { uri: 'https://feeds.megaphone.fm/FSI1483080183.mp3' };

export default function AudioPlayer(audioSource?: { uri?: string }) {
	const player = useAudioPlayer(audioSource || '');

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => player.play()}>
				<Ionicons name='play-circle-outline' size={32} color='#FABF47' />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => player.pause()}>
				<Ionicons name='pause-circle-outline' size={32} color='#FABF47' />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 100,
		borderWidth: 1,
		borderColor: '#FABF47',
		borderRadius: 10,
		justifyContent: 'center',
		backgroundColor: '#000',
		padding: 10,
		zIndex: 1,
	},
});
