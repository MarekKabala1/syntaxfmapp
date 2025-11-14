import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imageBg = require('../assets/images/whitegrit.png');

export default function BgWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ImageBackground source={imageBg} style={styles.image} resizeMode='cover'>
			<SafeAreaView style={styles.bg}>{children}</SafeAreaView>
		</ImageBackground>
	);
}
const styles = StyleSheet.create({
	image: {
		flex: 1,
		backgroundColor: '#000',
	},
	bg: {
		flex: 1,
	},
});
