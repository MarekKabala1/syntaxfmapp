import { router } from 'expo-router';
import { useEffect } from 'react';
import { ImageBackground, Text, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imageBg = require('../assets/images/whitegrit.png');

const logoImage = <Image style={{ width: 250, height: 60 }} source={require('../assets/images/SyntaxLogoWide.png')} resizeMode='cover' />;

function navigateToHomePage() {
	setTimeout(() => {
		router.replace('/(tabs)/home');
	}, 3000);
}

export default function Home() {
	useEffect(() => {
		navigateToHomePage();
	}, []);
	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
			}}>
			<ImageBackground style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} source={imageBg} resizeMode='cover'>
				<Text style={{ color: '#FABF47', fontSize: 20, fontWeight: 'bold' }}>Welcome TO </Text>
				<View>{logoImage}</View>
			</ImageBackground>
		</SafeAreaView>
	);
}
