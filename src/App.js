import React, {useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Linking,
  PermissionsAndroid,
  Alert,
  BackHandler,
  Platform
} from 'react-native';
import Routes from './navigations/Routes';
// import RNPermissions, {
//   NotificationsResponse,
//   Permission,
//   PERMISSIONS,
//   PermissionStatus,
//   RESULTS
// } from 'react-native-permissions';
import RNBootSplash from "react-native-bootsplash";
import { LogBox } from 'react-native';
import JailMonkey from 'react-native-pvt-jail-monkey'
import RNExitApp from 'react-native-exit-app';
import ScreenGuard, { useSGScreenShot } from 'react-native-screenguard';


LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

export default function App() {

  // Screenshot detection hook
  useSGScreenShot((event) => {
    Alert.alert(
      'Screenshot Restricted',
      'Screenshots are not allowed in this application for security reasons.',
      [{ text: 'OK' }],
      { cancelable: false }
    );
  });

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks

      // 🟩 Initialize and enable screenshot prevention
      // IMPORTANT: Only works on REAL iOS devices, NOT on simulators
      if (Platform.OS === 'ios') {
        try {
          // Initialize ScreenGuard first
          await ScreenGuard.initSettings({
            backgroundColor: 'black',
          });

          // Register with black color overlay for screenshots
          await ScreenGuard.register({
            backgroundColor: '#000000'
          });
        } catch (error) {
          console.error('ScreenGuard error:', error);
        }
      }
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
// $&
    });

    // Cleanup on unmount
    return () => {
      if (Platform.OS === 'ios') {
        ScreenGuard.unregister();
      }
    };
  }, []);


  const StatusBarHeight = StatusBar.currentHeight;
  /*
  const askAndroidPermissions= async()=> {
    // console.log(Platform)
    if (Platform.OS != 'android'){
      return;
    }

      let Permissins = [
        // PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        // PERMISSIONS.ANDROID.CAMERA,       
        // PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        // PERMISSIONS.ANDROID.READ_CONTACTS,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      ];

                  RNPermissions.requestMultiple(Permissins).then((statuses) => {
                    for (var index in Permissins) {
                      if (statuses[Permissins[index]] === RESULTS.GRANTED) {
                      } else {
                        Alert.alert(
                          'Permission Request',
                          'Please allow all the permissions to get a better experience',
                          [
                            {
                              text: 'Okay',
                              onPress: () => {
                                // Linking.openSettings();
                                askAndroidPermissions();
                              },
                            },
                            {
                              text: 'Cancel',
                              style: 'cancel',
                              onPress: () => {
                                // Linking.openSettings();
                                BackHandler.exitApp();                                
                              },
                            },
                          ],
                          { cancelable: false },
                        );
                        break;
                      }
                    }                  
          })
            .then(() => RNPermissions.checkNotifications())
            .then((notifications) => console.log("notifications",notifications ))
            .catch((error) => console.warn(error));
    }
    */
    // useEffect(() => {
    //   const permission = askAndroidPermissions();
    //   return () => {
    //   permission
    //   };
    // }, []);

    useEffect(() => {
      const Safety = checkDeviceSafety();
      return () => {
      Safety
      };
    }, []);



    const checkDeviceSafety = () =>{
      let params = {debug:false,checkEmulator:true}
      //custom method with all security checking 
      JailMonkey.isSafe(params).then(()=>{
// $&
        if(JailMonkey.isJailBroken()){
          RNExitApp.exitApp();
          return;
        }
        // is not rooted/jailbreak/emulator/simulator
        if(JailMonkey.isJailBroken()){
          BackHandler.exitApp();
        }
      },()=>{
        if(Platform.OS === "ios"){
          // RNExitApp.exitApp();
          return;
        }
        // console.log("is rooted/jailbreak/emulator/simulator")
        // is rooted/jailbreak/emulator/simulator)
          BackHandler.exitApp();
        })
    }



  
  return (
    <>
        <SafeAreaView style={styles.container}>
        <StatusBar
          StatusBarStyle={'light-content'}
          animated={true}
          backgroundColor="#61dafb"/>
          <Routes />
        </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});