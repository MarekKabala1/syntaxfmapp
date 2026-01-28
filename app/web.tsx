import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Web() {
	const params = useLocalSearchParams<{ url?: string; title?: string }>();
	const url = typeof params.url === 'string' ? params.url : undefined;
	const title = typeof params.title === 'string' ? params.title : 'Link';

	if (!url) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Missing URL</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title} numberOfLines={1}>
					{title}
				</Text>
				<View style={styles.rightSpacer} />
			</View>
			<WebView source={{ uri: url }} style={styles.webview} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(241, 243, 244,0.2)',
	},
	backButton: {
		padding: 6,
	},
	title: {
		flex: 1,
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
		paddingHorizontal: 10,
	},
	rightSpacer: {
		width: 34,
	},
	webview: {
		flex: 1,
	},
	errorText: {
		color: '#FF6B6B',
		textAlign: 'center',
		paddingTop: 24,
		fontSize: 16,
	},
});
