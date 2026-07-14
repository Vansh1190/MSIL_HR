//import liraries
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GlobalFontSize } from '../../constants/FontSize';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import { Header } from '../../components/reusable/Header';
import CreateRequestRhtk from './CreateRequestRhtk';
import ViewRequestRhtk from './ViewRequestRhtk';
import { LoadingScreen } from './../../components/reusable/LoadingScreen';


const Tab = createMaterialTopTabNavigator();
const EmpGatepassRohtak = ({ navigation, route }) => {

  const [loader, setLoader] = useState(true);

  // if (loader) {
  //   return (
  //     <LoadingScreen />
  //   )
  // }

  return (
    
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
      <Header title="Employee Gatepass(Rohtak)"/>
      
      <LinearGradient  colors={['#43C6DB', '#43C6DB', '#43C6DB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.mystyl}   > 
      <View style={{flex: 1, flexDirection: 'row'}}>
      <Tab.Navigator
        swipeEnabled={false}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { paddingHorizontal:10, width:'auto' },
          tabBarLabelStyle: { fontSize: GlobalFontSize.TabTitle, fontWeight:'700'},
          tabBarActiveTintColor: '#fff',
          tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: '#fff' },
          tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
        }}>
        <Tab.Screen name="Create Request" component={CreateRequestRhtk}  />
        <Tab.Screen name="View Request" component={ViewRequestRhtk}  />
      
      </Tab.Navigator>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  gradient: {
    padding: 20,
    elevation: 0
  },
  container: {
    flexDirection: 'row',
  },
  searchSection: {
    top: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 7,
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
    backgroundColor: '#fff',
    color: '#424242',
  },
  mystyl: {
    backgroundColor: 'transparent',
    height:'100%',
    flexDirection: 'row',
  },
});

// //make this component available to the app
export default EmpGatepassRohtak;