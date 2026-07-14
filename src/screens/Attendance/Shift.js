//import liraries
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { DataTable } from 'react-native-paper';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast'
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import TextInput2 from '../../components/reusable/TextInput';
import Button from './../../components/reusable/Button';
import ShiftDetails from './ShiftDetails';
import FlexiShift from './FlexiShift';
import CompayShiftDe from './CompayShiftDe'




// create a component
const Shift = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const [textinputDate, setTextinputDate] = useState('');
  const [textinputSecondDate, setTextinputSecondDate] = useState('');
  const [openThird, setOpenThird] = useState(false);
  const [Shift, setShift] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [shiftType, setShiftType] = useState([]);
  const [shiftName, setShiftName] = useState('');
  const [currentShift, setCurrentShift] = useState('');
  const [shiftStatus, setShiftStatus] = useState([]);
  const [flexiShiftElig, setFlexiShiftElig] = useState('');
  const [flexidate, setFlexiDate] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [choseDate, setChoseDate] = useState('');
  const { authContext, AppUserData } = useContext(AuthContext);
  const [loader, setLoader] = useState(false)
  const [horizental, setHorizental] = useState(false);

  const [empShift, setEmpShift] = useState('');

  
  let usrAccess = AppUserData?.data?.userFlag;

// $&




  const LoadInitial = () => {
    //FlexiShiftElig()
    GetEmplShift()
   // flexiShiftPlanLov()
   // CurrentShift()
   // FlexiShiftStartDateLOV()
   // RptShiftStatus()
  }

  // ENd
  // useEffect(() => {
  //   FlexiShiftElig()
  //   GetEmplShift()
  //   flexiShiftPlanLov()
  //   CurrentShift()
  //   FlexiShiftStartDateLOV()
  //   RptShiftStatus()
  // }, [])

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = LoadInitial();
      return () => unsubscribe;
    }, [])
  )


  const handleShift = index => {
   
   setShift(index);
// $&

  };


  // SHIFT DETAILS API
  const GetEmplShift = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let fromdate = moment(fromDate).format('DD-MMM-YYYY');
    let toDate = moment(toDate).format('DD-MMM-YYYY');
    let apiData = {
      "FromDate": fromdate,
      "ToDate": toDate,
      "EmplID": userId
    };
    setLoader(true);
    ApiService.PostMethode('/GetEmplShift', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value
       // // console.log($1);
           setEmpShift(result.Value[0]['SHIFT']);
        setShiftData(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }
  // END 

  // FLEXI SHIFT API

  const flexiShiftPlanLov = () => {
    let userId = AppUserData?.data?.EMPL_NAME;
    let token = AppUserData.token;
    let apiData = {
      "UserName": AppUserData?.data?.username,
    };
    setLoader(true);
    ApiService.PostMethode('/flexiShiftPlanLov', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value
        setShiftType(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }


  const CurrentShift = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      "StaffNo": userId,
    };
    setLoader(true);
    ApiService.PostMethode('/CurrentShift', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result
        setCurrentShift(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }



  const SubmitFlexiShiftPlan = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      "Staffid": userId,
    };
    setLoader(true);
    ApiService.PostMethode('/SubmitFlexiShiftPlan', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result
        alert(ApiResult)
        // setSubmitShift(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }


  const RptShiftStatus = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      "StaffNo": "222852",
    };
    setLoader(true);
    ApiService.PostMethode('/RptShiftStatus', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value
        setShiftStatus(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }

  const FlexiShiftElig = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      "UserName": AppUserData?.data?.username,
    };
    setLoader(true);
    ApiService.PostMethode('/FlexiShiftElig', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result
        setFlexiShiftElig(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }


  const FlexiShiftStartDateLOV = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      "StaffNo": userId,
    };
    setLoader(true);
    ApiService.PostMethode('/FlexiShiftStartDateLOV', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result
        setFlexiDate(ApiResult)
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  }

  const handleSubmit = () => {
    if (shiftName == '') {
      alert("Please select shift name")
    }
    else if (choseDate == '') {
      alert("Please select Date")
    }
    else {

      submitAlert('Warning', 'Are You Sure?', 'yes', 'No');
    }
  }



  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const submitAlert = (title, body, btnTxt, btnTxt2) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          SubmitFlexiShiftPlan();
          RptShiftStatus();
        },
      },
      {
        text: btnTxt2,
        onPress: () => {
// $&
        },
      },
    ]);
  };


  const rederReason = ({ item }) => {
    return (
      <View
        style={{
          padding: 10,
          margin: 2,
          borderBottomWidth: 1,
          borderBottomColor: GlobalColor.Secondary,
          paddingVertical: 15
        }}>
        <TouchableOpacity
          onPress={() => {
            // // console.log($1);
            setShiftName(item.SHIFT_DESCRIPTION);
            setModalVisible(false);
// $&
          }}>
          <Text style={{ paddingHorizontal: 10 }}>
            {item.SHIFT_DESCRIPTION}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}

      <View style={{ paddingHorizontal: 10 }}>
        {/* <TouchableOpacity
            style={styles.addtnlBtn}
            onPress={() => {
              horizental == true ? setHorizental(false) : setHorizental(true);
            }}>
            <Ionicons
              name="ellipsis-vertical-circle"
              size={25}
              color={'#00B4DB'}
            />
          </TouchableOpacity>        
          {horizental == true ? (
            <View
              style={{
                padding: 5,
                backgroundColor: '#00B4DB',
                position: 'absolute',
                top: 0,
                right: 50,
                zIndex:1000,
                borderRadius:0,
                
              }}>
                <TouchableOpacity
                style={{paddingVertical:10}} onPress={() => {
                  setHorizental(false)
                  navigation.navigate("CompayShiftDe")
                }}>                      
                  <Text style={{color:'#fff',}}>Company Shift Details</Text>
                </TouchableOpacity>
               
            </View>
          ) : null} */}

        <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, paddingHorizontal: 0 }}>

        {
           
           usrAccess == 'Y'?(

            <ScrollView
            horizontal={true}
          >
            <SegmentedControlTab
              borderRadius={0}
              values={['Shift Details']}
              selectedIndex={Shift}
              onTabPress={index => {
                handleShift(index);
              }}
              tabsContainerStyle={styles.tabsContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTabTextStyle={styles.activeTabTextStyle}
            />
          </ScrollView>
           ) : 
           (
            <ScrollView
            horizontal={true}
          >
            {empShift == 'ZZ'?
             <SegmentedControlTab
             borderRadius={0}
             values={['Shift Details','Company Shift Details']}
             selectedIndex={Shift}
             onTabPress={index => {
             
               handleShift(index);
             }}
             tabsContainerStyle={styles.tabsContainerStyle}
             tabStyle={styles.tabStyle}
             tabTextStyle={styles.tabTextStyle}
             activeTabStyle={styles.activeTabStyle}
             activeTabTextStyle={styles.activeTabTextStyle}
           />
           :
           <SegmentedControlTab
           borderRadius={0}
           values={['Shift Details', 'Flexi Shift', 'Company Shift Details']}
           selectedIndex={Shift}
           onTabPress={index => {
           
             handleShift(index);
           }}
           tabsContainerStyle={styles.tabsContainerStyle}
           tabStyle={styles.tabStyle}
           tabTextStyle={styles.tabTextStyle}
           activeTabStyle={styles.activeTabStyle}
           activeTabTextStyle={styles.activeTabTextStyle}
         />
          }
           
          </ScrollView>
           )
           
           }
        
        </View>
      </View>
      
      {Shift == 0 ? <ShiftDetails /> : null}
      {Shift == 1 ? empShift == 'ZZ'? <CompayShiftDe />: <FlexiShift /> : null}
      {Shift == 2 ? <CompayShiftDe /> : null}




    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight
  },
  box: {
    width: '100%',
    padding: 5,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    // alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    borderRadius: 0,
  },
  inlineDatepicker: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginVertical: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputBox: {
    width: '100%',
    // alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    borderRadius: 0,
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  tabStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB'
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
  // content: {
  //   top: 10,
  //   alignItems: 'center',
  //   padding: 10,
  //   backgroundColor: 'white',
  //   borderRadius: 5,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.18,
  //   shadowRadius: 2.0,

  //   elevation: 5,
  // },
  dataRow: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  // addtnlBtn:{
  //   position:'absolute',
  //   right:10,
  //   top:0,
  //   zIndex:55555
  // }
  addtnlBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex: 55555
  },
});

//make this component available to the app
export default Shift;
