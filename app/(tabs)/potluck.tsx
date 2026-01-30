import BgWrapper from '@/components/BgWrapper';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PotluckQuestions() {
	return (
		<BgWrapper>
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Ask a Potluck Question</Text>
					<Text style={styles.description}>
						Once a month we do <Text style={styles.bold}>Potluck</Text> episodes. That&apos;s a stupid name for a show where we answer your questions.
					</Text>
					<Text style={styles.description}>
						Have a question about web development? It can literally be about anything! Submit it in the form below and we will try and answer it on a future
						show! Feel free to ask anonymously if you prefer us not to mention your name.
					</Text>
				</View>

				<View style={styles.formPlaceholder}>
					<Text style={styles.formText}>Form will be integrated here</Text>
					<Text style={styles.formSubtext}>Google Form or custom form implementation</Text>
				</View>
			</ScrollView>
		</BgWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		marginBottom: 32,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		color: '#CCCCCC',
		lineHeight: 24,
		marginBottom: 16,
	},
	bold: {
		fontWeight: 'bold',
		color: '#FABF47',
	},
	formPlaceholder: {
		backgroundColor: '#2A2A2A',
		borderRadius: 12,
		padding: 40,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#3A3A3A',
	},
	formText: {
		fontSize: 18,
		color: '#FFFFFF',
		marginBottom: 8,
	},
	formSubtext: {
		fontSize: 14,
		color: '#999999',
	},
});
