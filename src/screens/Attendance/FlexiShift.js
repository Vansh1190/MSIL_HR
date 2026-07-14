//import liraries
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {DataTable} from 'react-native-paper';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from '@react-navigation/native';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import TextInput2 from '../../components/reusable/TextInput';
import Button from './../../components/reusable/Button';
import ShiftDetails from './ShiftDetails';

const FlexiShift = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const [textinputDate, setTextinputDate] = useState('');
  const [flexiZZ, setFlexiZZ] = useState('');
  const [textinputSecondDate, setTextinputSecondDate] = useState('');
  const [openThird, setOpenThird] = useState(false);
  const [Shift, setShift] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [shiftType, setShiftType] = useState([]);
  const [shiftName, setShiftName] = useState('');
  const [currentShift, setCurrentShift] = useState('');
  const [shiftStatus, setShiftStatus] = useState([]);
  const [flexiShiftElig, setFlexiShiftElig] = useState(false);
  const [flexidate, setFlexiDate] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [choseDate, setChoseDate] = useState('');
  const [Selected, setSelected] = useState('');
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [horizental, setHorizental] = useState(false);

  const LoadInitial = () => {
    FlexiShiftElig();
    // GetEmplShift()
    flexiShiftPlanLov();
    CurrentShift();
    FlexiShiftStartDateLOV();
    RptShiftStatus();
  };

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
    }, []),
  );

  const handleShift = index => {
    setShift(index);
  };

  // SHIFT DETAILS API
  const GetEmplShift = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let fromdate = moment(fromDate).format('DD-MMM-YYYY');
    let toDate = moment(toDate).format('DD-MMM-YYYY');
    let apiData = {
      FromDate: fromdate,
      ToDate: toDate,
      EmplID: userId,
    };
    setLoader(true);
    ApiService.PostMethode('/GetEmplShift', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value;
        setShiftData(ApiResult);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  // END

  // FLEXI SHIFT API

  const flexiShiftPlanLov = () => {
    let userId = AppUserData?.data?.EMPL_NAME;
    let token = AppUserData.token;
    let apiData = {
      // UserName: AppUserData?.data?.username,
      "StaffNo":AppUserData?.data?.userId
    };
    setLoader(true);
    ApiService.PostMethode('/flexiShiftPlanLov', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value;
        setShiftType(ApiResult);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const CurrentShift = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      StaffNo: userId,
    };
    setLoader(true);
    ApiService.PostMethode('/CurrentShift', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result;
        setFlexiZZ(result.Result);
        setCurrentShift(ApiResult);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const SubmitFlexiShiftPlan = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
// $&
    let apiData = {
      Staffid: userId,
      PlanShift: shiftName.split(' ')[0],
      PlanStdate: Selected,
      OffDay: 'SUNDAY',
    };
// $&
    // return;
    setLoader(true);
    ApiService.PostMethode('/SubmitFlexiShiftPlan', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result;
        Alert.alert("Success", ApiResult);
        // alert(ApiResult);
        // Alert.alert("Success", "Flexi Shift request has been submitted")
        // setSubmitShift(ApiResult)
        RptShiftStatus();
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const RptShiftStatus = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      StaffNo: userId,
    };
    setLoader(true);
    ApiService.PostMethode('/RptShiftStatus', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Value;
        setShiftStatus(ApiResult);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const FlexiShiftElig = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      StaffNo: AppUserData?.data?.userId,
    };
    setLoader(true);
    ApiService.PostMethode('/FlexiShiftElig', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result;
        if(ApiResult){
          let dataArray = ApiResult.split(';');
          if(dataArray[1] && dataArray[1] != ""){
            Alert.alert("Alert", dataArray[1] );
            setFlexiShiftElig(false);
          }else{
            setFlexiShiftElig(true);
          }
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const FlatList_Header = () => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: GlobalColor.White,
          flexDirection: 'row',
        }}>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
          Shift
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
          Applicable Date
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.2}]}>
          Status
        </Text>
      </View>
    );
  };

  const FlexiShiftStartDateLOV = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      StaffNo: userId,
    };
    setLoader(true);
    ApiService.PostMethode(
      '/FlexiShiftStartDateLOV',
      apiData,
      token,
      authContext,
    )
      .then(result => {
// $&
        setLoader(false);
        let ApiResult = result.Result;
        setFlexiDate(ApiResult);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const handleSubmit = () => {
    if (shiftName == '') {
      alert('Please select shift name');
    } else if (choseDate == '') {
      alert('Please select Date');
    } 
    else if(flexiZZ == "ZZ ( 07:00 To 16:00 )")
    {
      alert("You are not eligible for opting Flexi Shift. Please reach out to your HRBP");
    }
    else {
      submitAlert('Warning', 'Are you sure to submit?', 'yes', 'No');
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const submitAlert = (title, body, btnTxt, btnTxt2) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          SubmitFlexiShiftPlan();
          // RptShiftStatus();
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

  const rederReason = ({item}) => {
    return (
      <View
        style={{
          padding: 10,
          margin: 2,
          borderBottomWidth: 1,
          borderBottomColor: '#43C6DB',
          paddingVertical: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            // // console.log($1);
            setShiftName(item.SHIFT_DESCRIPTION);
            setModalVisible(false);
// $&
          }}>
          <Text style={{paddingHorizontal: 10,fontSize:13}}>{item.SHIFT_DESCRIPTION}</Text>
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

      <ScrollView style={{flex: 1, paddingHorizontal: 10,marginBottom:"10%"}}>
        <Text style={{paddingVertical: 15, paddingHorizontal: 0,fontSize:13}} Bold>
          Shift Name
        </Text>
        <View style={styles.box}>
          <TouchableOpacity
            onPress={toggleModal}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 5,
              justifyContent: 'space-between',
            }}>
            {/* {shiftName==''} */}
            <Text  style={{fontSize:13}} Bold>
              {shiftName !== '' ? shiftName : <Text style={{fontSize:13}} Bold> Select Shift</Text>}
            </Text>
            <Ionicons name="arrow-forward-outline" color={'#43C6DB'} size={20} />
            <Modal isVisible={isModalVisible}>
              <SafeAreaView>
              <View
                style={{
                  height: '100%',
                  backgroundColor: GlobalColor.White,
                  borderRadius: 0,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                  }}>
                  <Text
                    Bold
                    style={{
                      color: GlobalColor.Primary,
                      fontSize: 15,
                    }}>
                    Select Shift
                  </Text>
                  <TouchableOpacity onPress={toggleModal}>
                    <Ionicons
                      name="close-circle-outline"
                      size={25}
                      color={GlobalColor.Danger}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={shiftType}
                  keyExtractor={item => item.id}
                  renderItem={rederReason}
                />
              </View>
              </SafeAreaView>
            </Modal>
          </TouchableOpacity>
        </View>
        <Text Bold style={{paddingVertical: 15, paddingHorizontal: 0,fontSize:13}}>
          Applicable Date
        </Text>
        <DatePicker
          modal
          open={openThird}
          date={selectDate}
          mode="date"
          onConfirm={selectDate => {
            setOpenThird(false);
            setSelectDate(selectDate);
            let formatDate = moment(selectDate).format('MMM Do YYYY');
            let otherFormatDate = moment(selectDate).format('DD-MMM-YYYY');
            setSelected(otherFormatDate);
            setChoseDate(formatDate);
// $&
          }}
          onCancel={() => {
            setOpenThird(false);
          }}
          minimumDate={new Date(moment().add(1, 'days'))}
          maximumDate={new Date(moment().add(2, 'months'))}
        />

        <View style={styles.inputBox}>
          <TextInput2
            placeholder="Select Date"
            width={'90%'}
            style={{fontSize:13}}
            editable={false}
            paddingHorizontal={10}
            value={choseDate}
          />
          <TouchableOpacity onPress={() => setOpenThird(true)}>
            <Ionicons
              name="calendar-outline"
              size={25}
              color={'#43C6DB'}
            />
          </TouchableOpacity>
        </View>

        <Text Bold style={{paddingVertical: 15, paddingHorizontal: 0,fontSize:13}}>
          Current Shift
        </Text>
        <View style={styles.inputBox}>
          <TextInput2
            value={currentShift}
            width={'80%'}
            style={{fontSize:15}}
            editable={false}
            paddingHorizontal={10}
          />
        </View>
        {/* Button */}
        {flexiShiftElig ? (
          <View style={{marginTop: 10, width: '100%', alignSelf: 'center'}}>
            <Button
              style={{fontSize:13}}
              onPress={() => {
                handleSubmit();
              }}
              title={'Submit'}></Button>
          </View>
        ) : null}

        {/* Report */}
        <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}>
          Report
        </Text>
        {/* <DataTable.Header style={{backgroundColor: GlobalColor.White}}>
           <DataTable.Title>
             <Text Bold style={{color: GlobalColor.Primary, fontSize: GlobalFontSize.Small}}>Shift</Text>
           </DataTable.Title>
           <DataTable.Title numeric>
             <Text Bold style={{color: GlobalColor.Primary, fontSize: GlobalFontSize.Small}}>
               Applicable Date
             </Text>
           </DataTable.Title>
           <DataTable.Title numeric>
             <Text Bold style={{color: GlobalColor.Primary, fontSize: GlobalFontSize.Small}}>Status</Text>
           </DataTable.Title>
         </DataTable.Header> */}

        <FlatList
          data={shiftStatus}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={FlatList_Header}
          ListHeaderComponentStyle={{
            borderBottomColor: '#43C6DB',
            borderBottomWidth: 1,
          }}
          renderItem={({item}) => (
            <View
              style={{
                width: '100%',
                backgroundColor: '#fff',
                marginVertical: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                paddingVertical: 15,
                borderBottomWidth: 0.4,
                borderBottomColor: GlobalColor.LightDark,
              }}>
              <Text style={{flex: 0.4,fontSize:13}}>{item.SHFT_START_SHIFT}</Text>
              <Text style={{flex: 0.4,fontSize:13}}>
                {moment(item.SHFT_START_DATE).format('M/DD/YYYY')}
              </Text>
              <Text style={{flex: 0.2,fontSize:13}}>
                {item.STATUS === 'Approved' ? (
                  <Text style={{color: 'green',fontSize:13}}>{item.STATUS}</Text>
                ) : (
                  <Text style={{color: 'green',fontSize:13}}>{item.STATUS}</Text>
                )}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight,
  },
  box: {
    width: '100%',
    padding: 5,
    paddingVertical: 10,
    backgroundColor: '#FFF',
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
    borderColor: GlobalColor.Secondary,
  },
  tabTextStyle: {
    fontSize: GlobalFontSize.P,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: GlobalColor.Secondary,
  },
  activeTabTextStyle: {
    color: GlobalColor.Secondary,
  },
  dataRow: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addtnlBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex: 55555,
  },
  HeaderColumn: {
    flex: 0.25,
    fontSize:13
  },
  spinnerTextStyle: {
    color: '#fff',
  },
});
export default FlexiShift;
