//import liraries
import React, {Component,useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Image,FlatList,SafeAreaView } from 'react-native';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import myconfig from '../Utils/myconfig'


import { GlobalColor } from '../constants/Colors';
import { GlobalFontSize } from '../constants/FontSize';
import Text from './reusable/Text';
import AuthContext from './../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';





const myCustomeSharing =async () =>{
  const shareOption = {
    message:"You may download latest version of HR Assist mobile app from following link:https://msilappstore.in/HrAssist/",
  }
  try {const shareResponse = await Share.open(shareOption)}
    catch(error){
// $&
  }
}

// create a component
const TouchableCard = ({navigation}) => {
  const { authContext, AppUserData } = useContext(AuthContext);
let usrAccess = AppUserData?.data?.userFlag;
const insets = useSafeAreaInsets(); // dynamically fetch bottom safe area

// // console.log($1);
  const Data = [
    {
      id: '1',
      name: 'Employee  Lookup',
      images: require('../assets/Images/home/icons8.png'),
    },
    {
      id: '2',
      name: 'Attendance &  Admin',
      images: require('../assets/Images/home/calendar.png'),
    },
    {
      id: '3',
      name: 'Comp. & Benefits',
      images: require('../assets/Images/home/chart.png'),
    },
    {
      id: '4',
      name: 'Hospital & Quick Dials',
      images: require('../assets/Images/home/transplantation.png'),
    },
    
  
    {
      
      id:  usrAccess == 'Y'?'':'5',
      name: usrAccess == 'Y'?'':'Gatepass & Room Booking',
      images: usrAccess == 'Y'?'': require('../assets/Images/home/visitor-gatepass.png'),
    },
    {
      id: '6',
      name: 'Canteen  Menu',
      images: require('../assets/Images/home/canteen.png'),
    },
    {
      id: '7',
      name: 'Other Mobile \n Apps',
      images: require('../assets/Images/home/otherapps.png'),
    },
    {
      id: '8',
      name: 'Business  Travel',
      images: require('../assets/Images/home/btravel.png'),
    },
   
    {
      id: '9',
      name: 'Add-On Menu',
      images: require('../assets/Images/home/otherapps.png'),
    },
  ];


    return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>

        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={Data}
          style={{marginTop:10}}
          contentContainerStyle={{
            paddingBottom: 80,  // 👈 reduce from 200 to a more reasonable number
            paddingTop: 10,
          }}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress = {() =>{
              if(item.name==='Employee  Lookup') {
                navigation.navigate('EmployeeNavs');
              }
              else if(item.name==='Attendance &  Admin') {
                navigation.navigate('AttendanceAdminNav');
              }
             else if(item.name==='Comp. & Benefits') {
                navigation.navigate('CompensationBenifitsNav');
                // // console.log($1);
              }
              else if(item.name==='Hospital & Quick Dials') {
                navigation.navigate('HospitalNavs');
              }
              else if(item.name==='Canteen  Menu') {
                navigation.navigate('CanteeNavigator');
              }
              else if(item.name==='Gatepass & Room Booking') {
                navigation.navigate("GatePassNavigator");
               }
             else if(item.name==='Other Mobile \n Apps') {
                navigation.navigate('OtherApps');
              }
              else if(item.name==='Business  Travel') {
                navigation.navigate('BusinessNavigator');
              }
              else if(item.name==='Add-On Menu') {
            
                navigation.navigate('OtherMobilityNavigator');
                
                }
            }}>
            <LinearGradient
              // colors={[GlobalColor.PrimaryGradient, GlobalColor.SecondryGradient]}
              colors={[GlobalColor.White, GlobalColor.White]}
              style={{padding:5,borderRadius:5}}>
              <Image source={item.images} style={styles.cardimg} resizeMode="contain" />
            </LinearGradient>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
           
            )}/>
            </SafeAreaView>            
    )
          }
// define your styles
const styles = StyleSheet.create({
  card: {
    width: myconfig.deviceWidth * 0.28,
    height : myconfig.deviceHeight * 0.11,
    paddingHorizontal:myconfig.deviceHeight * 0.01,
    //padding:5,
    paddingVertical:myconfig.deviceWidth * 0.03,
    borderWidth:0.2,
    borderColor: GlobalColor.Secondary,
    backgroundColor: GlobalColor.White,
    // borderBottomLeftRadius: 7,
    // borderBottomRightRadius: 7,
    // marginTop: 5,
    marginBottom:myconfig.deviceHeight * 0.01,
    //marginTop:7,
    marginLeft:"1.7%",
    marginRight:5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    position: 'relative',
  },
  cardimg: {
    width: myconfig.deviceWidth * 0.09,
    height: myconfig.deviceHeight * 0.04,
    margin:5,
  },
   
  cardText: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,                  // slightly smaller than 11
    color: GlobalColor.Primary,
  },
  
});

//make this component available to the app
export default TouchableCard;
