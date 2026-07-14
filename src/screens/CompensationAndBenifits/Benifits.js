import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, SafeAreaView,Alert} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../components/reusable/Text';
import { GlobalColor } from '../../constants/Colors';
import { showErrorMessage } from '../../Utils/Utils';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';



// create a component
const Benifits = () => {
  const [loader, setLoader] = useState(false)
  const [refresh, setrefresh] = useState(false);
  const { authContext, AppUserData } = useContext(AuthContext);

  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const GetConvElig = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId 
// $&
    let apiData = {
      "UserName": AppUserData?.data?.username
    }

    //Set Loader
    setLoader(true);

    ApiService.PostMethode('/GetConvElig', apiData, token, authContext)
      .then(result => {
// $&

        //stop Loader
        stopLoader();

        let responseData = result.Result
// $&
        if (responseData == 0) {
          Alert.alert("Payroll", "You are not Authorized");
        }
        else {
          //  myNavigation.navigate("ConveyanceBillsSubmission")
           myNavigation.navigate("ConveyanceBillsSubmission", {
            Conveyancepayload: responseData,
          }) 
          // alert(responseData)
        }
      })
      .catch(error => {
        //stop Loader
        stopLoader();
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };


  
  const GetDiwaliGift = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId
// $&
    let apiData = {
      "UserName": AppUserData?.data?.username
    }
 
    //Set Loader
    setLoader(true);
 
    ApiService.PostMethode('/CheckDiwaliScreenOpen', apiData, token, authContext)
      .then(result => {
// $&
 
        //stop Loader
        stopLoader();
 
       
 
        if (result.Value == '0') {
          Alert.alert("Gift & Rewards", "Last date has been passed for updation, Kindly contact to HR");
        }
        else {
          //  myNavigation.navigate("ConveyanceBillsSubmission")
          myNavigation.navigate("DiwaliGift");
          // alert(responseData)
        }
     
     
           
         
          // alert(responseData)
     
      })
      .catch(error => {
        //stop Loader
        stopLoader();
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };
 
 const GoSundayAlwnce = () => {
   
    myNavigation.navigate("SundayAllowance");
     
   
  };


  const UnApprovedScreen = () => {
    let token = AppUserData.token
    let EmplID =  AppUserData?.data?.userId
// $&
    let apiData = {
      "UserName": AppUserData?.data?.username
    }
 
    //Set Loader
    setLoader(true);
 
    ApiService.PostMethode('/ShowExtWorkButton', apiData, token, authContext)
      .then(result => {
// $&
 
        //stop Loader
        stopLoader();
 
        let responseData = result.Result
        if(result.Result == 'N')
        {
          myNavigation.navigate("PendingAlw");
         
        }
        else{
          myNavigation.navigate("ConsentHome");
        }
 
       
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
 

  const myNavigation = useNavigation();
  const data = [
    { id: '1', text: 'PL Encashment' , icon:require('../../assets/Images/bill.png')},
    // { id: '2', text: 'LTA Encashment' },
    { id: '2', text: 'Conveyance Bills',icon:require('../../assets/Images/bill.png' )},
    { id: '3', text: 'Gift & Rewards',icon:require('../../assets/Images/gift.png' )},
    { id: '4', text: 'Extra Working Consent',icon:require('../../assets/Images/subsidy.png') },
  ];

  const dataMA = [
    { id: '1', text: 'PL Encashment' ,icon:require('../../assets/Images/bill.png')},
    { id: '2', text: 'Gift & Rewards',icon:require('../../assets/Images/gift.png') },
    { id: '3', text: 'Extra Working Consent',icon:require('../../assets/Images/subsidy.png') },
    // { id: '2', text: 'LTA Encashment' },
   
  ];

  //Stop Loader Function
  const stopLoader = () => {
    setLoader(false);
    setrefresh(false);
  }

  //Loader Component
  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingScreen />
      </SafeAreaView>
    )
  }


  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={usrAccess == 'Y'?dataMA:data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.box}
            onPress={() => {
              if (item.text === 'Conveyance Bills') {
                
                GetConvElig()
              }
              else if(item.text === 'Gift & Rewards')
              {
                GetDiwaliGift();
              }
              else if(item.text === 'Extra Working Consent')
              {
                UnApprovedScreen();
              }
              else {
                myNavigation.navigate("Plencashment", {
                  pageName: item.text == "PL Encashment" ? "PL Encashment" : (item.text == 'LTA Encashment' ? "LTA Encashment" : null)
                })
              }
            }}>
            <View style={styles.iconBox}>
              <View
                style={styles.iconBoxContainer}>
                <Image
                  source={item.icon}
                  style={{ width: 22, height: 22 }} />

                  
              </View>
            </View>
            <View style={styles.item}>
              <Text style={{fontSize:13}} Bold>{item.text}</Text>
              <Feather name="corner-up-right" size={18} color={'#43C6DB'}/>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
    paddingHorizontal: 10,
  },
  box: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: -0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    borderRadius: 5
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
  iconBoxContainer: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#43C6DB',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

//make this component available to the app
export default Benifits;
