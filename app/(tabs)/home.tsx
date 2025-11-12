import { ImageBackground, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imageBg = require('../../assets/images/whitegrit.png');

export default function Home() {
	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
			}}>
			<ImageBackground style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} source={imageBg} resizeMode='cover'>
				<Text style={{ color: '#fff' }}>Edit app/index.tsx to edit this screen.</Text>
			</ImageBackground>
		</SafeAreaView>
	);
}
