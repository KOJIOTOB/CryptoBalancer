import { View, Text, StyleSheet } from 'react-native'
import React from 'react';

const GeneralSettings = () => {

    return (
        <View style={styles.container}>
            <Text>General Settings</Text>

        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 70,
        backgroundColor: '#fff'

    },



});



export default GeneralSettings;