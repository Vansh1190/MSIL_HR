import React, {useEffect, useReducer, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MyDrawer from './Drawer';
import AuthNavigator from './AuthNavigator';
import AuthContext from '../context/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import SignIn from '../Auth/SignIn';
import { navigationRef } from './RootNavigation';
import * as ApiService from './../Utils/Utils';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';


const Routes = () => {
  const [AppUserData, setAppUserData] = React.useState({});
  const initialLoginState = {
    isLoading: true,
    isSignOut: false,
    userToken: null,
    userData: null,
  };

  let options = {AppUserData, setAppUserData};

  const LoginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        // return;
        return {
          ...prevState,
          isSignOut: false,
          userToken: action.payload.token,
          isLoading: false,
          userData: action.payload.user,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isSignOut: false,
          userToken: action.payload.token,
          isLoading: false,
          userData: action.payload.user,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isSignOut: true,
          userToken: null,
          isLoading: false,
          userData: null,
        };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = useReducer(LoginReducer, initialLoginState);
  const authContext = useMemo(
    () => ({
      signIn: async data => {
        // // console.log($1);
        let userToken = data.payload.token;
        let contextData;
        let userData = data.payload.user;
        // return;
        if (userToken && userData !== null) {
          try {
            await EncryptedStorage.setItem('userToken', userToken);
            await EncryptedStorage.setItem('userData', JSON.stringify(userData));
            contextData = {token: userToken, data: userData};
            setAppUserData({
              token: userToken,
              data: userData,
            });
            if ((userToken, userData)) {
              dispatch({type: 'LOGIN', payload: contextData});
            } else {
              dispatch({type: 'LOGIN', payload: contextData});
            }
          } catch (error) {
// $&
          }
        } else {
          contextData = {token: userToken, data: userData};
          dispatch({type: 'LOGIN', payload: contextData}),
            setAppUserData({
              token: userToken,
              data: userData,
            });
        }
      },
      signOut: async () => {
        try {
          await EncryptedStorage.removeItem('userToken').then(
            setAppUserData({}),
            dispatch({type: 'LOGOUT'}),
            // console.log('Login state', loginState),
          );
        } catch (error) {
// $&
        }
      },
    }),
    [],
  );

  useEffect(() => {
    fetchUserData();
  }, []);


  const fetchUserData = async () => {
    let userToken = null;
    let userData = null;
    let dataFound;
    try {
      userToken = await EncryptedStorage.getItem('userToken');
      userData = await EncryptedStorage.getItem('userData');
      userData = JSON.parse(userData);
      // // console.log($1);
      // // console.log($1);
    } catch (error) {
// $&
    }
    if (userToken && userData !== null) {
      setAppUserData({
        token: userToken,
        data: userData,
        signUpFlow: false,
      });
      dataFound = {
        token: userToken,
        user: userData,
      };
      dispatch({type: 'RETRIEVE_TOKEN', payload: dataFound});
      // // console.log($1);
    } else {
      dataFound = {
        token: userToken,
        user: userData,
      };
      // // console.log($1);
      dispatch({type: 'RETRIEVE_TOKEN', payload: dataFound});
    }
  };


  const SendAnalytics = (PageName)=>{
// $&
    if(!AppUserData?.data?.userId){
      return;
    } 

    let apiData = {    
        "StaffNo" : AppUserData?.data?.userId,
        "DeviceName" : DeviceInfo.getBrand(),
        "DeviceID" : DeviceInfo.getDeviceId(),
        "DeviceType" : Platform.OS,
        "PageName" : PageName        
    }


    ApiService.PostMethode('/SubmitAnly', apiData, AppUserData.token, authContext)
    .then(result => {
// $&
    })
    .catch(error => {
      // stopLoader(false);
// $&
      // ApiService.showErrorMessage(error, authContext);
    });
  }



  

  if (loginState.isLoading == true) {
    // // console.log($1);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={'#80406A'} />
        <Text
          style={{
            fontSize: 16,
            color: '#000',
            marginVertical: 10,
          }}>
          Loading...
        </Text>
      </View>
    );
  } else {
    return (
      <AuthContext.Provider value={{...options, authContext}}>
        <NavigationContainer  ref={navigationRef} onStateChange={()=> 
          {
            // // console.log($1);
            // // console.log($1);
  

            if(navigationRef.getCurrentRoute() != undefined)
            {
            if(navigationRef.getCurrentRoute().name == 'Home')
            {
// $&
              SendAnalytics("Home Page");
            }
            else if(navigationRef.getCurrentRoute().name == 'Employee Directory')
            {
// $&
              SendAnalytics("Employee Lookup");
            }
            else if(navigationRef.getCurrentRoute().name == 'Attendance')
            {
// $&
              SendAnalytics("Attendance");
            }
            else if(navigationRef.getCurrentRoute().name == 'Leave')
            {
// $&
              SendAnalytics("Leave");
            }
            else if(navigationRef.getCurrentRoute().name == 'Shift')
            {
// $&
              SendAnalytics("Shift");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Holiday Calendar')
            {
// $&
              SendAnalytics("Holiday Calendar");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Holiday Calendar')
            {
// $&
              SendAnalytics("Holiday Calendar");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Emergency Contacts')
            {
// $&
              SendAnalytics("Hospital & Quick Dials");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'HomeGate')
            {
// $&
              SendAnalytics("Gatepass Home Page");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Gatepass')
            {
// $&
              SendAnalytics("General Gatepass");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Create Request')
            {
// $&
              SendAnalytics("Employee Gatepass(Rohtak)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Create Gatepass')
            {
// $&
              SendAnalytics("Visitor Gatepass(Rohtak)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Canteen')
            {
// $&
              SendAnalytics("Canteen");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'OtherApps')
            {
// $&
              SendAnalytics("Other Mobile App");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'BuisnessTravel')
            {
// $&
              SendAnalytics("Business Travel");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'CompensationBenifits')
            {
// $&
              SendAnalytics("Compensation and Benifits");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Payroll')
            {
// $&
              SendAnalytics("Payroll");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'SalarySlip')
            {
// $&
              SendAnalytics("Salary Slip");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'TaxComputationSlip')
            {
// $&
              SendAnalytics("Tax Computation Slip");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'PFBalance')
            {
// $&
              SendAnalytics("PF Balance");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'TaxSavings')
            {
// $&
              SendAnalytics("Tax Savings");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Benefits')
            {
// $&
              SendAnalytics("Benefits");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Plencashment')
            {
// $&
              SendAnalytics("PL Encashment");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'ConveyanceBillsSubmission')
            {
// $&
              SendAnalytics("Conveyance Bills Submission");
            }
  
            else if(navigationRef.getCurrentRoute().name== 'Leave.')
            {
// $&
              SendAnalytics("Approve Leave(Manager Mode)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'FlexiShift')
            {
// $&
              SendAnalytics("FlexiShift (Manager Mode)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Taxi')
            {
// $&
              SendAnalytics("Approve Taxi (Manager Mode)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'Attendance.')
            {
// $&
              SendAnalytics("Attendance (Manager Mode)");
            }
  
            else if(navigationRef.getCurrentRoute().name == 'GatePass(Rohtak)')
            {
// $&
              SendAnalytics("Gatepass Rohtak (Manager Mode)");
            }
            else if(navigationRef.getCurrentRoute().name == 'whatsnew')
            {
// $&
              SendAnalytics("whatsNew");
            }

           else if(navigationRef.getCurrentRoute().name == 'BookRoom')
          {
// $&
            SendAnalytics("Book Room");
          }
 
          else if(navigationRef.getCurrentRoute().name == 'ViewRoom')
          {
// $&
            SendAnalytics("View Room");
          }
          else if(navigationRef.getCurrentRoute().name == 'ManageBooking')
          {
// $&
            SendAnalytics("Manage Booking");
          }
          else if(navigationRef.getCurrentRoute().name == 'BookRoomModify')
          {
// $&
            SendAnalytics("Edit Booking");
          }

          else if(navigationRef.getCurrentRoute().name == 'HospitalizationSystem')
          {
// $&
            SendAnalytics("Hospitalization System");
          }

          else if(navigationRef.getCurrentRoute().name == 'HospitalApproval')
          {
// $&
            SendAnalytics("Hospital Approval (Manager Mode)");
          }

          else if(navigationRef.getCurrentRoute().name == 'Intimation')
          {
// $&
            SendAnalytics("Hospitalization Intimation");
          }

          else if(navigationRef.getCurrentRoute().name == 'Advance')
          {
// $&
            SendAnalytics("Hospitalization Advance");
          }

          }

          else {
            {loginState.userToken == null ? <AuthNavigator /> : <MyDrawer />}
          }
          
            //SendAnalytics(navigationRef.getCurrentRoute())
          }
            
          }>
          {loginState.userToken == null ? <AuthNavigator /> : <MyDrawer />}
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
};

export default Routes;
