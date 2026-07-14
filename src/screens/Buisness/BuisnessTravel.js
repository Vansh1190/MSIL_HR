//import liraries
import React, {Component,useContext,useEffect,useState,useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Image,SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from '../../components/reusable/Header';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import Home from '../Home';
import Gst from './GST';
import ShuttleBooking from './ShuttleBooking';
import AuthContext from '../../context/AuthContext';

import * as ApiService from '../../Utils/Utils';
import { useFocusEffect } from '@react-navigation/native'


// create a component
const BuisnessTravel = ({navigation}) => {

  const { authContext, AppUserData } = useContext(AuthContext);
   let usrAccess = AppUserData?.data?.userFlag;

   const [loader, setLoader] = useState(false)
   const [refresh, setrefresh] = useState(false);
 
   const [taxiFlag, settaxiFlag] = useState('Y');


   useFocusEffect(
    useCallback(() => {
      console.log("Runs every time screen is focused");
      showTaxiRental();
    }, [AppUserData?.token, AppUserData?.data?.userId])
  );
  
  
  
//Stop Loader Function
const stopLoader = () => {
  setLoader(false);
  setrefresh(false);
}
  const showTaxiRental = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;
// $&
    let apiData = {
      "UserName": userNt
    }
 
    //Set Loader
    setLoader(true);
 
    ApiService.PostMethode('/GetTaxiCutoff', apiData, token, authContext)
      .then(result => {
// $&
 
        //stop Loader
        stopLoader();
 
        let responseData = result.Result;
        settaxiFlag(responseData);
       
        console.log("---responseData---",responseData);

        // if(result.Result == 'N')
        // {
        //   myNavigation.navigate("PendingAlw");
         
        // }
        // else{
        //   myNavigation.navigate("ConsentHome");
        // }
 
       
        //setHideshow(result.Result);
// $&
       
          // alert(responseData)
       
      })
      .catch(error => {
        //stop Loader
        stopLoader();
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };


  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
    <Header title={"Business Travel"}/>
    <View style={styles.container}>
      {/*
      
        #499fd0      
      <LinearGradient
        style={{padding: 20}}
        colors={['#437cd5', '#5dc0e9']}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 40,
              alignItems: 'center',
            }}>
            <Ionicons
              name="chevron-back-outline"
              size={25}
              color={'white'}
              onPress={() => navigation.navigate("Home")}
            />
            <Ionicons
              name="menu-outline"
              size={25}
              color={'white'}
              onPress={() => navigation.openDrawer()}
            />
          </View>

          <Text
            style={{
              color: '#fff',
              
              letterSpacing: 1,
              marginLeft: 30,
            }}>
            Buisness Travel
          </Text>
        </View>
      </LinearGradient> */}

      {/* BODY */}
      <TouchableOpacity style={styles.box}
      onPress={() =>{navigation.navigate("Gst")}}>
        <View style={styles.iconBox}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: '#43C6DB',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/Images/gstIcon.png')}
              style={{width: 25, height: 25}}
            />
          </View>
        </View>
        <View style={styles.item}>
          <Text style={{fontSize:14}} Bold>
            MSIL GST Details
          </Text>
          <Ionicons name="chevron-forward-outline" size={18} color={'#43C6DB'}/>
        </View>
      </TouchableOpacity>

      {usrAccess == 'Y'?null:

      <TouchableOpacity style={styles.box}
      onPress={() => {navigation.navigate("ShuttleBooking")}}>
        <View style={styles.iconBox}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: '#43C6DB',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/Images/bookingIcon.png')}
              style={{width: 25, height: 25}}
            />
          </View>
        </View>
        <View style={styles.item}>
          <Text style={{fontSize: 14}} Bold>
            Shuttle Booking
          </Text>
          <Ionicons name="chevron-forward-outline" size={18} color={'#43C6DB'}/>
        </View>
      </TouchableOpacity>
      

}

{usrAccess !== 'Y' && taxiFlag === 'Y' && (
  <TouchableOpacity
    style={styles.box}
    onPress={() => {
      navigation.navigate("BusinessTravelMain");
    }}>
    
    <View style={styles.iconBox}>
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: '#43C6DB',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/Images/gstIcon.png')}
          style={{ width: 25, height: 25 }}
        />
      </View>
    </View>

    <View style={styles.item}>
      <Text style={{ fontSize: 14 }} Bold>
        Taxi Booking
      </Text>
      <Ionicons name="chevron-forward-outline" color={'#43C6DB'} size={18} />
    </View>

  </TouchableOpacity>
)}

    </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
    paddingHorizontal:10
  },
  box: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: GlobalColor.White,
    shadowColor: '#000',
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    borderRadius:5
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
export default BuisnessTravel;
