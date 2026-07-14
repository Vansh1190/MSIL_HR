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
  PermissionsAndroid,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import RadioButtonRN from 'radio-buttons-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Formik} from 'formik';
import * as yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
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
import { DataTable } from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
 

const MergeTripReq = ({navigation}) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [searchLevel] = useState();
  const [searchLevelData, setSearchLevelData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [shiftData, setShiftData] = useState([]);
 
  const [ReportModal, setReportModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [YatriName, setYatriName] = useState([]);
  const [YatriMob, setYatriMob] = useState([]);
  const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);
  const [ReportAll, setReportAll] = useState([]);
  let userNT = AppUserData?.data?.userNT;
 

  const options = [
    {
      label: 'Yes',
      value: 'Y',
    },
    {
      label: 'No',
      value: 'N',
    },
  ];
  const [selectBuilding, setSelectBuilding] = useState([]);
  const [ReportData, setReportData] = useState([]);
  const [removeBuilding, setRemoveBuilding] = useState();
  const [selectTime, setselectTime] = useState();
  const [OpenDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [employ, setEmploy] = useState([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedNameData, setSearchedNameData] = useState('');
  const [empmodalVisible, setEmpModalVisible] = useState(false);
  const [LocationDisabled, setLocationDisabled] = useState(false);
 
  const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [selectDate, setSelectDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [second, setSecond] = useState(false);
    const [textinputDate, setTextinputDate] = useState('');
    const [textinputSecondDate, setTextinputSecondDate] = useState('');
    const [refresh, setrefresh] = useState(false);
    const [FinancialYear, setFinancialYear] = useState([]);
    const [SelectedYear, setSelectedYear] = useState('');
    const [GetControlNoDet, setGetControlNoDet] = useState([]);
    const [TaxiRequestID, setTaxiRequestID] = useState('');
 
    const [lati, setlati] = useState('');
    const [longi, setlongi] = useState('');
 

    // Api state
    const [Req, setReq] = useState('');
    const [RequestorIDD, setRequestorIDD] = useState('');
    const [RequestorMob, setRequestorMob] = useState('');
    const [TripStartP, setTripStartP] = useState('');
    const [TripEndP, setTripEndP] = useState('');
    const [TripStartT, setTripStartT] = useState('');
    const [TripEndT, setTripEndT] = useState('');
    const [TripWayP, setTripWayP] = useState('');
    const [RequestorMdl, setRequestorMdl] = useState('');
    const [ApproverMdl, setApproverMdl] = useState('');
    const [AllottedMdl, setAllottedMdl] = useState('');
    const [VendorIDD, setVendorIDD] = useState('');
    const [VehicleRegN, setVehicleRegN] = useState('');
    const [DriverIDD, setDriverIDD] = useState('');
    const [CreatorIDD, setCreatorIDD] = useState('');
    const [Commentss, setCommentss] = useState('');
    const [ExtraBillss, setExtraBillss] = useState('');
 
    const [TourTypee, setTourTypee] = useState('');
    const [RequestorTypee, setRequestorType] = useState('');
 
    const [Purposee, setPurposee] = useState('');
    const [PassengerDett, setPassengerDett] = useState('');
   
    const [MergeRequestIDD, setMergeRequestIDD] = useState('');
    const [Remarkss, setRemarkss] = useState('');
    const [AdditionalApprr, setAdditionalApprr] = useState('');
    const [OdometerReadingg, setOdometerReadingg] = useState('');
 

  const [Locations, setLocations] = useState([]);
  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
      console.log(error);
    }
  };
 
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission Required",
            message: "This app needs to access your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };
 
  const getCurrentAddress = () => {
 
    return new Promise((resolve, reject) => {
 
      setLoader(true);
  
      Geolocation.getCurrentPosition(
 
        async position => {
 
          setLoader(false);
 
          const { latitude, longitude } = position.coords;
  
          // Store for other use if needed
 
          setlati(latitude);
 
          setlongi(longitude);
  
          try {
 
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqQgcT34Ix_8YMXQ-RA5f2U2d2muT7vIE`;
  
            const response = await fetch(url);
 
            const result = await response.json();
  
            if (result.status === "OK" && result.results.length > 0) {
 
              const address = result.results[0].formatted_address;
              setEmpLoc(address);
 
              // console.log("Current Address:", address);
 
              resolve(address); // 🎯 Return address string
 
            } else {
 
              console.warn("No address found for coordinates.");
 
              reject("No address found");
 
            }
 
          } catch (err) {
 
            console.error("Reverse geocoding failed", err);
 
            reject("Geocoding failed");
 
          }
 
        },
 
        error => {
 
          setLoader(false);
 
          console.error("Location error 1", error);
 
          Alert.alert(
 
            "Error",
 
            "Unable to detect current location. Please reset location & retry."
 
          );
 
          reject(error.message);
 
        },
 
        {
 
          enableHighAccuracy: true,
 
          timeout: 15000,
 
          maximumAge: 10000,
 
          distanceFilter: 0,
 
        }
 
      );
 
    });
 
  };
 
   
 
const getUserCurrentLocation = () => {
  setLoader(true);
  Geolocation.getCurrentPosition(position => {
    setLoader(false);
    // console.log('position', position);
    const { latitude, longitude } = position.coords;
    // console.log("====Latitude++++",parseFloat(latitude));
    // console.log("====Longitude++++",parseFloat(longitude));
    setlati(parseFloat(latitude));
    setlongi(parseFloat(longitude));
    
   
 
      
 
  },
    error => {
      // console.log(error);
      setLoader(false);
      Alert.alert(
        "Error",
        "Unable to detect current location please reset location & retry",
        [
          {
            text: "Okay",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ]
      );
    },
    {
      enableHighAccuracy: true,     // Requires GPS; if false, may use Wi-Fi/Cell Tower
    timeout: 15000,               // Wait up to 15 seconds
    maximumAge: 10000,            // Accept cached location if not older than 10 seconds
    distanceFilter: 0,
      },
  );
    }
 
  const GetReportApi = () => {
    let userId = AppUserData?.data?.userId;
    let userNT = AppUserData?.data?.userNT;
    let fromDateReport = moment(fromDate).format('DD-MMM-YYYY');
    let toDateReport =  moment(toDate).format('DD-MMM-YYYY');
    // console.log("From Date My ", fromDateReport);
    // console.log("To Date My ", toDateReport);
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
        "Type": "PENDING",
      "RequestID": "",
      "CompCode": "101",
      "Status": "Submitted for Merging",
      "Requestor": "",
      "FromDate": "",
      "ToDate": "",
      "Filter": "",
      "UserName":userNT
    
    };
    // console.log('post data in Report Api of Visitor Gatepass rohtak', apiData);
    // console.log('post userId', userId);
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetGeneralReportEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
         console.log('Report data----Merge----', responseData);
        setReportAll(result.Value);
     
      })
      .catch(error => {
        setLoader(false);
        console.log('Error occurred=1=>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };
 
  const ApproveRequest = (Req_Stts ,actioN) => {
 
    if (actioN === "Reject" && (!Commentss || Commentss.trim() === "")) {
        Alert.alert("Comments are mandatory when rejecting a ride.");
        return;
      }
 
    let token = AppUserData.token;
 
    let userId = AppUserData?.data?.userId;
    // let mobileInt = RequestorMobile ? parseInt(RequestorMobile, 10) : "";
  
    let newdata = {
      "AppName":"TAXI-BOOK",
      "RequestID": Req == null ? "":Req,
 
      "RequestStatus": Req_Stts,
 
      "TourType": TourTypee == null ? "":TourTypee,
 
      "RequestorType": RequestorTypee == null ? "":RequestorTypee,
 
      "RequestorID": RequestorIDD == null ?"":RequestorIDD,
 
      "RequestorMobile": RequestorMob == null ?"":RequestorMob,
 
      "TripStartPoint": TripStartP == null ? "":TripStartP,
 
      "TripEndPoint": TripEndP == null ? "":TripEndP,
 
      "TripStartTime": TripStartT == null ? "":TripStartT,
 
      "TripEndTime": TripEndT == null ? "":TripEndT,
 
      "TripWayPoint": TripWayP == null ? "":TripWayP,
 
      "RequestorModel": RequestorMdl == null ? "":RequestorMdl,
 
      "ApproverModel": ApproverMdl == null ? '':ApproverMdl,
 
      "AllottedModel": AllottedMdl == null ? "":AllottedMdl,
 
      "VendorID": VendorIDD == null ? "":VendorIDD,
 
      "VehicleRegNo": VehicleRegN == null ? "":VehicleRegN,
 
      "DriverID": DriverIDD == null ? "":DriverIDD,
 
      "CreatorID": CreatorIDD == null ? "":CreatorIDD,
 
      "Action": actioN,
 
      "Comments": Commentss == null ? "":Commentss,
 
      "PassengerDet": PassengerDett == null ? "":PassengerDett, // should now be formatted correctly
 
      "ExtraBills": "",
 
      "Purpose": Purposee == null ? "":Purposee,
 
      "MergeRequestID": MergeRequestIDD == null ? "":MergeRequestIDD,
 
      "Remarks": Remarkss == null ? "":Remarkss,
 
      "UserName": userNT,
 
      "AdditionalAppr": AdditionalApprr == null ? '':AdditionalApprr,
 
      "OdometerReading":''
 
    };
  
    console.log('Submit Data ', newdata);
 
    setLoader(true);
  
    ApiService.PostMethode('/UpdateActionEmp', newdata, token, authContext)
 
      .then(result => {
 
        console.log('APiresult Approved ', result);
 
        setReportModal(!ReportModal);
 
        setLoader(false);
 
      
      
        if (result.Result === 'SUCCESS') {
          GetReportApi();
          Alert.alert("Trip Request Merged Successfully");
          setCommentss('');
 
        } else {
            GetReportApi();
          Alert.alert(result.Result);
          setCommentss('');
 
        }
 
      })
 
      .catch(error => {
 
        setLoader(false);
 
        setReportModal(!ReportModal);
 
        console.log('Error occurred==>', error);
        setCommentss('');
 
        ApiService.showErrorMessage(error, authContext);
 
      });
 
  };
 
  const GetYatri = (reqId) => {
    let userId = AppUserData?.data?.userId;
  
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
     
      "RequestID": reqId,
      "UserName":userNT
    
    };
    // console.log('post data in Report Api of Visitor Gatepass rohtak', apiData);
    // console.log('post userId', userId);
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetYatriEmp', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
      console.log('Report data--------', responseData);
        if(result.Value != '')
        {
           
const combinedString = responseData
.map(item => `${item.YTRI_ID}~${item.YTRI_MOB_NO}~${item.YTRI_NAME}~${item.YTRI_TYPE}`)
.join('#');
        setPassengerDett(combinedString);
 

          let yatriNem = responseData.map(element => {
            return element['YTRI_NAME'];
          }
 
          );
          setYatriName(yatriNem);
 

          let yatriMob = responseData.map(element => {
            return element['YTRI_MOB_NO'];
          }
 
          );
          setYatriMob(yatriMob);
 

        }
        //setReportAll(result.Value);
     
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };
 

  useEffect(() => {
//    requestLocationPermission();
//     getUserCurrentLocation();
//     getCurrentAddress();
    GetReportApi();
  }, []);
 

  // useEffect(() => {
  //   console.log(selectBuilding);
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
 
  const ItemRenderReport = ({item}) => (
    <TouchableOpacity
      // key={item['Request ID']}
      style={styles.item}
      onPress={() => {
         setModalData(item);
         setReportModal(true);
         GetYatri(item.RQST_ID);
         setTaxiRequestID(item.RQST_ID);
         console.log("Item is ----",item.RQST_ID);
         setReq(item.RQST_ID);
         setRequestorIDD(item.RQST_RQSTR_ID);
         setRequestorMob(item.RQST_RQSTR_MOB_NO);
         setTripStartP(item.RQST_FROM_PLACE);
         setTripEndP(item.RQST_TO_PLACE);
         setTripStartT(item.RQST_START_DATE);
         setTripEndT(item.RQST_END_DATE);
         setTripWayP(item.RQST_WAY_POINT);
         setRequestorMdl(item.RQST_RQSTR_MODEL);
         setApproverMdl(item.RQST_APPR_MODEL);
         setAllottedMdl(item.RQST_ALLT_MODEL);
         setVendorIDD(item.RQST_VEND_ID);
         setVehicleRegN(item.RQST_TAXI_REGN_NO);
         setDriverIDD(item.RQST_DRVR_ID);
         setCreatorIDD(item.RQST_CRTR_ID);
         setPurposee(item.RQST_PRPS);
         setMergeRequestIDD(item.RQST_MEGRE_REQ_ID);
         setRemarkss(item.RQST_REMARKS);
         setAdditionalApprr(item.RQST_ADDN_APPR);
         setTourTypee(item.RQST_TOUR_TYPE);
         setRequestorType(item.RQST_RQSTR_TYPE);
        
 
        // console.log("Status is ---",item.RQST_STATUS);
        // RHTKControlNoDet(item['Control No']);
      }}>
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text style={styles.itemText}>{item['RQST_ID']}</Text>
        {/* <Text style={styles.itemText}>{item['To Date']}</Text> */}
      </View>
 
    
 
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text numberOfLines={5} style={[styles.itemText,{marginLeft:17}]}>{item['RQST_FROM_PLACE']}</Text>
      </View>
 
     
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text numberOfLines={5} style={[styles.itemText,{marginLeft:17}]}>{item['RQST_TO_PLACE']}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text numberOfLines={5} style={[styles.itemText,{marginLeft:17}]}>{item['RQST_STATUS']}</Text>
      </View>
 
     
    </TouchableOpacity>
  );
 
  const FlatList_Header_Leave = () => {
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
          Req. Id
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          From
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
         To
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Status
        </Text>
      </View>
    );
  };
  if (loader) {
    return (
       
        <SafeAreaView style={styles.container}>
        {/* <Header title={"My Taxi Booking"} back /> */}
        <LoadingScreen />
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
          {/* <Header title={"My Taxi Booking"} /> */}
                  
                <ScrollView
                    style={{ }}
                    contentContainerStyle={{ flex: 1 }}>
                 





                    {/* Show Data */}
                    <View showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={{flex: 1, paddingHorizontal: 0, marginTop: 5}}>
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={ReportAll} //EmpLeaveDetail
                style={{marginBottom:'25%'}}
                renderItem={ItemRenderReport}
                keyExtractor={item => item.id}
                ListHeaderComponent={FlatList_Header_Leave}
                ListHeaderComponentStyle={{
                  borderBottomColor: '#43C6DB',
                  borderBottomWidth: 1,
                }}
                ListEmptyComponent={
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() =>
                      GetReportApi()
                    }
                    refreshing={refresh}></ListEmptyComponent>
                }
              />
 
             
              <Modal
                isVisible={ReportModal}
                // animationType="slide"
                transparent={true}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 0,
                    height:'auto',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 5,
                      paddingVertical: 5,
                      borderBottomWidth:0.5
                    }}>
                    <Text
                      Bold
                      style={{
                        fontSize: 15,
                        color:'#43C6DB',textDecorationLine: 'underline'
                      }}>
                      Merge Trip Approval
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
                  <ScrollView
                style ={{marginTop:5}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '90%'}}>
 
                     <Text style={{ fontWeight: "700",fontSize:12, marginVertical: 8 }}>
                          From. : {modalData['RQST_FROM_PLACE']}
                          </Text>
                          <Text style={{ fontWeight: "700",fontSize:12, marginVertical: 8 }}>
                          To : {modalData['RQST_TO_PLACE']}
                          </Text>
                          <Text style={{ fontWeight: "700",fontSize:12, marginVertical: 8 }}>
                          Way Point : {modalData['RQST_WAY_POINT']}
                          </Text>
                        
 
                        
                          <Text style={{fontWeight: "700",fontSize:12, marginVertical: 8}}>
                           Status : {modalData['RQST_STATUS']}
                          </Text>                                     
                         
                          {YatriName.map((person, index) => (
                    <Text
                      key={index}
                      style={{
                        fontWeight: '700',
                        fontSize: 12,
                        marginVertical: 8,
                      }}>
                      Yatri Name {index + 1} : {person}
                  
                    </Text>
                  ))}



                         {YatriMob.map((vendor, index) => (
                    <Text
                      key={index}
                      style={{
                        fontWeight: '700',
                        fontSize: 12,
                        marginVertical: 8,
                      }}>
                      Yatri Mob {index + 1} : {vendor}
                     
                    </Text>
                  ))}
 
<View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginVertical: 5,
                        height: 95,
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 0,
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Comments
                      </Text>
                     
                      <TextInput
                        value={Commentss}
                        editable={true}
                        onChangeText={text => setCommentss(text)}
                        maxLength={200}
                        style={{
                          marginVertical: 8,
                          width: '100%',
                          borderWidth: 1,
                          paddingVertical: 7,
                          alignSelf: 'center',
                          borderRadius: 8,
                          backgroundColor: GlobalColor.White,
                          borderColor: '#43C6DB',
                          fontSize: 13,
                        
                        }}
                      />
                    </View>
                   
                    </View>
                  </View>
                  </ScrollView>
                  <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          borderTopWidth:0.5,
                        }}>
                    
                        <TouchableOpacity
                          style={{
                            padding: 12,
                            borderRadius: 5,
                            backgroundColor: GlobalColor.Secondary,
                            minWidth: 100,
                            marginTop:10,
                            marginHorizontal:20
                          }}
                          onPress={() => {
                            ApproveRequest("Submitted for Merging","Approve");
                          }}>
                          <Text
                            style={{color: '#fff', alignSelf: 'center',fontSize:13}}
                            Bold>
                           Approve
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            padding: 12,
                            borderRadius: 5,
                            backgroundColor: GlobalColor.Secondary,
                            minWidth: 100,
                            marginTop:10
                          }}
                          onPress={() => {
                            ApproveRequest("Submitted for Merging","Reject");
                          }}>
                          <Text
                            style={{color: '#fff', alignSelf: 'center',fontSize:13}}
                            Bold>
                             Reject Ride
                          </Text>
                        </TouchableOpacity>
                      </View>
                </View>
              </Modal>
            </View>
          </View>
                </ScrollView>               
        </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  gradient: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight
},
item: {
  flexDirection: 'row',
  backgroundColor: GlobalColor.White,
  paddingHorizontal: 10,
  marginTop: 5,
  justifyContent: 'space-between',
  paddingVertical: 5,
  borderBottomWidth: 0.5,
  borderBottomColor: GlobalColor.Secondary,
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
  itemText: {
    fontSize: 13,
    marginLeft:5,
 
   
 
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
  // Dropdown styles
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
  },
  dropdown2BtnTxtStyle: {textAlign: 'left', fontSize: 14},
  dropdown2DropdownStyle: {backgroundColor: GlobalColor.White},
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
  },
  dropdown2RowTxtStyle: {textAlign: 'left', fontSize: 16},
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
    fontSize:13,
  },
  checkboxLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  ModalHeading: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  
  },
  HeaderColumn: {
    flex: 0.25,
    fontSize: 12,
   
  },
  itemColumn: {
    flex: 0.20,
    justifyContent: 'center',
    height:"auto"
  },
});
 
// //make this component available to the app
export default MergeTripReq;
 
 