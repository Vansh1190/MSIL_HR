//import liraries
import React, { Component, useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  FlatList,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast'
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import { Header } from '../../components/reusable/Header';
import { GlobalFontSize } from '../../constants/FontSize';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import TextInput from '../../components/reusable/TextInput';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import ManagerFlexiShift from './managermode/ManagerFlexiShift';
import ManagerLeave from './managermode/ManagerLeave';
import ManagerTaxi from './managermode/ManagerTaxi';
import ManagerAttandance from './managermode/ManagerAttandance';
import ManagerRHTKGatePass from './managermode/ManagerRHTKGatePass'


const Tab = createMaterialTopTabNavigator();


const ManagerMode = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: GlobalColor.PrimaryLight }}>
      <Header title="Manager Mode" />
      <LinearGradient colors={['#43C6DB','#43C6DB','#43C6DB',]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mystyl}>
        <View style={{flex:1,flexDirection:'row'}}>
      <Tab.Navigator
        swipeEnabled={false}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { paddingHorizontal:15, width:'auto' },
          tabBarLabelStyle: { fontSize: 13, fontWeight:'600'},
          tabBarActiveTintColor: GlobalColor.White,
          tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: GlobalColor.White },
          tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
        }}>
        <Tab.Screen name="Leave." component={ManagerLeave} />
        <Tab.Screen name="FlexiShift" component={ManagerFlexiShift} />
        <Tab.Screen name="Taxi" component={ManagerTaxi} />
        
        <Tab.Screen name="Attendance." component={ManagerAttandance} />
        <Tab.Screen name="GatePass(Rohtak)" component={ManagerRHTKGatePass} />
        
      </Tab.Navigator>
      </View>
      </LinearGradient>
      <TouchableOpacity style={styles.fullWidthButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={require("./../../assets/Images/group.png")} style={{ width: 25, height: 25, tintColor: GlobalColor.White }} />
        <Text style={styles.fullWidthButtonText} >
          Back to Employee Mode
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};








// define your styles
const styles = StyleSheet.create({

  Loadercontainer: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
    paddingHorizontal: 10,
  },

  gradient: {
    padding: 20,
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  tabStyle: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: GlobalColor.Secondary
  },
  tabTextStyle: {
    fontSize: GlobalFontSize.P,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: GlobalColor.Secondary,
  },
  activeTabTextStyle: {
    color: GlobalColor.Secondary,
  },
  reportHeader: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 5,
    paddingVertical: 15,
    backgroundColor: GlobalColor.White,
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    borderRadius: 5,
  },
  reportStyle: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 12,
    backgroundColor: GlobalColor.White,
    borderBottomWidth: 0.5,
    borderBottomColor: GlobalColor.Secondary,
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,

  },

  activeTabTextStyle: {
    color: GlobalColor.Secondary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  searchIcon: {
    padding: 10,
  },
  input: {
    width: '77%',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: GlobalColor.White,
    color: '#424242',
  },
  FlatListData: {
    width: "100%",    
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 10,
    backgroundColor: GlobalColor.White,
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    borderRadius: 3,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    padding: 10,
    paddingVertical: 15,
    backgroundColor: GlobalColor.White
  },
  spinnerTextStyle: {
    color: GlobalColor.White
  },
  fullWidthButton: {
    backgroundColor: '#43C6DB',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullWidthButtonText: {
    color: GlobalColor.White,
    marginLeft: 8,
    fontSize:13
  },
  SearchInput: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: GlobalColor.Secondary,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 7,
    backgroundColor: GlobalColor.White
  },
  mystyl: {
        backgroundColor: 'transparent',
        height:'83%',
        flexDirection: 'row',
      },

});

export default ManagerMode;
