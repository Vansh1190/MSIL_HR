//import liraries
import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import myconfig from '../Utils/myconfig';
import { GlobalColor } from '../constants/Colors';
import { GlobalFontSize } from '../constants/FontSize';
import Text from './reusable/Text';
import AuthContext from './../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import * as ApiService from '../Utils/Utils';
 
const myCustomeSharing = async () => {
  const shareOption = {
    message: "You may download latest version of HR Assist mobile app from following link:https://msilappstore.in/HrAssist/",
  };
  try {
    const shareResponse = await Share.open(shareOption);
  } catch (error) {
    // Handle error
  }
};
 
// create a component
const TouchableCardM = ({ navigation }) => {
  const { authContext, AppUserData } = useContext(AuthContext);
  let usrAccess = AppUserData?.data?.userFlag;
  const [taxiFlag, settaxiFlag] = useState('Y');
  const [loader, setLoader] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [shiftData, setShiftData] = useState('');
  const [taxiMenu, settaxiMenu] = useState('ManagerTaxi');
 
  const Data = [
 
    { id: '1', name: 'ManagerLeave', label: 'Leave Approval', images: require('../assets/Images/home/attd.png') },
 
    { id: '2', name: 'ExtraHoursApproval', label: 'Extra Hours Approval', images: require('../assets/Images/home/attd.png') },
    
 
    { id: '3', name: taxiMenu, label: 'Taxi Approval', images: require('../assets/Images/home/taxi.png') },
 
    { id: '4', name: 'ManagerAttandance', label: 'Attendance', images: require('../assets/Images/home/attd.png') },
 
    { id: '5', name: 'ManagerRHTKGatePass', label: 'Rohtak Gatepass Approval', images: require('../assets/Images/home/gate.png') },

    { id: '6', name: 'HospitalApproval', label: 'Hospital Approval', images: require('../assets/Images/home/hspappr.png') },
 
  ];
 
  const Data1 = [
 
    { id: '1', name: 'ManagerLeave', label: 'Leave Approval', images: require('../assets/Images/home/attd.png') },
 
 
 
    { id: '2', name: taxiMenu, label: 'Taxi Approval', images: require('../assets/Images/home/taxi.png') },
 
    { id: '3', name: 'ManagerAttandance', label: 'Attendance', images: require('../assets/Images/home/attd.png') },
 
    { id: '4', name: 'ManagerRHTKGatePass', label: 'Rohtak Gatepass Approval', images: require('../assets/Images/home/gate.png') },
    
    { id: '5', name: 'ExtraHoursApproval', label: 'Extra Hours Approval', images: require('../assets/Images/home/attd.png') },

    { id: '6', name: 'HospitalApproval', label: 'Hospital Approval', images: require('../assets/Images/home/hspappr.png') },
 
  ];
 
 
 
  const GetEmplShift = async () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
 
    let fromdate = moment(fromDate).format('DD-MMM-YYYY');
    let todate = moment(toDate).format('DD-MMM-YYYY');
 
    let apiData = {
      "FromDate": fromdate,
      "ToDate": todate,
      "EmplID": userId
    };
 
    try {
      setLoader(true);
      const result = await ApiService.PostMethode('/GetEmplShift', apiData, token, authContext);
      let shift = result?.Value?.[0]?.SHIFT || '';
      setShiftData(shift);
      setLoader(false);
      return shift;
    } catch (error) {
      setLoader(false);
      ApiService.showErrorMessage(error, authContext);
      return '';
    }
  };
 
  const showTaxiRental = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId
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
        setLoader(false);
 
        let responseData = result.Result;
        settaxiFlag(responseData);
 
        responseData == 'N'?settaxiMenu('ManagerTaxiOld'):settaxiMenu('ManagerTaxi');
       
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
        setLoader(false);
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };
 
  const initialLoading = async () => {
    await GetEmplShift();
    showTaxiRental(); // ✅ call here
  };
  
 
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
 
      const loadData = async () => {
        if (isActive) {
          await initialLoading();
        }
      };
 
      loadData();
 
      return () => {
        isActive = false;
      };
    }, [])
  );
 
  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      {loader ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
          <FlatList
            data={shiftData === 'ZZ' ? Data1 : Data}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.name)}>
                <LinearGradient
                  colors={[GlobalColor.White, GlobalColor.White]}
                  style={{ padding: 5, borderRadius: 5 }}
                >
                  <Image source={item.images} style={styles.cardimg} resizeMode="contain" />
                </LinearGradient>
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};
 
// define your styles
const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: myconfig.deviceWidth * 0.42,
    height: myconfig.deviceHeight * 0.10,
    margin: 8,
    borderWidth: 0.2,
    borderColor: GlobalColor.Secondary,
    backgroundColor: GlobalColor.White,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 8,
  },
  cardimg: {
    width: 35,
    height: 35,
    marginBottom: 4,
  },
  cardText: {
    textAlign: 'center',
    fontSize: 11,
    color: GlobalColor.Primary,
  },
});
 
export default TouchableCardM;