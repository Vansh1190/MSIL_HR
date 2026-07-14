//import liraries
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FutureBook from './FutureBook';
import PastBook from './PastBook';
import Guidelines from './Guidelines';
import Book from './Book';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import { Header } from '../../components/reusable/Header';
import Text from '../../components/reusable/Text';
import LinearGradient from 'react-native-linear-gradient';

const ShuttleBooking = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator();
  const [horizental, setHorizental] = useState(false);
  const [route, setroute] = useState("book");

  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => {
      setHorizental(false);
      setroute(route.name);
// $&
    },
  });


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Shuttle Booking"} />

      {/* {
        route != "Guidelines" ? (
          <TouchableOpacity
            style={styles.addtnlBtn}
            onPress={() => {
              horizental == true ? setHorizental(false) : setHorizental(true);
            }}>
            <Ionicons
              name="ellipsis-vertical-circle"
              size={30}
              color={'#fff'}
            />
          </TouchableOpacity>
        ) : null
      }

      {horizental == true && route != "Guidelines" ? (
        <View
          style={{            
            
            paddingVertical: 5,
            paddingHorizontal:10,
            backgroundColor: GlobalColor.White,
            position: 'absolute',
            //  bottom:30,
            right: 45,
            top: 30,   
            zIndex:100       
            
          }}>
                                
              <View style={{ }}>
                <TouchableOpacity
                  style={{ borderBottomWidth: 0, paddingBottom: 5, }} onPress={() => {
                   
                    navigation.navigate('Guidelines')
                  }}>
                  <Text Bold >Guidelines</Text>
                </TouchableOpacity>                
              </View>
            
        
        </View>
      ) : null} */}
      <View style={styles.container}>
        <LinearGradient colors={['#43C6DB','#43C6DB','#43C6DB']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mystyl}>
          <View style={{flex:1,flexDirection:'row'}}>
        <Tab.Navigator
          swipeEnabled={false}
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: { paddingHorizontal:15, width:'auto' },
            tabBarLabelStyle: { fontSize: GlobalFontSize.TabTitle, fontWeight: '700' },
            tabBarActiveTintColor: GlobalColor.White,
            tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: GlobalColor.White },
            tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
          }}>
          <Tab.Screen name="Book" component={Book} />
          <Tab.Screen name="Past Bookings" component={PastBook} />
          <Tab.Screen name="Future Bookings" component={FutureBook} />
          <Tab.Screen name="Guidelines" component={Guidelines} />
        </Tab.Navigator>
        </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.White,
  },
  addtnlBtn: {
    position: 'absolute',
    right: 10,
    top: 15,
    zIndex: 55555555
  },
  fullWidthButton: {
    backgroundColor: GlobalColor.Primary,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullWidthButtonText: {
    color: GlobalColor.White,
    marginLeft: 8
  },
  mystyl:{
       backgroundColor:'transparent',
       height:'100%',
       flexDirection:'row',
  }
});

//make this component available to the app
export default ShuttleBooking;
