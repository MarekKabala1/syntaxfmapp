import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen name='index' options={{ title: 'Home' }} />
			<Tabs.Screen name='shows' options={{ title: 'Shows' }} />
			<Tabs.Screen name='video' options={{ title: 'Video' }} />
			<Tabs.Screen name='newsletter' options={{ title: 'Newsletter' }} />
			<Tabs.Screen name='potluck' options={{ title: 'Potluck Qs' }} />
			<Tabs.Screen name='swag' options={{ title: 'Swag' }} />
		</Tabs>
	);
}
