import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { Routes } from '../routes';

type SplashScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SplashScreen'>;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = "CryptoBalancer";
    const typingDelay = 150;

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.substring(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex === fullText.length) {
                clearInterval(interval);

                setTimeout(() => {
                    navigation.replace(Routes.LoginScreen);
                }, 2000);
            }
        }, typingDelay);

        return () => clearInterval(interval);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.textOne}>{displayedText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00d7f3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textOne: {
        fontSize: 36,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Unbounded-Bold'
    },
});

export default SplashScreen;