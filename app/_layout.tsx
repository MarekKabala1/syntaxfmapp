import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client';

import { Stack } from 'expo-router';
import { Image, ImageBackground } from 'react-native';

const logoImage = <Image style={{ width: 300, height: 70 }} source={require('../assets/images/SyntaxLogoWide.png')} resizeMode='contain' />;
const imageBg = require('../assets/images/whitegrit.png');

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 60 * 24,
		},
	},
});

const asyncStoragePersister = createAsyncStoragePersister({ storage: AsyncStorage });
persistQueryClient({
	queryClient,
	persister: asyncStoragePersister,
	maxAge: 1000 * 60 * 60 * 24,
	dehydrateOptions: {
		shouldDehydrateQuery: (query) => {
			return query.queryKey[0] !== 'lastPlayedEpisode';
		},
	},
});

function StackLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerTitle: () => logoImage,
				headerTitleAlign: 'center',
				headerTitleStyle: { color: '#000' },
				headerBackground: () => <ImageBackground style={{ backgroundColor: '#000', minWidth: 600, minHeight: '100%' }} source={imageBg} resizeMode='cover' />,
			}}>
			<Stack.Screen
				name='index'
				options={{
					headerTitle: () => logoImage,
					headerShown: false,
				}}
			/>
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<PersistQueryClientProvider persistOptions={{ persister: asyncStoragePersister }} client={queryClient}>
			<StackLayout />
		</PersistQueryClientProvider>
	);
}
