import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client';
import { isRunningInExpoGo } from 'expo';
import { Stack } from 'expo-router';
import { Image, ImageBackground } from 'react-native';

const navigationIntegration = Sentry.reactNavigationIntegration({
	enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
	dsn: 'https://3c936a9d2d47e3f9ccfbcb804ce68f93@o4508151262347264.ingest.de.sentry.io/4510463735693392',

	// Adds more context data to events (IP address, cookies, user, etc.)
	// For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
	sendDefaultPii: true,
	tracesSampleRate: 1.0,
	integrations: [navigationIntegration],
	enableNativeFramesTracking: !isRunningInExpoGo(),

	// Enable Logs
	enableLogs: true,

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});

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
				headerBackground: () => <ImageBackground style={{ backgroundColor: '#000', minWidth: 600, height: '100%' }} source={imageBg} resizeMode='cover' />,
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

export default Sentry.wrap(function RootLayout() {
	return (
		<PersistQueryClientProvider persistOptions={{ persister: asyncStoragePersister }} client={queryClient}>
			<StackLayout />
		</PersistQueryClientProvider>
	);
});
