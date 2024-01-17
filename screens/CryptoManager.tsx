import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchCryptoData } from '../api/fetchCryptoData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CryptoOption {
    id: number;
    name: string;
    price: number;
    symbol: string;
    logo: string;
};

interface Transaction {
    cryptoId: number;
    quantity: number;
    purchasePrice: number;
};

interface CryptoManagerProps {
    data: CryptoOption[];
    onClose: (dataToSave: CryptoOption[]) => void;
}

const CryptoManager: React.FC<CryptoManagerProps> = ({ data, onClose }) => {
    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
    const [selectedCryptoId, setSelectedCryptoId] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [quantity, setQuantity] = useState<string>('');
    const [purchasePrice, setPurchasePrice] = useState<string>('');
    const [averagePrice, setAveragePrice] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchCryptoData()
            .then(response => {
                const formattedData = response.data.map(crypto => ({
                    id: crypto.id,
                    name: crypto.name,
                    price: crypto.quote.USD.price,
                    symbol: crypto.symbol,
                    logo: `https://images.coinviewer.io/currencies/64x64/${crypto.id}.png`
                }));
                setCryptoOptions(formattedData);
            })
            .catch(error => {
                console.error('Error fetching crypto data:', error);
                setErrorMessage('Error fetching crypto data.');
            });
    }, []);

    const handleAddTransaction = () => {
        const quantityNumber = parseFloat(quantity);
        const priceNumber = parseFloat(purchasePrice);

        if (!isNaN(quantityNumber) && quantityNumber > 0 && !isNaN(priceNumber) && priceNumber > 0 && selectedCryptoId) {
            const newTransaction: Transaction = {
                cryptoId: selectedCryptoId,
                quantity: quantityNumber,
                purchasePrice: priceNumber
            };

            setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
            setQuantity('');
            setPurchasePrice('');
            setErrorMessage(null);
        } else {
            setErrorMessage('Invalid quantity or purchase price.');
        }
    };

    const handleCalculateResult = () => {
        let totalQuantity = 0;
        let totalCost = 0;

        transactions.forEach(transaction => {
            if (transaction.cryptoId === selectedCryptoId) {
                totalQuantity += transaction.quantity;
                totalCost += transaction.quantity * transaction.purchasePrice;
            }
        });

        if (totalQuantity > 0) {
            const avgPrice = totalCost / totalQuantity;
            setAveragePrice(avgPrice);
        } else {
            setErrorMessage('Please enter quantity and purchase price for calculation.');
            setAveragePrice(null);
        }
    };


    const handleClose = async () => {
        let dataToSave: CryptoOption[] = [];

        try {
            dataToSave = [...data, ...transactions];
            await AsyncStorage.setItem('cryptoManagerData', JSON.stringify(dataToSave));
            onClose(dataToSave, closeModal);
        } catch (error) {
            console.error("Failed to save cryptoManagerData");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Crypto Calculator</Text>
            </View>

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Cryptocurrency:</Text>
                <Picker
                    selectedValue={selectedCryptoId}
                    onValueChange={(itemValue) => setSelectedCryptoId(Number(itemValue))}
                    style={styles.picker}>
                    {cryptoOptions.map((crypto) => (
                        <Picker.Item key={crypto.id} label={crypto.name} value={crypto.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity:</Text>
                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Purchase Price (USD):</Text>
                <TextInput
                    style={styles.input}
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="Enter purchase price"
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
                <Text style={styles.buttonText}>Add Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleCalculateResult}>
                <Text style={styles.buttonText}>Calculate Average Price</Text>
            </TouchableOpacity>

            {averagePrice !== null && (
                <Text style={styles.resultText}>Average Price: ${averagePrice.toFixed(2)}</Text>
            )}

            <View style={styles.transactionHistory}>
                {transactions.map((transaction, index) => (
                    <View key={index} style={styles.transactionItem}>
                        <Text style={styles.transactionText}>
                            Transaction {index + 1}: {transaction.quantity} units at ${transaction.purchasePrice.toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50

    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a3b5d',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#1a3b5d',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.5,
        elevation: 2,
    },
    picker: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#20B16C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#20B16C',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resultText: {
        fontSize: 18,
        color: '#20B16C',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    transactionHistory: {
        marginTop: 20,
    },
    transactionItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.5,
        elevation: 2,
    },
    transactionText: {
        fontSize: 16,
        color: '#ffffff',
        backgroundColor: 'rgba(54, 54, 54, 0.85)',
        padding: 20

    },
});

export default CryptoManager;

