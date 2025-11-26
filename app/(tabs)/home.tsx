import BgWrapper from '@/components/BgWrapper';
import SvgComponent from '@/components/SvgSentry';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
	return (
		<BgWrapper>
			<View style={styles.center}>
				<Text style={styles.heroHeading}>Tasty Treats for </Text>
				<Text style={styles.heroHeading}>Web Developers</Text>
			</View>
			<View style={styles.heroHostedByContainer}>
				<View style={styles.heroHostedBy}>
					<Text style={{ color: '#fff' }}>With</Text>
					<View style={styles.heroImageContainer}>
						<Image
							source={{ uri: 'https://github.com/wesbos.png' }}
							style={{ width: 30, height: 30, borderRadius: 50 }}
							alt='A rather handsome Wes Bos'
							resizeMode='contain'
						/>
						<Text style={styles.heroHostedByText}>Wes Bos</Text>
					</View>
					<Text style={{ color: '#fff' }}>×</Text>
					<View style={styles.heroImageContainer}>
						<Image
							source={{ uri: 'https://github.com/stolinski.png' }}
							style={{ width: 30, height: 30, borderRadius: 50 }}
							alt='Scott looking absolutely fresh'
							resizeMode='contain'
						/>
						<Text style={styles.heroHostedByText}>Scott Tolinski</Text>
					</View>
					<Text style={{ color: '#fff' }}>×</Text>
					<View style={styles.heroImageContainer}>
						<Image
							source={{ uri: 'https://github.com/w3cj.png' }}
							style={{ width: 30, height: 30, borderRadius: 50 }}
							alt='A very dapper CJ'
							resizeMode='contain'
						/>
						<Text style={styles.heroHostedByText}>CJ Reynolds</Text>
					</View>
				</View>
				<View style={[styles.center, styles.heroFooter]}>
					<Text style={{ color: '#fff' }}>Brought to You by</Text>
					<SvgComponent />
				</View>
			</View>
			<View style={[styles.buttonPodcastProviderSection, styles.center]}>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgb(247, 163, 54)' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/rss.png')} />
					<Text style={styles.buttonPodcastProviderText}>RSS</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgb(4, 160, 59)' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/spotify.png')} />
					<Text style={styles.buttonPodcastProviderText}>Spotify</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgb(142, 52, 201) ' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/itunes.jpg')} />
					<Text style={styles.buttonPodcastProviderText}>Apple Podcast</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: ' rgb(255, 255, 255)' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/youtube.png')} />
					<Text style={styles.buttonPodcastProviderText}>YouTube</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgb(255, 138, 10) ' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/overcast.jpg')} />
					<Text style={styles.buttonPodcastProviderText}>Overcast</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgb(242, 43, 36) ' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/pocketcasts.jpg')} />
					<Text style={styles.buttonPodcastProviderText}>PocketCasts</Text>
				</View>
				<View style={[styles.buttonPodcastProviderWrapper, { backgroundColor: 'rgba(37, 209, 218, 1) ' }]}>
					<Image style={styles.buttonPodcastProviderImage} resizeMode='contain' source={require('../../assets/icons/amznMusic.png')} />
					<Text style={styles.buttonPodcastProviderText}>Amazon Music</Text>
				</View>
			</View>
			<View style={[styles.treatSection, styles.center]}>
				<Text style={styles.treatHeading}>Served Fresh Twice Weekly</Text>
				<View style={styles.treatContainer}>
					<View style={[styles.treatWrapper, styles.center]}>
						<TouchableOpacity onPress={() => {}}>
							<View style={[styles.treatInfo, styles.center]}>
								<Text style={styles.treatLength}>15m</Text>
								<Text style={styles.treatDay}>Monday</Text>
							</View>
							<View>
								<Text style={styles.treat}>Hasty Treat</Text>
							</View>
							<Text style={{ color: '#fff', fontSize: 11, textAlign: 'center', marginBottom: 10 }}>Quick n&apos; Informative</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.treatWrapper, styles.center]}>
						<TouchableOpacity onPress={() => {}}>
							<View style={[styles.treatInfo, styles.center]}>
								<Text style={styles.treatLength}>60m</Text>
								<Text style={styles.treatDay}>Wednesday</Text>
							</View>
							<Text style={styles.treat}>Tasty Treat</Text>
							<Text style={{ color: '#fff', fontSize: 11, textAlign: 'center', marginBottom: 10 }}>Deep Dives</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{/* </View> */}
		</BgWrapper>
	);
}

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	heroHeading: {
		letterSpacing: -1,
		lineHeight: 60,
		fontSize: 40,
		color: '#fff',
		fontWeight: 'bold',
	},
	heroHostedByContainer: {
		gap: 16,
	},
	heroHostedBy: {
		flexDirection: 'row',
		width: '100%',
		flexWrap: 'wrap',
		paddingHorizontal: 20,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
		marginBottom: 20,
	},
	heroHostedByText: {
		color: '#fff',
		borderBottomWidth: 1,
		borderColor: '#FABF47',
		lineHeight: 15,
	},
	heroImageContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 2,
	},
	heroFooter: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 20,
	},
	buttonPodcastProviderSection: {
		flexDirection: 'row',
		width: '100%',
		flexWrap: 'wrap',
		gap: 10,
		marginBottom: 10,
	},
	buttonPodcastProviderWrapper: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 5,
		gap: 2,
	},
	buttonPodcastProviderImage: {
		height: 16,
		width: 16,
	},
	buttonPodcastProviderText: {
		color: '#000',
		fontSize: 10,
		fontWeight: 'bold',
	},
	treatSection: {
		backgroundColor: 'tarnsparent',
		borderWidth: 3,
		borderColor: '#ffffff1a',
		padding: 32,
		borderRadius: 5,
		gap: 32,
	},
	treatHeading: {
		color: '#fff',
		fontSize: 12,
		width: '100%',
		textAlign: 'center',
		textTransform: 'uppercase',
		fontWeight: 'bold',
		letterSpacing: 3,
	},
	treatContainer: {
		flexDirection: 'row',
		gap: 20,
		marginTop: 10,
	},
	treatWrapper: {
		minWidth: 130,
	},
	treatInfo: {
		flexDirection: 'row',
		gap: 8,
	},
	treatLength: {
		color: '#000',
		fontSize: 11,
		backgroundColor: '#fff',
		padding: 4,
		fontWeight: '500',
		zIndex: 2,
		marginBottom: -4,
	},
	treatDay: {
		color: '#fff',
		fontSize: 11,
		padding: 4,
		letterSpacing: -0.5,
		marginBottom: -4,
		backgroundColor: 'rgb(54, 45, 89)',
		transform: [{ rotate: '2deg' }],
		fontWeight: '500',
		textTransform: 'uppercase',
		zIndex: 2,
	},
	treat: {
		color: '#000',
		fontWeight: '900',
		textTransform: 'uppercase',
		padding: 6,
		marginBottom: 10,
		fontSize: 16,
		backgroundColor: '#FABF47',
		zIndex: 1,
	},
});
