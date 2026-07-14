//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Platform, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import { ActivityIndicator } from 'react-native-paper';
import AuthContext from '../../context/AuthContext';
import Toast from 'react-native-simple-toast'
import * as ApiService from '../../Utils/Utils';
import { date } from 'yup';
import { useFocusEffect } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Button from './../../components/reusable/Button'
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import { LoadingScreen } from './../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { DataTable } from 'react-native-paper';
import MarkAttendence from './MarkAttendence';
import AttendanceReport from './AttendanceReport';
import AttendancePer from './AttendancePer';
import AccumulatedHours from './AccumulatedHours';



const Attendance = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [MarkAttandance, setMarkAttandance] = useState(50);
  const [AttendenceReport, setAttendenceReport] = useState(50);
  const [loader, setLoader] = useState(true);
  const [MapLisenceKey, setMapLisenceKey] = useState("");
  const [horizental, setHorizental] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const { authContext, AppUserData } = useContext(AuthContext);

  // To Hide or show based on getGpsAvailable
  const [ShowAttandanceTabs, setShowAttandanceTabs] = useState(false);
  const [RawPunches, setRawPunches] = useState([]);
  const [ShowZZ, setShowZZ] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = checkGpsAvailable();
      return () => unsubscribe;
    }, [])
  );
  const checkZZShift = () => {
    let userId = AppUserData?.data?.userId;
    let apiData = { "UserName": userId }; // created on   9 oct 2025 11:58 AM
 
    // let apiData = { "UserName": AppUserData?.data?.username };   // commented on 9 oct 2025 11:58 AM
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetShrtAccFlg', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        if (result.Result == "Y") {
          setShowZZ(true);
        } else {
         setShowZZ(false);
          // GetRawPunch();
        }
      })
      .catch(error => {        
        setLoader(false);
        // setShowAttandanceTabs(false);
        // setMarkAttandance(1);
        // setAttendenceReport(0);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }

  const checkGpsAvailable = () => {
    let apiData = { "UserName": AppUserData?.data?.username };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    checkZZShift();
    setLoader(true);
    ApiService.PostMethode('/GetValidGPSUser', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        if (result.Result == "Y") {
          setShowAttandanceTabs(true);
          setMarkAttandance(0);
          setAttendenceReport(0);
          // getUserCurrentLocation();
          // getLocationLisenceKey();
        } else {
          setShowAttandanceTabs(false);
          setMarkAttandance(1);
          setAttendenceReport(0);
          // GetRawPunch();
        }
      })
      .catch(error => {        
        setLoader(false);
        setShowAttandanceTabs(false);
        setMarkAttandance(1);
        setAttendenceReport(0);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }


  const getUserCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
// $&
      const { latitude, longitude } = position.coords;
      setLocation({
        latitude,
        longitude,
      });
    },
      error => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }



/*
  const GetRawPunch = () => {
    let apiData = {
      "FromDate": moment(fromDate).format('DD-MMM-YYYY'),
      "ToDate": moment(toDate).format('DD-MMM-YYYY'),
      "StaffNo": AppUserData?.data?.userId
    };
    // // console.log($1);
    // AppUserData?.data?.userId
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetRawPunch', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        if (result.Value) {
          setRawPunches(result.Value);
        }
      })
      .catch(error => {
        setLoader(false);
// $&
        if (error.response) {
          if (error.response.status == 401) {
// $&
          }
          // client received an error response (5xx, 4xx)
          Toast.show(error.response.data.title);
        } else if (error.request) {
          // client never received a response, or request never left
          Toast.show('Network Error');
          // // console.log($1);
        } else {
          // anything else
          Toast.show('Session expired login again');
        }
      });
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderitem}>
        <Text>{item['Staff No']}</Text>
        <Text>{item.Date.slice(0, 12)}</Text>
        <Text>{item.Date.slice("12", 17)}</Text>
        <Text>{item['Moble/Machine']}</Text>
      </View>
    )
  }

    const handelDate = () => {
    if (fromDate > toDate) {
      Alert.alert('from date should be less then to date');
    } else {
      GetRawPunch();
    }
  }

    const getMobDevice = () => {
    let apiData = { "UserName": AppUserData?.data?.userId };
    setLoader(true);
    if (Platform.OS == 'android') {
      // AppUserData?.data?.userId 222852
      let token = AppUserData.token;
      ApiService.PostMethode('/GetMobDevice', apiData, token, authContext)
        .then(result => {
// $&
          setLoader(false);
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
// $&
          if (error.response) {
            if (error.response.status == 401) {
// $&
            }
            // client received an error response (5xx, 4xx)
            Toast.show(error.response.data.title);
          } else if (error.request) {
            // client never received a response, or request never left
            Toast.show('Network Error');
            // // console.log($1);
          } else {
            // anything else
            Toast.show('Session expired login again');
          }
        });
    }

    if (location.latitude && location.longitude) {
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + parseFloat(location.latitude) + ',' + parseFloat(location.longitude) + '&key=' + MapLisenceKey
// $&
      ApiService.getRawurl(url)
        .then(result => {
// $&
          setLoader(false);
          let location = result.results[0].formatted_address;
          setUserLocation(location)
          let date = "13-11-1993";
          CallAPIToStoreAddress(location, date, location.latitude, location.longitude);

        })
        .catch(error => {
          setLoader(false);
// $&
          if (error.response) {
            if (error.response.status == 401) {
// $&
            }
            // client received an error response (5xx, 4xx)
            Toast.show(error.response.data.title);
          } else if (error.request) {
            // client never received a response, or request never left
            Toast.show('Network Error');
            // // console.log($1);
          } else {
            // anything else
            Toast.show('Session expired login again');
          }
        });
    } else {
      CallAPIToStoreAddress();
    }
  };


  const CallAPIToStoreAddress = (location = "", dati = "", lat = "", lon = "") => {
    let token = AppUserData.token
    let EmplID = AppUserData?.data?.userId
    let apiData = {
      // EmplID: EmplID
      StaffNo: EmplID
    }
    setLoader(true);
    ApiService.PostMethode('/SubmitPunchRO', apiData, token, authContext)
      .then(result => {
        setLoader(false);
// $&
        Alert.alert("Success", result.Result);
        // let responseData = result.Value[0].SHIS_YYMM_CODE
        // console.log('GetMonth', responseData)
        // setMonth(responseData)

      })
      .catch(error => {
        setLoader(false);
// $&
        if (error.response) {
          if (error.response.status == 401) {
// $&
          }
          Toast.show(error.response.data.title);
        } else if (error) {
          Toast.show('Network Error');
        } else {
          Toast.show('Session expired login again');
        }
      });
  }

  const getLocationLisenceKey = () => {
    let token = AppUserData.token
    let EmplID = AppUserData.data
    let apiData = {
      EmplID: EmplID
    }
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
        if (error.response) {
          if (error.response.status == 401) {
// $&
          }
          Toast.show(error.response.data.title);
        } else if (error) {
          Toast.show('Network Error');
        } else {
          Toast.show('Session expired login again');
        }
      });
  };


*/

  const handleMarkAttandance = index => {
    setMarkAttandance(index);
  };
  const handleAttendanceReport = index => {
    setAttendenceReport(index);
  };

  // const [location, setLocation] = useState('');
  if (loader) {
    return (
      <LoadingScreen />
    )
  }

  const getHeadings = () => {
    if (ShowAttandanceTabs && ShowZZ) {
      return ['Mark Attendance', 'View Report', 'Attendance %', 'Work Time Status'];
    } else if (ShowAttandanceTabs && !ShowZZ) {
      return ['Mark Attendance', 'View Report', 'Attendance %'];
    } else if (!ShowAttandanceTabs && ShowZZ) {
      return ['View Report', 'Attendance %', 'Work Time Status'];
    } else {
      return ['View Report', 'Attendance %'];
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {
          <ScrollView
          horizontal={true}>
          <SegmentedControlTab
          borderRadius={2}
          values={getHeadings()}
          // values={['Mark Attendance', 'View Report', 'Attendance %','Accumulated Hours']}
          selectedIndex={ShowAttandanceTabs? MarkAttandance:AttendenceReport}
          onTabPress={index => {
            ShowAttandanceTabs ? handleMarkAttandance(index): handleAttendanceReport(index);
          }}
          tabsContainerStyle={styles.tabsContainerStyle}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
        />
        </ScrollView>
        }
      </View>

      <View style={{ flex: 1 }}>
        {
          ShowAttandanceTabs ? (
            <View style={{ flex: 1 }}>
                {ShowAttandanceTabs && MarkAttandance == 0 ? <MarkAttendence /> : null}
                {ShowAttandanceTabs && MarkAttandance == 1 ? <AttendanceReport /> : null}
                {ShowAttandanceTabs && MarkAttandance == 2 ? <AttendancePer /> : null}
                {ShowAttandanceTabs && MarkAttandance == 3 ? <AccumulatedHours /> : null}
            </View>
          ): (
            <View style={{ flex: 1 }}>
                {!ShowAttandanceTabs && AttendenceReport == 0 ? <AttendanceReport/> :null}
                {!ShowAttandanceTabs && AttendenceReport == 1 ? <AttendancePer/> :null}
                {!ShowAttandanceTabs && AttendenceReport == 2 ? <AccumulatedHours /> :null}
            </View>
          )
        }
        

      {/* {ShowAttandanceTabs && MarkAttandance == 0 ? <MarkAttendence /> : null}
      {ShowAttandanceTabs && MarkAttandance == 1 ? <AttendanceReport /> : null}
      {ShowAttandanceTabs && MarkAttandance == 2 ? <AttendancePer /> : null}

      {!ShowAttandanceTabs && AttendenceReport == 0 ? <AttendanceReport/> :null}
      {!ShowAttandanceTabs && AttendenceReport == 1 ? <AttendancePer/> :null} */}

        {/* {MarkAttandance == 0 ? (
          <MarkAttendence/>
         
        ) : (
          <AttendanceReport/>
         
        )} */}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: GlobalColor.PrimaryLight
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%'
  },
  reportView: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 0,
  },
  tabStyle: {
    paddingVertical: 10,
    paddingHorizontal:10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB'
  },
  tabStyle2: {
    paddingVertical: 10, 
    borderWidth: 1,
    borderRadius: 0,
    borderColor: GlobalColor.Secondary
  },
  tabTextStyle: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#43C6DB',
  },
  activeTabTextStyle: {
    color: '#43C6DB',
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
    marginVertical: 10
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
    borderColor: GlobalColor.LightDark
  },
  resetLocation: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#4a4a4a',
    alignItems: 'center',
    padding: 10
  },
  resetLocationTxt: {
    color: "#fff",
    marginRight: 5,
    fontWeight: "700"
  },
  spinnerTextStyle: {
    color: '#fff'
  },
  titleLabel: {
    color: GlobalColor.Primary,
    fontWeight: '700',
    fontSize: 16
  },
  addtnlBtn: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 55555
  }

});

//make this component available to the app
export default Attendance;
