
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import CryptoManager from './CryptoManager';
import * as Animatable from 'react-native-animatable';

interface CryptoOption {
    id: number;
    name: string;
    price: number;
    symbol: string;
    logo: string;
};

const Home: FC = () => {
    const [username, setUsername] = useState<string>('');

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const welcomeText = "Welcome to CryptoBalancer";
    const [animatedText, setAnimatedText] = useState("");
    const [cryptoManagerData, setCryptoManagerData] = useState<CryptoOption[] | null>(null);

    useEffect(() => {

        const typeWriter = (text: string, index: number) => {
            if (index < text.length) {
                setAnimatedText(text.substring(0, index + 1));
                setTimeout(() => typeWriter(text, index + 1), 100);
            }
        };

        const timer = setTimeout(() => typeWriter(welcomeText, 0));

        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername !== null) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.error("Failed to load the username");
            }
        };

        loadUsername();
        return () => clearTimeout(timer);
    }, []);

    const handleOpenModal = async () => {
        const savedData = await AsyncStorage.getItem('cryptoManagerData');
        if (savedData) {
            setCryptoManagerData(JSON.parse(savedData));
        }
        setModalVisible(true);
    };

    const handleCloseModal = async (dataToSave: CryptoOption[]) => {
        try {
            await AsyncStorage.setItem('cryptoManagerData', JSON.stringify(dataToSave));
            setCryptoManagerData(dataToSave);
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving cryptoManagerData:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerTitle}>
                <Animatable.View animation="fadeIn" duration={2000}>
                    <Text style={styles.welcomeText}>Hello {username}</Text>
                    <Text style={styles.welcomeText2}>{animatedText}</Text>
                </Animatable.View>
            </View>
            <View style={styles.buttonContainer}>
                <Animatable.View animation="pulse" iterationCount="infinite">
                    <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
            {modalVisible && (
                <View style={styles.modalContainer}>
                    <Animatable.View animation="fadeInUp" duration={1800} style={styles.modal}>
                        <Modal
                            visible={modalVisible}
                            onRequestClose={handleCloseModal}
                            animationType='none'
                            transparent={false}
                        >
                            <CryptoManager modalVisible={modalVisible} onClose={(dataToSave) => handleCloseModal(dataToSave)} />
                            <TouchableOpacity style={styles.closeButton} onPress={() => handleCloseModal(dataToSave)}>
                                <Text style={styles.buttonTextClose}>Close</Text>
                            </TouchableOpacity>
                        </Modal>
                    </Animatable.View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 70,
        backgroundColor: '#fff'

    },
    headerTitle: {
        width: "90%",
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    welcomeText: {
        fontSize: 25,
        color: '#00d7f3',
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 10,
        fontFamily: 'Prompt-Bold'
    },
    welcomeText2: {
        fontSize: 18,
        fontWeight: '400',
        color: '#333',
    },
    openButton: {
        backgroundColor: '#00d7f3',
        padding: 5,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        alignItems: 'center',
        shadowColor: '#FF6347',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 3,
        width: '100%',
        alignSelf: 'center',
        position: 'relative',
        color: 'white'
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%'
    },
    button: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 40,
        color: 'gray',
    },
    buttonTextClose: {
        fontSize: 25,
        color: 'white',
        fontWeight: '600'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },

});

export default Home;