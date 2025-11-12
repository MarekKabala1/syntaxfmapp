import { Stack } from 'expo-router';
import { Image, ImageBackground } from 'react-native';

const logoImage = <Image style={{ width: 250, height: 60 }} source={require('../assets/images/SyntaxLogoWide.png')} resizeMode='cover' />;
const imageBg = require('../assets/images/whitegrit.png');

function StackLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTitleAlign: 'center',
				headerTitleStyle: { color: '#000' },
			}}>
			<Stack.Screen
				name='index'
				options={{
					headerTitle: () => logoImage,
					headerShown: false,
					// headerBackground: () => <ImageBackground style={{ backgroundColor: '#000', minWidth: 600, height: 100 }} source={imageBg} resizeMode='cover' />,
				}}
			/>
		</Stack>
	);
}

export default function RootLayout() {
	return <StackLayout />;
}
