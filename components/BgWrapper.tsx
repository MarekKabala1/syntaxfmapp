import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imageBg = require('../assets/images/whitegrit.png');

export default function BgWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ImageBackground source={imageBg} style={styles.image} resizeMode='cover'>
			{Platform.OS === 'ios' ? <View style={styles.bg}>{[children]}</View> : <SafeAreaView style={styles.bg}>{[children]}</SafeAreaView>}
		</ImageBackground>
	);
}
const styles = StyleSheet.create({
	image: {
		flex: 1,
		backgroundColor: '#000',
		paddingInline: 20,
	},
	bg: {
		flex: 1,
		width: '100%',
		paddingInline: 16,
		alignItems: 'center',
	},
});
