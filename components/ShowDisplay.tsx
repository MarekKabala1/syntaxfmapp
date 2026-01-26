import { Image, StyleSheet, Text, View } from 'react-native';

export interface ShowDisplayProps {
	imageUrl?: string;
	title?: string;
}

export default function ShowDisplay({ imageUrl, title }: ShowDisplayProps) {
	return (
		<>
			<View style={styles.headerContainer}>
				<View style={styles.logoContainer}>
					<Image source={require('../assets/images/SyntaxLogoWide.png')} style={styles.titleImage} resizeMode='contain' />
					<View style={styles.titleContainer}>
						<Text style={styles.label}>Player</Text>
					</View>
				</View>
				{imageUrl ? <Image style={styles.image} source={{ uri: imageUrl }} /> : null}
			</View>
			<Text style={styles.title}>{title || 'No episode selected'}</Text>
		</>
	);
}

const styles = StyleSheet.create({
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
	label: {
		color: '#FABF47',
		fontSize: 12,
		fontWeight: 'bold',
		width: '100%',
		textAlign: 'center',
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
});
