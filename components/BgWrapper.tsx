import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';

const imageBg = require('../assets/images/whitegrit.png');
const { width, height } = Dimensions.get('window');

export default function BgWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ImageBackground source={imageBg} style={styles.image} resizeMode='cover'>
			{/* {Platform.OS === 'ios' ? <View style={styles.bg}>{[children]}</View> : <SafeAreaView style={styles.bg}>{[children]}</SafeAreaView>} */}
			<View style={styles.bg}>{[children]}</View>
		</ImageBackground>
	);
}
const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: width,
		height: height,
		backgroundColor: '#000',
		// paddingInline: 20,
	},
	bg: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingInline: 0,
	},
});
