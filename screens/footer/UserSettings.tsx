import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


const UserSettings = () => {


    return (
        <View style={styles.container}>
            <Text>User Settings</Text>

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

export default UserSettings;