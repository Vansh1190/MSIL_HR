// /import liraries
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  Linking
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import RadioButtonRN from 'radio-buttons-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Formik, yupToFormErrors} from 'formik';
import * as yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import TextInput from '../../components/reusable/TextInput';
import {Header} from '../../components/reusable/Header';
import Button from '../../components/reusable/Button';
import {LoadingScreen} from '../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import {Decrypt} from '../../Service/Helper';
import TextInput2 from '../../components/reusable/TextInput';
import {CommonActions} from '@react-navigation/native';
import {Calendar} from 'react-native-big-calendar';
import DatePicker from 'react-native-date-picker';

const ViewRoom = ({navigation, route}) => {
  const {authContext, AppUserData} = useContext(AuthContext);

  const [ReportModal, setReportModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [events, setEvent] = useState([]);
  const [checked, setChecked] = useState(null);
  

  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [CalDet, setCalDet] = useState(new Date());
  const [toDateMy, setToMyDate] = useState(new Date(new Date().getDate() - 1));
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() + 7);
  const [maxToDate, setMaxToDate] = useState(new Date());
  const [textinputSecondDate, setTextinputSecondDate] = useState('');
  const [OpenDateTimePicker, setOpenDateTimePicker] = useState(false);

  const [rms, setRms] = useState([]);
  const [selRms, setSelRms] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selRmID, setSelRmsID] = useState([]);
  const [showData, setshowData] = useState(false);

  const eventss = [
    {
      title: 'Meeting',
      start: new Date(2024, 5, 31, 10, 0),
      end: new Date(2024, 5, 31, 10, 30),
    },
    {
      title: 'Coffee break',
      start: new Date(2024, 5, 31, 15, 45),
      end: new Date(2024, 5, 31, 16, 30),
    },
  ]

  const getRooms = () => {
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;

    let apiData = {
      UserName: userNt,
    };
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/Get_rooms', apiData, token, authContext)
      .then(result => {
        setLoader(false);

// $&

        let responseData = result.Value;
// $&

        if (responseData != '') {
          setRms(responseData);
// $&
          //   // console.log($1);
          //   // console.log($1);
          //   setsuperEmpId(responseData[0].DEP_EMPL_ID);
          //   setsuperEname(responseData[0].EMPL_NAME);
        } else {
          //setRms(optRooms);
          //   setsuperEmpId('');
          //   setsuperEname('');
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

      const fetchData = async () => {
  const API_URL = 'http://203.197.227.118:8999/sap/opu/odata/sap/ZPY_REG_PAYSLIP_API_SRV/RegPayslipSet(EmployeeId=%27%20999932%27,Month=%2705%27,FinancialYear=%272023%27,SlipType=%27A%27)/$value?sap-client=130%22';
  const API_USERNAME = 'API_TEST_1';
  const API_PASSWORD = 'Msil@#2024';

  // const API_USERNAME = 'QVBJX1RFU1RfMQ==';
  // const API_PASSWORD = 'TXNpbEAjMjAyNA==';
  //QVBJX1RFU1RfMQ==
  //TXNpbEAjMjAyNA==
        const headers = new Headers();
        headers.append(
          'Authorization', 'Basic ' +`${API_USERNAME}:${API_PASSWORD}`,
         
          );
        setLoader(true);
        try {
          const response = await fetch(API_URL, {
            method: 'GET',
            headers: headers,
          });

          if (!response.ok) {
            setLoader(false);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
// $&
          //setData(responseData);
        } catch (error) {
          setLoader(false);
// $&
          //setError(error.message);
        } finally {
          setLoader(false);
          //setLoading(false);
        }
      };

  const GetBooking = (from, roomId)  => {
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;

    let apiData = {
      UserName: userNt,
      BookingID: roomId,
      BookingDate: from,
    };
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/ViewRooms', apiData, token, authContext)
      .then(result => {
        setLoader(false);

// $&

        let responseData = result.Value;
// $&

       if(events == '')
       {
// $&
         var data = responseData.map(item => {
          return {
            title: item.title,
            start: new Date(item.start),
            end: new Date(item.end),
            status: item.RMBK_ID.toString(),
            
          };
        });

        setEvent([...data]);
       }
       else{

       
          var data = responseData.map(item => {
            return {
              title: item.title,
              start: new Date(item.start),
              end: new Date(item.end),
              status: item.RMBK_ID.toString(),
              
            };
          });

          setEvent([...data]);
// $&
        }
      
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetBookingDetails = roomId => {
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;

    let apiData = {
      UserName: userNt,
      BookingID: roomId,
      BookingDate: '',
    };
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetBookingDetails', apiData, token, authContext)
      .then(result => {
        setLoader(false);

// $&

        let responseData = result.Value;
// $&

        if (responseData != '') {
      

          setModalData(responseData);
// $&
        
        } else {
          setModalData([]);
       
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
    fetchData();
    getRooms();
  }, []);
  // useEffect(() => {
  //   // console.log($1);
  // }, [selectBuilding])

  const emptyList = () => {
    setSearch('');
  };

  const gatePassScheema = yup.object().shape({
    office: yup.object().required('Location is required'),
    // date: yup.string().required('select one is required'),
    duration: yup
      .string()
      .required('Duration  is required')
      .max(24, 'Duration should be less then 24 hours'),
    searchLevel: yup.object().required('select one search level please'),
    reason: yup
      .string()
      .required('Reason is required')
      .matches(/^[a-zA-Z0-9_ .-]*$/, 'Special characters not allowed'),
    persionalVehical: yup.object().required('Select an option'),
    internalVehical: yup.object().required('Select an option'),
    vehicleNumber: yup.string().test('Vehicle Number is required', function () {
      if (this.parent.persionalVehical.value === 'N') {
        return true;
      } else {
        if (this.parent.vehicleNumber) {
          return true;
        } else {
          return false;
        }
      }
    }),
    building: yup.string().required('Building it is required'),
    searchEmp: yup.string().required('Please select an employee'),
  });
  const fromRef = useRef(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleBuilding = () => {
    setShow(!show);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setselectTime(date);
    hideDatePicker();
  };

  // if(loader){
  //   return(
  //     <SafeAreaView style={{flex: 1,backgroundColor: GlobalColor.PrimaryLight}}>
  //       <LoadingScreen/>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight}}>

{
                loader ?
                    <Spinner
                        visible={loader}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    : null
            }

      <Header title="View Room" />
      {/* BODY */}
      <Formik
        // enableReinitialize
        innerRef={fromRef}
        validateOnBlur={false}
        validationSchema={gatePassScheema}
        initialValues={{
          frmDate: new Date(),
          tO_Date: new Date(),
          duration: '',
          searchLevel: '',
          reason: '',

          searchEmp: '',
          perName: '',
          Desig: '',

          MOB_NO: '',
        }}
        onSubmit={values => {
// $&

          let buldings = BuildingData.filter(element => {
            if (element.isSelected) {
              return element.BID;
            }
          }).map(obj => obj.BID);

          if (buldings.length == 0) {
            Alert.alert('Error', 'Building Not selected', [
              {
                text: 'okay',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
            return;
          }

          // let payload = {
          //   office: values.office,
          //   date: values.date,
          //   time: values.time,
          //   duration: values.duration,
          //   searchLevel: values.searchLevel,
          //   reason: values.reason,
          //   persionalVehical: values.persionalVehical,
          //   internalVehical: values.internalVehical,
          // };
          let newdata = {
            id: '1',
            location: values.office.CODE.split(',')[0],
            visitDate: moment(values.date).format('MMM-DD-YYYY hh:mm:ss a'),
            authorizedPerson: AppUserData?.data?.userId,
            Pvehicle: values.persionalVehical.value,
            VisType: 'O',
            visLevel: '1',
            buildings: buldings.join(','),
            duration: values.duration,
            exArrTime: moment(values.date).format('MMM-DD-YYYY hh:mm:ss a'),
            SearchLevel: values.searchLevel.value,
            interVehicle: values.internalVehical.value,
            ReasonToCome: values.reason,
            perName: values.perName,
            Desig: values.Desig,
            noOfPerson: '5',
            empId: values.empId,
            vehicleNumber: values.vehicleNumber,
            dateDummy: values.date,
            mobileNo: values.MOB_NO,
          };
// $&
          // return;
          navigation.navigate('VisitorDetails', {
            visitorpayload: newdata,
          });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <ScrollView
            nestedScrollEnabled={true}
            style={{marginTop: 5, paddingHorizontal: 15}}>
            {errors.office && touched.office && (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  paddingVertical: 2,
                }}>
                <Text style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                  {errors.office}
                </Text>
              </View>
            )}

            {/* Selct Date And Time */}

            <DatePicker
              modal
              mode="date"
              theme="light"
              open={OpenDateTimePicker}
              minimumDate={new Date()}
              maximumDate={new Date(moment(lastWeek).format('YYYY-MM-DD 23:59:59'))}
              date={new Date()}
              onConfirm={date => {
                let format = moment(date).format('DD-MMM-YYYY');
                setFromDate(format);
// $&
                setFieldValue('date', date);
                setOpenDateTimePicker(false);
                setCalDet(date);

                showData == true ?  GetBooking(moment(date).format('DD-MMM-YYYY'), checked) :null
                // setDate(date);
                // // console.log($1);
              }}
              onCancel={() => {
                setOpenDateTimePicker(false);
              }}
            />

            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{width: '95%', paddingRight: 5}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingTop: 10,
                      paddingVertical: 5,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    Select Date
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      backgroundColor: GlobalColor.White,
                      borderWidth: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      padding: 6,
                      alignSelf: 'center',
                      borderColor: '#43C6DB',
                    }}
                    onPress={() => setOpenDateTimePicker(true)}>
                    <Text style={{color: 'gray', fontSize: 13}}>
                      {moment(values.date).format('DD-MMM-YYYY')}
                    </Text>
                    {/* <Text style={{ color: 'gray' }}>
                    {moment(selectTime).format('LT')}
                  </Text> */}
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          // width: 65,
                          justifyContent: 'space-around',
                        }}>
                        <Ionicons
                          name="calendar-outline"
                          size={22}
                          color={'#43C6DB'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {errors.duration && touched.duration && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text
                    style={{fontSize: 14, color: 'red', textAlign: 'right'}}>
                    {errors.duration}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={{paddingVertical: 10, paddingHorizontal: 0, fontSize: 12}}
              Bold>
             Select Room For View Booking
            </Text>
            <View style={styles.box}>
              <FlatList
                horizontal
                //numColumns={6}
                data={rms}
                showsHorizontalScrollIndicator={true}
                keyExtractor={item => item.ROOM_ID.toString()}
                renderItem={({item}) => (
                  <View style={{marginLeft: 20}}>
                    <View style={styles.circleBox}>
                      <TouchableOpacity
                        onPress={() => {
                         
                          GetBooking(fromDate, item.ROOM_ID);
                          setshowData(true);
                           setChecked(item.ROOM_ID);
                          // GetLeaveReason(item.value);
                          // setChecked(item.id);
                          // setValidReason('Select Reason');
                          // fromRef.current.setFieldValue('leave', item.ABSENCE_ID);
                          // setFieldValue(item.id);
                        }}
                        style={[
                          styles.circle,
                          {
                            backgroundColor: checked == item.ROOM_ID ? '#43C6DB' : null,
                          },
                        ]}>
                        <Text
                          style={{
                            color: checked == item.ROOM_ID ? '#fff' : '#000',
                            fontSize: 9,
                          }}>
                          {item.ROOM_NO.split('/')[1]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
            {/* {events.length && ( */}
            <Text
              style={{paddingVertical: 10, paddingHorizontal: 0, fontSize: 12}}
              Bold>
             Select Booking for More Detail
            </Text>
              <View style={{marginTop: 10, backgroundColor: '#fff',marginBottom:"30%"}}>
                {/* <Calendar
                  events={events == ''?
                  [
                    {
                      title: 'No-Meeting',
                      start: new Date(new Date()),
                      end: new Date(new Date()),
                    },
                    
                  ]
                  
                  :events
                }
                  showDatePicker={false}
                  mode={'schedule'}
                  onPressEvent={events => {
                    setReportModal(true);
                   // Alert.alert("Clicked" +events);
// $&
                    events.status == undefined?setModalData([]):GetBookingDetails(events.status);
                  }}
                 eventCellStyle={{width: '125%'}}
                  height={"100%"}
                /> */}
                <Calendar 
                events={events} 
                date={CalDet}
                onPressEvent={events => {
                  setReportModal(true);
                  GetBookingDetails(events.status);
                  
                 
                }}
                mode='day'
                height={"600"} ></Calendar>
              </View>
            {/* )} */}

            <Modal
              isVisible={ReportModal}
              // animationType="slide"
              transparent={true}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 0,
                  height: '42%',
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 5,
                    paddingVertical: 5,
                    borderBottomWidth: 0.5,
                  }}>
                  <Text
                    Bold
                    style={{
                      fontSize: 15,
                      color: '#43C6DB',
                      textDecorationLine: 'underline',
                    }}>
                    Room Booking Detail
                  </Text>

                  <TouchableOpacity
                    onPress={() => setReportModal(!ReportModal)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={25}
                      color={GlobalColor.Danger}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{marginTop: 5}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '90%'}}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                        }}>
                        Booked From :  {modalData == '' ? '': moment( modalData[0].start).format('DD-MMM-YYYY HH:mm')}
                      </Text>

                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                        }}>
                        Booked To: {modalData == '' ? '':  moment( modalData[0].end).format('DD-MMM-YYYY HH:mm')}
                      </Text>

                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                        }}>
                        Booked By:  {modalData == '' ? '':modalData[0].RMBK_EMPL_ID1}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                        }}>
                        Co-Occupant: {modalData == '' ? '':modalData[0].RMBK_EMPL_ID2}
                      </Text>

                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                        }}>
                        Booking Remarks : {modalData == '' ? '':modalData[0].title}
                      </Text>

                  <View 
                  style ={{flexDirection:'row'}}>
                  <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          marginVertical: 5,
                          marginRight:10
                        }}>
                        Mob. No.
                      </Text>
                      <TouchableOpacity
                    onPress={() => {
                      let phoneNumber = modalData == '' ? '':modalData[0].MB_NO;
// $&
                      Linking.openURL(`tel:${phoneNumber}`);
                    }}>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 13,
                          marginVertical: 5,
                          color: GlobalColor.Secondary
                        }}>
                        {modalData == '' ? '':modalData[0].MB_NO}
                      </Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    borderTopWidth: 0.5,
                  }}>
                  {modalData == ''?null:   
                 <View>
                 {modalData[0].BOOKED_BY  == AppUserData?.data?.userId  ?(
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: GlobalColor.Secondary,
                        minWidth: 100,
                        marginTop: 10,
                        marginRight:10
                      }}
                      onPress={() => {
                        setReportModal(!ReportModal);
                        navigation.navigate('BookRoomModify', {
                          bookFrom:moment(modalData == '' ? '':modalData[0].start).format('YYYY-MM-DD H:mm:01'),
                          bookTo:moment(modalData == '' ? '':modalData[0].end).format('YYYY-MM-DD H:mm:ss'),
                          bookCo:modalData == '' ? '':modalData[0].RMBK_EMPL_ID2,
                          bookRsn:modalData == '' ? '':modalData[0].title,
                          bookedRoom:modalData[0]['ROOM NAME'],
                          roomId:modalData == '' ? '':modalData[0].RMBK_ROOM_ID,
                          rmbkID:modalData == '' ? '':modalData[0].RMBK_ID
                        })
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Modify
                      </Text>
                    </TouchableOpacity>
                 ):null }
                    </View>
}
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      borderRadius: 5,
                      backgroundColor: GlobalColor.Secondary,
                      minWidth: 100,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      setReportModal(!ReportModal);
                    }}>
                    <Text
                      style={{color: '#fff', alignSelf: 'center', fontSize: 13}}
                      Bold>
                      Okay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* end modal */}
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  gradient: {
    padding: 20,
  },
  container: {
    flexDirection: 'row',
  },

  buttonContainer: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 38 / 2,
    marginLeft: 50,
  },
  rowContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  rowText: {
    color: 'white',
    fontWeight: 'bold',
  },
  FlatListData: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#43C6DB',
    backgroundColor: GlobalColor.PrimaryLight,
  },
  circleBox: {
    width: '4%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 1,
    borderColor: '#43C6DB',
    width: 35,
    height: 35,
    borderRadius: 40,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginBottom: 10,
    // marginRight:15
    // marginHorizontal: 28,
  },
  box: {
    // width: '90%',
    padding: 5,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
  },
  // Dropdown styles
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: {textAlign: 'left', fontSize: 12},
  dropdown2DropdownStyle: {backgroundColor: GlobalColor.White},
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
  },
  dropdown2RowTxtStyle: {textAlign: 'left', fontSize: 12},
  centeredView: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  Modalclose: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#43C6DB',
    justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 55,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  Modalclosetxt: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 13,
  },
  checkboxLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  spinnerTextStyle: {
    color: '#fff'
},
  ModalHeading: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
});

// //make this component available to the app
export default ViewRoom;
