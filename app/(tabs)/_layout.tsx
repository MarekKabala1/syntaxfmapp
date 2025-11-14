import { Tabs } from 'expo-router';
import { ImageBackground, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imageBg = require('../../assets/images/whitegrit.png');

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerBackground: () => <ImageBackground style={{ backgroundColor: '#000', minWidth: 600, height: 100 }} source={imageBg} resizeMode='cover' />,
				sceneStyle: { backgroundColor: 'transparent' },
				tabBarActiveTintColor: '#FABF47',
				tabBarInactiveTintColor: '#888',
				tabBarStyle: { backgroundColor: '#000' },
			}}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Home',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='show'
				options={{
					title: 'Shows',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					sceneStyle: { backgroundImage: imageBg, backgroundColor: 'transparent' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'radio' : 'radio-outline'} size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='video'
				options={{
					title: 'Video',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					sceneStyle: { backgroundColor: 'transparent' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='newsletter'
				options={{
					title: 'Newsletter',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'mail' : 'mail-outline'} size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='potluck'
				options={{
					title: 'Potluck Qs',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='swag'
				options={{
					title: 'Swag',
					headerTitleAlign: 'center',
					headerTitleStyle: { color: '#FABF47' },
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'shirt' : 'shirt-outline'} size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
