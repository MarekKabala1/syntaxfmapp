import BgWrapper from '@/components/BgWrapper';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function newsletter() {
	return (
		<BgWrapper>
			<View style={styles.heroContainer}>
				<View style={styles.headerContainer}>
					<View style={styles.line} />
					<Text style={styles.headerText}>Syntax Snack Pack</Text>
					<View style={styles.line} />
				</View>
				<View>
					<Image
						source={require('../../assets/images/snackpack-submark-mask.webp')}
						style={{ width: 200, height: 200, position: 'relative' }}
						resizeMode='contain'
					/>
					<Image
						source={require('../../assets/images/snackpack-submark-nuggets.webp')}
						style={{ width: 200, height: 200, position: 'absolute' }}
						resizeMode='contain'
					/>
				</View>
				<Text style={styles.text}>Join our newsletter for 15% off all Syntax & Sentry swag</Text>
				<View style={styles.formContainer}>
					<TextInput style={styles.input} />
					<Pressable style={styles.button} onPress={() => {}}>
						<Text style={styles.buttonText}>Subscribe</Text>
					</Pressable>
				</View>
				<Text style={styles.text}>Hot takes, tips & tricks, new content, swag drops & more</Text>
				<Text style={styles.text}>Dip at any time.</Text>
				<View style={styles.headerContainer}>
					<View style={styles.line} />
					<Text style={styles.headerText}>Past Issues</Text>
					<View style={styles.line} />
				</View>
				<Text style={styles.text}>Wanna see how good our snackpack is?</Text>
				<Text style={styles.text}>Looking for something mentioned in the past?</Text>
			</View>
		</BgWrapper>
	);
}

const styles = StyleSheet.create({
	heroContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		gap: 20,
	},
	text: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		fontWeight: 600,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold',
		marginHorizontal: 10,
	},
	line: {
		flex: 1,
		height: 2,
		backgroundColor: '#fff',
	},
	formContainer: {
		flexDirection: 'row',
		gap: 10,
		width: '100%',
	},
	input: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 5,
	},
	buttonText: {
		color: '#000',
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#FABF47',
		padding: 10,
		borderRadius: 5,
		textAlign: 'center',
	},
});
