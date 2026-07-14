import React, { Component, useState, useEffect, useContext } from 'react';

import {

  View,

  StyleSheet,

  TouchableOpacity,

  useWindowDimensions,

  Image,

  FlatList,

  SafeAreaView,

  Alert,

  ScrollView

} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';

import LinearGradient from 'react-native-linear-gradient';

import SegmentedControlTab from 'react-native-segmented-control-tab';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import * as ApiService from '../../../Utils/Utils';

import Toast from 'react-native-simple-toast'

import { useFocusEffect } from '@react-navigation/native';

import AuthContext from '../../../context/AuthContext';

import moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';

import { GlobalColor } from '../../../constants/Colors';

import Text from '../../../components/reusable/Text';

import { Header } from '../../../components/reusable/Header';

import { GlobalFontSize } from '../../../constants/FontSize';

import ListEmptyComponent from '../../../components/reusable/ListEmptyComponent';

import TextInput from '../../../components/reusable/TextInput';

import { LoadingScreen } from '../../../components/reusable/LoadingScreen';

import { HeaderMgr } from '../../../components/reusable/HeaderMgr';

import Modal from 'react-native-modal';

import SelectDropdown from 'react-native-select-dropdown';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { connect } from 'http2';

 

export const ManagerTaxi = ({ navigation }) => {

  const [flexiShift, setFlexiShift] = useState('')

  const { authContext, AppUserData } = useContext(AuthContext);

  const [loader, setLoader] = useState(false);

  const [refresh, setrefresh] = useState(false);

  const [taxiPending, setTaxiPending] = useState([]);

  const [taxiPendingFiltered, setTaxiPendingFiltered] = useState([]);

  const [approvedTaxiReport, setApprovedTaxiReport] = useState([]);

  const [search, setSearch] = useState('');

  const [employ, setEmploy] = useState([]);

  const [approve, setApprove] = useState(0);

  const [ReportModal, setReportModal] = useState(false);

  const [modalData, setModalData] = useState([]);

  const [YatriName, setYatriName] = useState([]);

  const [YatriMob, setYatriMob] = useState([]);

  const [YatriID, setYatriID] = useState([]);

  const [YatriType, setYatriType] = useState([]);

  const [TaxiRequestID, setTaxiRequestID] = useState('');

  const [RequestStatus, setRequestStatus] = useState('');

  const [TourType, setTourType] = useState('');

  const [RequestorType, setRequestorType] = useState('');

  const [taxiModal, setTaxiModal] = useState([]);

  const [RequestorID, setRequestorID] = useState('');

  const [RequestorMobile, setRequestorMobile] = useState(123);

  const [TripStartPoint, setTripStartPoint] = useState('');

  const [TripEndPoint, setTripEndPoint] = useState('');

  const [TripStartTime, setTripStartTime] = useState('');

  const [TripEndTime, setTripEndTime] = useState('');

  const [TripWayPoint, setTripWayPoint] = useState('');

  const [RequestorModel, setRequestorModel] = useState('');

  const [VendorID, setVendorID] = useState('');

  const [VehicleRegNo, setVehicleRegNo] = useState('');

  const [DriverID, setDriverID] = useState('');

  const [CreatorID, setCreatorID] = useState('');

  const [Action, setAction] = useState('Approve');

  const [Comments, setComments] = useState('');

  const [PassengerDet, setPassengerDet] = useState('');

  const [ExtraBills, setExtraBills] = useState('');

  const [Purpose, setPurpose] = useState('');

  const [MergeRequestID, setMergeRequestID] = useState('');

  const [Remarks, setRemarks] = useState('');

  const [approvedModl, setapprovedModl] = useState(false);

  const [AprModel, setAprModel] = useState('');

  const [ReportModalReport, setReportModalReport] = useState(false);

  const [modalDataReport, setModalDataReport] = useState([]);

  const [ApproverModel, setApproverModel] = useState('');

  const [AllottedModel, setAllottedModel] = useState('');

 

  // Consolidated top-level stopLoader

  const stopLoader = () => {

    setLoader(false);

    setrefresh(false);

  }

 

  const GetTaxiPendingList1 = () => {

    let userId = AppUserData?.data?.userId

    let token = AppUserData.token;
    let userNt = AppUserData?.data?.userNT;

    console.log(token);

    let apiData = {

      "Type": "PENDING",

      "RequestID": "",

      "CompCode": "101",

      "Status": "",

      "Requestor": "",

      "FromDate": "",

      "ToDate": "",

      "Filter": "",

      "UserName": userNt

    };

    setLoader(true);

    ApiService.PostMethode('/GetGeneralReportEmp', apiData, token, authContext)

      .then(result => {

        console.log("APiresult GetTaxiPendingList modal---", result);

        stopLoader();

        if (result.Value && result.Value.length > 0) {

          let ApiResult = result.Value

          setTaxiPending(ApiResult);

          setTaxiPendingFiltered(ApiResult);

        } else {

          setTaxiPending([]);

          setTaxiPendingFiltered([]);

          // Toast.show("No pending request found");

        }

      })

      .catch(error => {

        stopLoader();

        // console.log('Error occurred==>', error);

        ApiService.showErrorMessage(error, authContext);

      });

  }

 

  const GetTaxiPendingList = () => {

    let userId = AppUserData?.data?.userId
    let userNt = AppUserData?.data?.userNT;

    let token = AppUserData.token;

    console.log(token);

    let apiData = {

      "Type": "PENDING",

      "RequestID": "",

      "CompCode": "101",

      "Status": "Submitted To Approver",

      "Requestor": "",

      "FromDate": "",

      "ToDate": "",

      "Filter": "",

      "UserName": userNt

    };

    setLoader(true);

    ApiService.PostMethode('/GetGeneralReportEmp', apiData, token, authContext)

      .then(result => {

        console.log("APiresult GetTaxiPendingList", result);

        stopLoader();

        if (result.Value && result.Value.length > 0) {

          let ApiResult = result.Value

          setTaxiPending(ApiResult);

          setTaxiPendingFiltered(ApiResult);

        } else {

          setTaxiPending([]);

          setTaxiPendingFiltered([]);

          // Toast.show("No pending request found");

        }

      })

      .catch(error => {

        stopLoader();

        // console.log('Error occurred==>', error);

       ApiService.showErrorMessage(error, authContext);

      });

  }

 

  const GetTaxiReport = () => {

    let userId = AppUserData?.data?.userId
    let userNt = AppUserData?.data?.userNT;

    let token = AppUserData.token;

    console.log(token);

    let apiData = {

      "Type": "PROCESSED",

      "RequestID": "",

      "CompCode": "101",

      "Status": "",

      "Requestor": "",

      "FromDate": "",

      "ToDate": "",

      "Filter": "",

      "UserName": userNt

    };

    console.log("api data report--", apiData);

    setLoader(true);

    ApiService.PostMethode('/GetGeneralReportEmp', apiData, token, authContext)

      .then(result => {

        console.log("APiresult GetReport", result.Value);

        stopLoader();

        if (result.Value && result.Value.length > 0) {

          setApprovedTaxiReport(result.Value);

        } else {

          setApprovedTaxiReport([]);

          //Toast.show("No pending request found");

        }

      })

      .catch(error => {

        stopLoader();

        // console.log('Error occurred==>', error);

        ApiService.showErrorMessage(error, authContext);

      });

  }

 

  const ApprovedTaxiReport = () => {

    let userId = AppUserData?.data?.userId

    let token = AppUserData.token;

    let apiData = {

      "UserName": AppUserData?.data?.username//"NSTHAKUR"

    };

    setLoader(true);

    ApiService.PostMethode('/ApprovedTaxiReport', apiData, token, authContext)

      .then(result => {

        console.log("APiresult ApprovedTaxiReport", result);

        stopLoader();

        if (result.Value && result.Value.length > 0) {

          let ApiResult = result.Value

          setApprovedTaxiReport(ApiResult);

        } else {

          setApprovedTaxiReport([]);

        }

      })

      .catch(error => {

        stopLoader();

        // console.log('Error occurred==>', error);

        ApiService.showErrorMessage(error, authContext);

      });

  }

 

  const SearchEmployee = () => {

    if (search === '') {

      Alert.alert("please enter a valid keyWord ")

      return

    } else {

      let apiData = {

        Search: search

      }

      let token = AppUserData.token

      setLoader(true);

      ApiService.PostMethode('/GetEmplLookup', apiData, token, authContext)

        .then(result => {

          console.log("GetEmplLookup", result);

          stopLoader();

          if (result.Value && result.Value.length > 0) {

            let responseData = result.Value;

            setEmploy(responseData);

          } else {

            Toast.show('Try with diffrent keyword');

          }

        })

        .catch(error => {

          stopLoader();

          // console.log('Error occurred==>', error);

          ApiService.showErrorMessage(error, authContext);

        });

    }

  };

 

  const searchFilterFunction = (text) => {

    setSearch(text)

    // console.log(text);

    const newData = taxiPending.filter((item) => {

      // ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}

      const itemData = `${item.TCAR_EMPL_ID}`;

      const itemDataSlip = `${item.TCAR_SLIP_NO}`;

      const textData = text;

      if (itemData.indexOf(text) > -1) {

        console.log("yes");

        return item;

      } else if (itemDataSlip.indexOf(text) > -1) {

        console.log("yes yes");

        return item;

      }

    });

    setTaxiPendingFiltered(newData);

  };

 

  const handleApprove = index => {

    setApprove(index);

    if (index == 0) {

      GetTaxiPendingList();

    } else if (index == 1) {

      GetTaxiReport();

    }

  };

 

  const emptyList = () => {

    setSearch('');

    setTaxiPendingFiltered(taxiPending);

  }

 

  const rejectFlexiShift = (data) => {

    Alert.alert(

      "Reject",

      "Are you sure to Reject ?",

      [

        {

          text: "Cancel",

          onPress: () => console.log("Cancel Pressed"),

          style: "cancel"

        },

        { text: "OK", onPress: () => rejectFlexiShiftDone(data, "R") }

      ]

    );

  }

 

  const approveFlexiShift = (data) => {

    Alert.alert(

      "Approve",

      "Are you sure to Approve ?",

      [

        {

          text: "Cancel",

          onPress: () => console.log("Cancel Pressed"),

          style: "cancel"

        },

        { text: "OK", onPress: () => rejectFlexiShiftDone(data, "A") }

      ]

    );

  }

 

  const GetYatri = (reqId) => {

    return new Promise((resolve, reject) => {

      const userId = AppUserData?.data?.userId;
      let userNt = AppUserData?.data?.userNT;

      const apiData = {

        RequestID: reqId,

        UserName: userNt,

      };

      const token = AppUserData.token;

      setLoader(true);

      ApiService.PostMethode('/GetYatriEmp', apiData, token, authContext)

        .then(result => {

          stopLoader();

          const responseData = result.Value;

          if (responseData && responseData.length > 0) {

            const formattedPassengerDet = responseData

              .map(item => `${item.YTRI_ID}~${item.YTRI_MOB_NO}~${item.YTRI_NAME}~${item.YTRI_TYPE}`)

              .join('#');

            setPassengerDet(formattedPassengerDet);

            setYatriName(responseData.map(e => e.YTRI_NAME));

            setYatriMob(responseData.map(e => e.YTRI_MOB_NO));

            setYatriID(responseData.map(e => e.YTRI_ID));

            setYatriType(responseData.map(e => e.YTRI_TYPE));

          }

          resolve(true);

        })

        .catch(error => {

          stopLoader();

          ApiService.showErrorMessage(error, authContext);

          reject(error);

        });

    });

  };

 

  const ApproveRequest = (action, adsnl_aprv) => {

    setLoader(true); // 🔥 MUST be first

    let token = AppUserData.token;

    let userId = AppUserData?.data?.userId;

    let userNt = AppUserData?.data?.userNT;

    let mobileInt = RequestorMobile ? parseInt(RequestorMobile, 10) : "";

    let newdata = {

      "AppName": "TAXI-BOOK",

      "RequestID": TaxiRequestID == null ? "": TaxiRequestID,

      "RequestStatus": RequestStatus == null ? "": RequestStatus,

      "TourType": TourType == null ? "": TourType,

      "RequestorType": RequestorType == null ? "": RequestorType,

      "RequestorID": RequestorID == null ? "": RequestorID,

      "RequestorMobile": mobileInt,

      "TripStartPoint": TripStartPoint == null ? "": TripStartPoint,

      "TripEndPoint": TripEndPoint == null ? "": TripEndPoint,

      "TripStartTime": TripStartTime == null ? "": TripStartTime,

      "TripEndTime": TripEndTime == null ? "": TripEndTime,

      "TripWayPoint": TripWayPoint == null ? "": TripWayPoint,

      "RequestorModel": RequestorModel == null ? "": RequestorModel,

      "ApproverModel": approvedModl == true ? AprModel : ApproverModel == null ? "": ApproverModel,

      "AllottedModel": approvedModl == true ? AprModel : AllottedModel == null ? "": AllottedModel,

      "VendorID": VendorID == null ? "": VendorID,

      "VehicleRegNo": VehicleRegNo == null ? "": VehicleRegNo,

      "DriverID": DriverID == null ? "": DriverID,

      "CreatorID": CreatorID == null ? "": CreatorID,

      "Action": action,

      "Comments": Comments == null ? "": Comments,

      "PassengerDet": PassengerDet == null ? "": PassengerDet, // should now be formatted correctly

      "ExtraBills": ExtraBills == null ? "": ExtraBills,

      "Purpose": Purpose == null ? "": Purpose,

      "MergeRequestID": MergeRequestID == null ? "": MergeRequestID,

      "Remarks": Remarks == null ? "": Remarks,

      "UserName": userNt,

      "AdditionalAppr": adsnl_aprv == null ? '': adsnl_aprv,

      "OdometerReading": ''

    };

    console.log('Submit Data ', newdata);

    ApiService.PostMethode('/UpdateActionEmp', newdata, token, authContext)

      .then(result => {

        const resultStr = result?.Result || '';

        const [status, requestId] = resultStr.split('-');

        stopLoader(); // 🔥 ADD THIS: Stop loader on SUCCESS

       

        setComments('');

        if (status === 'SUCCESS') {

          Alert.alert(

            'Submitted!',

            `${requestId} Trip Request Approved Successfully`

          );

          GetTaxiPendingList();

        } else {

          Alert.alert(resultStr);

          GetTaxiPendingList();

        }

      })

      .catch(error => {

        stopLoader(); // ✅ stop loader FIRST

       // setReportModal(!ReportModal);

        console.log('Error occurred==>', error);

        setComments('');

        ApiService.showErrorMessage(error, authContext);

      });

  };

 

  const SendBackRequest = (action, adsnl_aprv) => {

    let token = AppUserData.token;

    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;

    // if (action === 'Send Back' && (!Comments || Comments.trim() === '')) {

    //   Alert.alert("Comments are mandatory when sending back the request.");

    //   return;

    // }

    let newdata = {

      "AppName": "TAXI-BOOK",

      "RequestID": TaxiRequestID == null ? "": TaxiRequestID,

      "RequestStatus": RequestStatus == null ? "": RequestStatus,

      "TourType": TourType == null ? "": TourType,

      "RequestorType": RequestorType == null ? "": RequestorType,

      "RequestorID": RequestorID == null ? "": RequestorID,

      "RequestorMobile": RequestorMobile == null ? "": RequestorMobile,

      "TripStartPoint": TripStartPoint == null ? "": TripStartPoint,

      "TripEndPoint": TripEndPoint == null ? "": TripEndPoint,

      "TripStartTime": TripStartTime == null ? "": TripStartTime,

      "TripEndTime": TripEndTime == null ? "": TripEndTime,

      "TripWayPoint": TripWayPoint == null ? "": TripWayPoint,

      "RequestorModel": RequestorModel == null ? "": RequestorModel,

      "ApproverModel": ApproverModel == null ? "": ApproverModel,

      "AllottedModel": AllottedModel == null ? "": AllottedModel,

      "VendorID": VendorID == null ? "": VendorID,

      "VehicleRegNo": VehicleRegNo == null ? "": VehicleRegNo,

      "DriverID": DriverID == null ? "": DriverID,

      "CreatorID": CreatorID == null ? "": CreatorID,

      "Action": action,

      "Comments": Comments == null ? "": Comments,

      "PassengerDet": PassengerDet == null ? "": PassengerDet,

      "ExtraBills": ExtraBills == null ? "": ExtraBills,

      "Purpose": Purpose == null ? "": Purpose,

      "MergeRequestID": MergeRequestID == null ? "": MergeRequestID,

      "Remarks": Remarks == null ? "": Remarks,

      "UserName": userNt,

      "AdditionalAppr": adsnl_aprv == null ? '': adsnl_aprv,

      "OdometerReading": ''

    };

    console.log('Submit Data ', newdata);

    setLoader(true);

    ApiService.PostMethode('/UpdateActionEmp', newdata, token, authContext)

      .then(result => {

        console.log('APiresult Send Back Request', result);

        const resultStr = result?.Result || '';

        const [status, requestId] = resultStr.split('-');

        setComments('');

       // setReportModal(false);

        stopLoader();

        // GetTaxiReport();

        if (status === 'SUCCESS') {

          Alert.alert(

            'Submitted!',

            `${requestId} Trip Request Sent Back Successfully`

          );

          GetTaxiPendingList();

        } else {

          Alert.alert(resultStr);

          GetTaxiPendingList();

        }

      })

      .catch(error => {

        stopLoader();

        //setReportModal(!ReportModal);

        setComments('');

        console.log('Error occurred==>', error);

        ApiService.showErrorMessage(error, authContext);

      });

  };

 

  const GetModel = () => {

    let userId = AppUserData?.data?.userId
    let userNt = AppUserData?.data?.userNT;

   let apiData = { UserName: userNt, ModelCode: "", ModelMake: "" };

    let token = AppUserData.token;

    setLoader(true);

    ApiService.PostMethode('/GetModelEmp', apiData, token, authContext)

      .then(result => {

        stopLoader();

        let responseData = result.Value;

        console.log("taxi modal--", responseData);

        //setTaxiModelsFull(responseData);

        const dropdownData = responseData.map(emp => ({

          label: emp.MODL_CODE,

          value: emp.MODL_CLASS_CODE

        }));

        console.log("dd", dropdownData);

        setTaxiModal(dropdownData);

      })

      .catch(error => {

        stopLoader();

        ApiService.showErrorMessage(error, authContext);

      });

  };

  const ApproveRequestAlert = (modalData) => {
    Alert.alert('Approve', 'Are you sure to Approve ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () =>
      ApproveRequest("Approve", modalData)
      },
    ]);
  };

  const SendBackRequestAlert = (modalData) => {

     
    Alert.alert('Send Back', 'Are you sure to Send Back ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () =>

      SendBackRequest("Send Back", modalData)
     
      },
    ]);
  };

 

  const initialLoading = () => {

    GetTaxiPendingList();

    GetModel();

    // ApprovedTaxiReport()

    // GetTaxiReport();

  }

 

  useFocusEffect(

    React.useCallback(() => {

      const unsubscribe = initialLoading();

      return () => unsubscribe;

    }, [])

  );

 

  const ItemRender = ({ item }) => {

    const handlePress = async () => {

      try {

        setModalDataReport(item);

        // Await GetYatri before opening modal

        await GetYatri(item.RQST_ID);

        // Then show modal after data is ready

        setReportModalReport(true);

        console.log("Travel Date ---", item.RQST_START_DATE);

      } catch (err) {

        console.error("Error in handlePress", err);

      }

    };

    return (

      <TouchableOpacity

        style={styles.item}

        onPress={handlePress}

      >

        <View style={[styles.itemColumn, { flex: 0.40 }]}>

          <Text style={styles.itemText}>{item.RQST_START_DATE}</Text>

        </View>

        <View style={[styles.itemColumn]}>

          <Text style={styles.itemText}>{item.RQST_ID}</Text>

        </View>

        <View style={[styles.itemColumn, { flex: 0.40 }]}>

          <Text style={styles.itemText}>{item.RQST_RQSTR_NAME}</Text>

        </View>

        <View style={[styles.itemColumn, { flex: 0.15 }]}>

          <Text style={styles.itemText}>{item.RQST_RQSTR_DEPT}</Text>

        </View>

      </TouchableOpacity>

    );

  };

 

  const ItemRender_Approve = ({ item }) => {

    const handlePress = async () => {

      try {

        // Set all request-related data

        setModalData(item);

        setTaxiRequestID(item.RQST_ID);

        setRequestStatus(item.RQST_STATUS);

        setTourType(item.RQST_TOUR_TYPE);

        setRequestorType(item.RQST_RQSTR_TYPE);

        setRequestorID(item.RQST_RQSTR_ID);

        setRequestorMobile(item.RQST_RQSTR_MOB_NO);

        setTripStartPoint(item.RQST_FROM_PLACE);

        setTripEndPoint(item.RQST_TO_PLACE);

        setTripStartTime(item.RQST_START_DATE);

        setTripEndTime(item.RQST_END_DATE);

        setTripWayPoint(item.RQST_WAY_POINT);

        setRequestorModel(item.RQST_RQSTR_MODEL);

        setApproverModel(item.RQST_APPR_MODEL);

        setAllottedModel(item.RQST_ALLT_MODEL);

        setVendorID(item.RQST_VEND_ID);

        setVehicleRegNo(item.RQST_TAXI_REGN_NO);

        setDriverID(item.RQST_DRVR_ID);

        setCreatorID(item.RQST_CRTR_ID);

        setPurpose(item.RQST_PRPS);

        setMergeRequestID(item.RQST_MEGRE_REQ_ID);

        setRemarks(item.RQST_REMARKS);

        setApproverModel(item.RQST_APPR_MODEL);

        setAllottedModel(item.RQST_ALLT_MODEL);

        // Wait for GetYatri to finish

        await GetYatri(item.RQST_ID);

        // Then show the modal

        setReportModal(true);

      } catch (err) {

        console.log("Error in handlePress", err);

      }

    };

    return (

      <TouchableOpacity style={styles.item} onPress={handlePress}>

        <View style={[styles.itemColumn, { flex: 0.40 }]}>

          <Text style={styles.itemText}>{item.RQST_START_DATE}</Text>

        </View>

        <View style={[styles.itemColumn]}>

          <Text style={styles.itemText}>{item.RQST_ID}</Text>

        </View>

        <View style={[styles.itemColumn, { flex: 0.40 }]}>

          <Text style={styles.itemText}>{item.RQST_RQSTR_NAME}</Text>

        </View>

        <View style={[styles.itemColumn, { flex: 0.15 }]}>

          <Text style={styles.itemText}>{item.RQST_RQSTR_DEPT}</Text>

        </View>

      </TouchableOpacity>

    );

  };

 

  const FlatList_Header = () => {

    return (

      <View style={{

        width: "100%",

        justifyContent: 'space-between',

        paddingHorizontal: 10,

        paddingVertical: 15,

        backgroundColor: GlobalColor.White,

        flexDirection: 'row'

      }}>

        <Text Bold style={[styles.HeaderColumn]}>Travel Date</Text>

        <Text Bold style={[styles.HeaderColumn, { flex: 0.40 }]}>Req. ID</Text>

        <Text Bold style={styles.HeaderColumn}>Emp. Name.</Text>

        <Text Bold style={styles.HeaderColumn}>Dept</Text>

      </View>

    );

  }

 

  const FlatList_Header_Approve = () => {

    return (

      <View style={{

        width: "100%",

        justifyContent: 'space-between',

        paddingHorizontal: 10,

        paddingVertical: 15,

        backgroundColor: GlobalColor.White,

        flexDirection: 'row'

      }}>

        <Text Bold style={[styles.HeaderColumn, { flex: 0.40 }]}>Travel Date </Text>

        <Text Bold style={[styles.HeaderColumn]}>Req. ID</Text>

        <Text Bold style={[styles.HeaderColumn, { flex: 0.40 }]}>Emp. Name</Text>

        <Text Bold style={[styles.HeaderColumn, { flex: 0.15 }]}>Dept.</Text>

      </View>

    );

  }

 

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight, marginBottom: 100 }}>

      {loader == true ? (

        <Spinner

          visible={loader}

          textContent={'Loading...'}

          textStyle={styles.spinnerTextStyle}

        />

      ) : null}

      <HeaderMgr title="Taxi Request Approval" />

      <View style={{ width: '100%', marginVertical: 0 }}>

        <SegmentedControlTab

          borderRadius={0}

          values={['Approve Taxi', 'View Report']}

          selectedIndex={approve}

          onTabPress={index => {

            handleApprove(index);

          }}

          tabsContainerStyle={styles.tabsContainerStyle}

          tabStyle={styles.tabStyle}

          tabTextStyle={styles.tabTextStyle}

          activeTabStyle={styles.activeTabStyle}

          activeTabTextStyle={styles.activeTabTextStyle}

        />

      </View>

      <View style={{ flex: 1 }}>

        {approve == 0 ? (

          <View style={{ flex: 1, width: '100%', marginVertical: 0, paddingHorizontal: 10 }}>

            {/* <View

            style={styles.SearchInput}>

            <View

              style={{

                width: '15%',

                alignItems: 'center',

                justifyContent: 'center',

              }}>

              <Feather name="search" size={17} color={'#FF6347'} />

            </View>

            <TextInput

              placeholder="Search By Slip No/Staff ID"

              value={search}

              onChangeText={(data) => {

                searchFilterFunction(data);

              }}

              style={{

                width: '65%',

                paddingVertical: 5,

                fontSize: 13

              }}

            />

            {search !== '' ? (

              <TouchableOpacity

                style={{}} onPress={() => { emptyList() }}>

                <Ionicons

                  style={{ paddingVertical: 10 }}

                  name="close-circle-outline"

                  size={25}

                  color={'#FF6347'}

                />

              </TouchableOpacity>

            ) : null}

            <TouchableOpacity

              // onPress={() => {

              // SearchEmployee()

              // }}

              style={{

                width: '15%',

                alignItems: 'center',

                justifyContent: 'center',

              }}>

              <Ionicons name="send" size={16} color={'#FF6347'} />

            </TouchableOpacity>

          </View> */}

            <FlatList

              contentContainerStyle={{ flexGrow: 1 }}

              data={taxiPendingFiltered}

              ListHeaderComponent={FlatList_Header_Approve}

              keyExtractor={({ item, index }) => index}

              ListHeaderComponentStyle={{ borderBottomColor: '#FF6347', borderBottomWidth: 1 }}

              ListEmptyComponent={() => {

                return (

                  <ListEmptyComponent

                    title={"No Data Found"}

                    style={{ fontSize: 13 }}

                    subtitle={search ? "Not found please try with diffrent key" : "No data found please pull down to refresh"}

                    enableRefresh={true} onRefreshCallback={() => ApprovedTaxiReport(true)} refreshing={refresh}

                  ></ListEmptyComponent>

                )

              }}

              renderItem={ItemRender_Approve} />

          </View>

        ) : (

          <View style={{ flex: 1 }}>

            <FlatList

              contentContainerStyle={{ flexGrow: 1 }}

              data={approvedTaxiReport}

              ListHeaderComponent={FlatList_Header}

              keyExtractor={({ item, index }) => index}

              ListHeaderComponentStyle={{ borderBottomColor: '#FF6347', borderBottomWidth: 1 }}

              ListEmptyComponent={() => {

                return (

                  <ListEmptyComponent

                    title={"No Data Found"}

                    style={{ fontSize: 13 }}

                    subtitle={search ? "Not found please try with diffrent key" : "No data found please pull down to refresh"}

                    enableRefresh={true} onRefreshCallback={() => ApprovedTaxiReport(true)} refreshing={refresh}

                  ></ListEmptyComponent>

                )

              }}

              renderItem={ItemRender} />

          </View>

        )}

      </View>

      {approve == 0 ? (

        <Modal

          isVisible={ReportModal}

          // animationType="slide"

          transparent={true}>

          <View

            style={{

              backgroundColor: '#fff',

              padding: 10,

              borderRadius: 0,

              height: 'auto',

              width: '100%',

            }}>

            <View

              style={{

                flexDirection: 'row',

                alignItems: 'center',

                justifyContent: 'space-between',

                paddingBottom: 5,

                paddingVertical: 5,

                borderBottomWidth: 0.5

              }}>

              <Text

                Bold

                style={{

                  fontSize: 15,

                  color: '#FF6347', textDecorationLine: 'underline'

                }}>

                Approve Taxi Booking Request

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

              style={{ marginTop: 5 }}>

              <View style={{ flexDirection: 'row' }}>

                <View style={{ width: '90%' }}>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    From. : {modalData['RQST_FROM_PLACE']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    To : {modalData['RQST_TO_PLACE']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    Way Point : {modalData['RQST_WAY_POINT']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    Requested Model : {modalData['RQST_RQSTR_MODEL']}

                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>

                    <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8, }}>Approved Model *</Text>

                    <SelectDropdown

                      buttonTextAfterSelection={(selectedItem, index) => {

                        // text represented after item is selected

                        // if data array is an array of objects then return selectedItem.property to render after item is selected

                        return selectedItem.label;

                      }}

                      defaultButtonText={ApproverModel}

                      rowTextForSelection={(item, index) => {

                        // text represented for each item in dropdown RQST_APPR_MODEL

                        // if data array is an array of objects then return item.property to represent item in dropdown

                        return item.label;

                      }}

                      data={taxiModal}

                      onSelect={(selectedItem, index) => {

                        // console.log(selectedItem, index);

                        // console.log(selectedItem, index);

                        // console.log(selectedItem.value);

                        setapprovedModl(true);

                        setAprModel(selectedItem.label);

                        // console.log('Value Super ', SuperReq);

                        // console.log('Value Super ---1---', selectedItem.value);

                        // setFieldValue('SPRFLAG', selectedItem);

                        //setFieldValue('internalVehical', selectedItem);

                      }}

                      buttonStyle={styles.dropdown2BtnStyle}

                      buttonTextStyle={styles.dropdown2BtnTxtStyle}

                      renderDropdownIcon={isOpened => {

                        return (

                          <FontAwesome

                            name={isOpened ? 'chevron-up' : 'chevron-down'}

                            color={'#FF6347'}

                            size={14}

                          />

                        );

                      }}

                      dropdownIconPosition={'right'}

                      dropdownStyle={styles.dropdown2DropdownStyle}

                      rowStyle={styles.dropdown2RowStyle}

                      rowTextStyle={styles.dropdown2RowTxtStyle}

                    />

                  </View>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

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

                      value={Comments}

                      editable={true}

                      onChangeText={text => setComments(text)}

                      maxLength={200}

                      style={{

                        marginVertical: 8,

                        width: '100%',

                        borderWidth: 1,

                        paddingVertical: 7,

                        alignSelf: 'center',

                        borderRadius: 8,

                        backgroundColor: GlobalColor.White,

                        borderColor: '#FF6347',

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

                borderTopWidth: 0.5,

              }}>

              <TouchableOpacity

                style={{

                  padding: 12,

                  borderRadius: 5,

                  backgroundColor: '#FF6347',

                  minWidth: 100,

                  marginTop: 10

                }}

                onPress={() => {
//Anoop 2
                  //SendBackRequest("Send Back", modalData['RQST_ADDN_APPR']);
                  if (Comments.trim() === '') {

                    Alert.alert("Comments are mandatory when sending back the request.");
              
                    return;
              
                  }
                  setReportModal(false);
                  SendBackRequestAlert(modalData['RQST_ADDN_APPR']);
                 

                }}>

                <Text

                  style={{ color: '#fff', alignSelf: 'center', fontSize: 13 }}

                  Bold>

                  Send Back

                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={{

                  padding: 12,

                  borderRadius: 5,

                  backgroundColor: '#FF6347',

                  minWidth: 100,

                  marginTop: 10,

                  marginHorizontal: 20

                }}

                onPress={() => {
//Anoop
                  //ApproveRequest("Approve", modalData['RQST_ADDN_APPR']);
                  setReportModal(false);
                  ApproveRequestAlert(modalData['RQST_ADDN_APPR']);

                }}>

                <Text

                  style={{ color: '#fff', alignSelf: 'center', fontSize: 13 }}

                  Bold>

                  Approve

                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>

      ) :

        <Modal

          isVisible={ReportModalReport}

          // animationType="slide"

          transparent={true}>

          <View

            style={{

              backgroundColor: '#fff',

              padding: 10,

              borderRadius: 0,

              height: 'auto',

              width: '100%',

            }}>

            <View

              style={{

                flexDirection: 'row',

                alignItems: 'center',

                justifyContent: 'space-between',

                paddingBottom: 5,

                paddingVertical: 5,

                borderBottomWidth: 0.5

              }}>

              <Text

                Bold

                style={{

                  fontSize: 15,

                  color: '#FF6347', textDecorationLine: 'underline'

                }}>

                View All Taxi Booking Request

              </Text>

              <TouchableOpacity

                onPress={() => setReportModalReport(!ReportModalReport)}>

                <Ionicons

                  name="close-circle-outline"

                  size={25}

                  color={GlobalColor.Danger}

                />

              </TouchableOpacity>

            </View>

            <ScrollView

              style={{ marginTop: 5 }}>

              <View style={{ flexDirection: 'row' }}>

                <View style={{ width: '90%' }}>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    From. : {modalDataReport['RQST_FROM_PLACE']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    To : {modalDataReport['RQST_TO_PLACE']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    Way Point : {modalDataReport['RQST_WAY_POINT']}

                  </Text>

                  <Text style={{ fontWeight: "700", fontSize: 12, marginVertical: 8 }}>

                    Status : {modalDataReport['RQST_STATUS']}

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

              <TouchableOpacity

                style={{

                  padding: 12,

                  borderRadius: 5,

                  backgroundColor: '#FF6347',

                  minWidth: 100,

                  marginTop: 10

                }}

                onPress={() => {

                  setReportModalReport(!ReportModalReport)

                }}>

                <Text

                  style={{ color: '#fff', alignSelf: 'center', fontSize: 13 }}

                  Bold>

                  Okay

                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>

      }

    </SafeAreaView>

  );

};

 

export default ManagerTaxi;

 

const styles = StyleSheet.create({

  item: {

    flexDirection: 'row',

    backgroundColor: GlobalColor.White,

    paddingHorizontal: 10,

    marginTop: 5,

    justifyContent: 'space-between',

    paddingVertical: 5,

    borderBottomWidth: 0.5,

    borderBottomColor: '#FF6347'

  },

  HeaderColumn: {

    flex: 0.25,

    alignItems: 'center',

    textAlign: 'center',

    fontSize: 13,

    // justifyContent:'center',

  },

  itemText: {

    fontSize: 12

  },

  itemColumn: {

    flex: 0.25,

    justifyContent: 'center',

    alignItems: 'center'

  },

  itemButton: {

    width: 30,

    height: 30,

    borderRadius: 15,

    backgroundColor: GlobalColor.PrimaryLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  itemColumnButtons: {

    flex: 0.25,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 10,

    flexDirection: 'row',

  },

  spinnerTextStyle: {

    color: '#fff'

  },

  tabsContainerStyle: {

    paddingHorizontal: 10,

    marginTop: 10,

    borderRadius: 0,

    width: '100%',

  },

  tabStyle: {

    paddingVertical: 10,

    borderWidth: 1,

    borderRadius: 0,

    borderColor: '#FF6347'

  },

  tabTextStyle: {

    fontSize: 13,

    color: 'grey',

    fontFamily: 'Roboto-Bold',

  },

  activeTabStyle: {

    backgroundColor: GlobalColor.PrimaryLight,

    borderBottomWidth: 4,

    borderBottomColor: '#FF6347',

  },

  activeTabTextStyle: {

    color: '#FF6347',

  },

  SearchInput: {

    width: '100%',

    flexDirection: 'row',

    justifyContent: 'space-between',

    borderWidth: 1,

    borderColor: '#FF6347',

    borderRadius: 3,

    alignSelf: 'center',

    marginBottom: 5,

    marginTop: 5,

    height: 45,

    backgroundColor: GlobalColor.White

  },

  FlatListData: {

    width: "100%",

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingVertical: 5,

    paddingHorizontal: 5,

    marginTop: 10,

    backgroundColor: GlobalColor.White,

    shadowColor: GlobalColor.Black,

    shadowOffset: {

      width: -0,

      height: 1,

    },

    shadowOpacity: 0.22,

    shadowRadius: 2.22,

    elevation: 5,

    borderRadius: 3,

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

  ModalHeading: {

    fontSize: 15,

    fontWeight: '700',

    textAlign: 'center',

    marginBottom: 15,

  },

  dropdown2BtnStyle: {

    width: '60%',

    height: 30,

    borderWidth: 1,

    borderRadius: 3,

    backgroundColor: '#FFF',

    borderColor: '#FF6347',

    marginHorizontal: 5

  },

  dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 14 },

  dropdown2DropdownStyle: { backgroundColor: GlobalColor.White },

  dropdown2RowStyle: {

    backgroundColor: GlobalColor.White,

    borderBottomColor: '#FF6347',

  },

  dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 16 },

})

