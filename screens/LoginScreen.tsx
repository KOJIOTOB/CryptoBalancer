import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Animated, Easing } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { Routes } from '../routes';
import * as Animatable from 'react-native-animatable'

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [username, setUsername] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoggedIn) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease)
            }).start()

        }
    }, [isLoggedIn, animation, navigation])

    const handleLogin = async () => {
        if (username.trim().length === 0) {
            Alert.alert("Please enter your name");
            return;
        }

        try {
            await AsyncStorage.setItem('username', username);
            setIsLoggedIn(true)

            setTimeout(() => {
                navigation.replace(Routes.Home);
            }, 4000)

        } catch (error) {

            Alert.alert("Error", "An error occurred while saving your name");
        }
    };

    return (
        <View style={styles.container}>
            {!isLoggedIn ? (
                <>
                    <Animatable.View animation="fadeInUp" duration={1500}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder="Your Name" />
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" duration={1500} delay={500}>
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </>
            ) : (
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        { opacity: animation }
                    ]}
                >
                    <Animatable.Text animation="bounceIn" iterationCount="infinite" style={styles.welcomeText}>
                        Hello {username}
                    </Animatable.Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    input: {
        borderWidth: 0,
        borderRadius: 5,
        borderColor: 'gray',
        width: '80%',
        padding: 10,
        margin: 10,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Unbounded-Bold',
        fontWeight: '300'
    },
    button: {
        backgroundColor: '#00d7f3',
        padding: 15,
        borderRadius: 5,
        width: '40%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'Unbounded-Bold'
    },
    animatedContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 33,
        color: '#00d7f3',
        textAlign: 'center',
        fontFamily: 'Unbounded-Bold',
        fontWeight: '500',
        lineHeight: 40,
    },

});

export default LoginScreen
