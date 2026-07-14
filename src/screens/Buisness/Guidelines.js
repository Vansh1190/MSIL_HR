//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from '../../components/reusable/Header';
// create a component
const Guidelines = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,marginBottom:"30%"}}>
                <Image style={{ height:450, width: '90%', alignSelf: 'center',resizeMode:'contain' }} source={require('../../assets/Images/guidelineimage.png')} />
            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    box: {
        flexDirection: 'row',
        marginVertical: 20,
        width: '90%',
        paddingVertical: 10,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 15,
    },
    iconBox: {
        width: '20%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
});

//make this component available to the app
export default Guidelines;
