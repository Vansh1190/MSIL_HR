//import liraries
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from 'moment';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import AuthContext from '../../context/AuthContext';
import Toast from 'react-native-simple-toast';
import * as ApiService from '../../Utils/Utils';

import {useFocusEffect} from '@react-navigation/native';

import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import {LoadingScreen} from '../../components/reusable/LoadingScreen';
import RNMockLocationDetector from 'react-native-mock-location-detector';
import JailMonkey from 'react-native-pvt-jail-monkey';

var mytime = 10000;

const MarkAttendence = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [MarkAttandance, setMarkAttandance] = useState(0);
  const [loader, setLoader] = useState(false);
  const [MapLisenceKey, setMapLisenceKey] = useState('');
  const [horizental, setHorizental] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const {authContext, AppUserData} = useContext(AuthContext);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationStatus, setLocationStatus] = useState(true);

  // To Hide or show based on getGpsAvailable
  const [ShowAttandanceTabs, setShowAttandanceTabs] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = checkGpsAvailable();
      return () => unsubscribe;
    }, []),
  );

  const showTimer = () => {
    let EmplID = AppUserData?.data?.userId
    let apiData =
    {
      "SystemName":"HR-ASSIST",
      "ReportName":"LOCN_REFR_TIME",
      "LOVName":"LOCN_REFR_TIME",
      "LOVCode":"",
      "UserName":EmplID
      };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetLOVM', apiData, token, authContext)
      .then(result => {
// $&
         let tm = result.Value[0].LOVM_VALUE_CODE * 1000;

        // // console.log($1);
         mytime = tm;
// $&
// $&
        // settimeLocation(tm);

        setLoader(false);
     
      })
      .catch(error => {        
        setLoader(false);
       
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }


  const checkGpsAvailable = () => {
    setShowAttandanceTabs(true);
    setMarkAttandance(0);
    // getUserCurrentLocation();
    getLocationLisenceKey();
  };




  useEffect(() => {
    showTimer();
    const interval = setInterval(() => {
      getMobDeviceIOS(true);
    },mytime);
    
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        askIOSPermission();
        // getOneTimeLocation();
        // subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            setLocationStatus(true);
            // subscribeLocationLocation();
          } else {
            setLocationStatus(false);
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
    getMobDeviceIOS(true);

    return () => {
      clearInterval(interval);
    }

  }, []);

  const askIOSPermission = async () => {
    await Geolocation.requestAuthorization('whenInUse');
  };
  // const getUserCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(position => {
  //     // console.log($1);
  //     const { latitude, longitude } = position.coords;
  //     setLocation({
  //       latitude,
  //       longitude,
  //     });
  //   },
  //     error => console.log('Error', JSON.stringify(error)),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  //   );
  // }

  const getMobDeviceIOS = async () => {
    if (Platform.OS == 'android') {
      const isLocationMocked =
        await RNMockLocationDetector.checkMockLocationProvider();
      if (isLocationMocked) {
        Alert.alert('Error', 'Location is mocked please retry', [
          {
            text: 'Okay',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          // { text: "OK", onPress: () => {
          //   Linking.openURL(vesionNo[0]);
          // } }
        ]);
        return;
      }else{
        getCurrentPosition()
      }
    } else {
      askIOSPermission()
// $&
      Geolocation.getCurrentPosition(position => {
        // setLoader(true);
// $&
         const { latitude, longitude } = position.coords;
         let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + parseFloat(latitude) + ',' + parseFloat(longitude) + '&key=' + 'AIzaSyDqQgcT34Ix_8YMXQ-RA5f2U2d2muT7vIE'
// $&
         ApiService.getRawurl(url)
           .then(result => {
// $&
// $&
             // setLoader(false);
             let userlocation = result.results[0].formatted_address;
             setUserLocation(userlocation)
             let date = moment(new Date()).format('DD-MMM-YYYY');
  
             if(!reset){              
               CallAPIToStoreAddress(userlocation, date, latitude, longitude);
             }else{
              // setLoader(false);
             }
           })
           .catch(error => {
             //setLoader(false);
             // Alert.alert(
             //   "Error",
             //   "Unable to get location name retry",
             //   [
             //     {
             //       text: "Okay",
             //       onPress: () => console.log("Cancel Pressed"),
             //       style: "cancel"
             //     },
                 // { text: "OK", onPress: () => {
                 //   Linking.openURL(vesionNo[0]);
                 // } }
             //   ]
             // );
  
             // // console.log($1);
             // ApiService.showErrorMessage(error, authContext);
           });
  
  
       },
         error => {
// $&
           setLoader(false);
          //  Alert.alert(
          //    "Error",
          //    "Unable to detect current location please reset location & retry",
          //    [
          //      {
          //        text: "Okay",
          //        onPress: () => console.log("Cancel Pressed"),
          //        style: "cancel"
          //      },
          //    ]
          //  );
         },
         { enableHighAccuracy: false, timeout: 4000, maximumAge: 1000 },
       );
  
    }


     };

  const getMobDevice = async () => {
    if (Platform.OS == 'android') {
      const isLocationMocked =
        await RNMockLocationDetector.checkMockLocationProvider();
      if (isLocationMocked) {
        Alert.alert('Error', 'Location is mocked please retry', [
          {
            text: 'Okay',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          // { text: "OK", onPress: () => {
          //   Linking.openURL(vesionNo[0]);
          // } }
        ]);
        return;
      }else{
        getCurrentPosition()
      }
    } else {
      askIOSPermission()
// $&
      getCurrentPosition()
    }
    // let apiData = { "UserName": AppUserData?.data?.username };
    // setLoader(true);

    /*
      if (Platform.OS == 'android') {
        // AppUserData?.data?.userId 222852
        let token = AppUserData.token;
        ApiService.PostMethode('/GetMobDevice', apiData, token, authContext)
          .then(result => {
// $&
            // setLoader(false);
            if (result.Value.length > 0) {
              // DEVC_ID: "1"
              // DEVC_NAME: "ONEPLUS A3003, Redmi Note 4"
              let model = result.Value[0].DEVC_NAME;
              let modelfrmplug = Platform.Model;
  
              if (model.includes(modelfrmplug)) {
// $&
                let notSupported = true;
                Toast.show('Session expired login again');
              } else {
                // Toast.show('Worked');
              }
            }
          })
          .catch(error => {
            setLoader(false);
            // // console.log($1);
            ApiService.showErrorMessage(error, authContext);
          });
      }
      */

    // // console.log($1);
    // return;


  };

  const getCurrentPosition = ()=>{
    Geolocation.getCurrentPosition(
      position => {
        setLoader(true);
// $&
        const {latitude, longitude} = position.coords;
// $&
        let url =
          'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
          parseFloat(latitude)+
          ',' +
          parseFloat(longitude)+
          '&key='+
          MapLisenceKey;
// $&
        ApiService.getRawurl(url)
          .then(result => {
// $&
            setLoader(false);
            let userlocation = result.results[0].formatted_address;
            setUserLocation(userlocation);
            let date = moment(new Date()).format('DD-MMM-YYYY');
            console.log(
              'CallAPIToStoreAddress payload==>',
              userlocation,
              latitude,
              longitude,
            );
            if(userlocation,latitude,longitude,date) {
              CallAPIToStoreAddress(userlocation, date, latitude, longitude);
            } else {
              setLoader(false);
            }
          })
          .catch(error => {
// $&
            // CallAPIToStoreAddress();
            setLoader(false);
            Alert.alert('Error', 'Unable to get location name retry', [
              {
                text: 'Okay',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              // { text: "OK", onPress: () => {
              //   Linking.openURL(vesionNo[0]);
              // } }
            ]);

            // // console.log($1);
            // ApiService.showErrorMessage(error, authContext);
          });
      },
      error => {
// $&
        setLoader(false);
        Alert.alert(
          'Error',
          'Unable to detect current location please reset location & retry',
          [
            {
              text: 'Okay',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
        );
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 15000},
    )
  }

  const CallAPIToStoreAddress = (
    location = '',
    date = '',
    lat = '',
    lon = '',
  ) => {
    let token = AppUserData.token;
    let EmplID = AppUserData?.data?.userId;
    let apiData = {
      // EmplID: EmplID
      StaffNo: EmplID,
      Longitude: lon,
      Latitude: lat,
      Location: location,
      PunchDate: date,
    };

// $&
    setLoader(true);
    ApiService.PostMethode('/SubmitPunchRO', apiData, token, authContext)
      .then(result => {
        setLoader(false);
// $&
        Alert.alert('Success', result.Result);
        // let responseData = result.Value[0].SHIS_YYMM_CODE
        // console.log('GetMonth', responseData)
        // setMonth(responseData)
      })
      .catch(error => {
        setLoader(false);
// $&
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const getLocationLisenceKey = () => {
    let token = AppUserData.token;
    let EmplID = AppUserData.data;
    let apiData = {
      EmplID: EmplID,
    };
    setLoader(true);
    ApiService.PostMethode('/GetMapsLicenseKey', {}, token)
      .then(result => {
        setLoader(false);
// $&
        if (result.Result) {
          setMapLisenceKey(result.Result);
        }
      })
      .catch(error => {
        setLoader(false);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  if (loader) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <View>
          <TouchableOpacity style={styles.content}>
            <Text>
              Live Location
              <Icon name="map-marker-radius" size={25} color={'green'} />
            </Text>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                getMobDevice();
              }}>
              <Text>Punch</Text>
            </TouchableOpacity>
            <Text style={{textAlign: 'center'}}>{userLocation}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => getMobDeviceIOS(true)}
            style={styles.resetLocation}>
            <Text style={styles.resetLocationTxt}>Reset Location</Text>
            <Ionicons name="ios-locate-outline" size={30} color={'green'} />
          </TouchableOpacity> */}

          {!locationStatus ? (
            <Text style={{textAlign: 'center', marginTop: 5}}>
              Location Permission Denied
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: GlobalColor.PrimaryLight,
  },

  tabTextStyle: {
    fontSize: GlobalFontSize.P,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },

  activeTabTextStyle: {
    color: GlobalColor.Secondary,
  },
  content: {
    top: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    marginVertical: 10,
  },
  circle: {
    height: 100,
    width: 100,
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginVertical: 30,
  },
  renderitem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  resetLocation: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#4a4a4a',
    alignItems: 'center',
    padding: 10,
  },
  resetLocationTxt: {
    color: '#fff',
    marginRight: 5,
    fontWeight: '700',
  },
});

//make this component available to the app
export default MarkAttendence;
