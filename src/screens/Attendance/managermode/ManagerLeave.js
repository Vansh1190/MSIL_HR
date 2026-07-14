import React, {Component, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as ApiService from '../../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../../context/AuthContext';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {GlobalColor} from '../../../constants/Colors';
import Text from '../../../components/reusable/Text';
import {Header} from '../../../components/reusable/Header';
import {GlobalFontSize} from '../../../constants/FontSize';
import ListEmptyComponent from '../../../components/reusable/ListEmptyComponent';
import TextInput from '../../../components/reusable/TextInput';
import {LoadingScreen} from '../../../components/reusable/LoadingScreen';
import CheckBox from '@react-native-community/checkbox';
import Button from '../../../components/reusable/Button';
import {Decrypt} from '../../../Service/Helper';
import {is} from 'immer/dist/internal';
import { HeaderMgr } from '../../../components/reusable/HeaderMgr';
import ButtonMgr from '../../../components/reusable/ButtonMgr';



export const ManagerLeave = () => {
  const [approve, setApprove] = useState(0);
  const [EmplLevDetail, setGetEmplLevDetail] = useState([]);
  const [PendingLeaveReq, setGetPendingLeaveReq] = useState([]);
  const [PendingLeaveReqShrt, setGetPendingLeaveReqShrt] = useState([]);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [LeaveDetailModalShrtLv, setLeaveDetailModalShrtLv] = useState(false);
  const [LeaveDetailModalShortfall, setLeaveDetailModalShortfall] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalDataShrtLv, setModalDataShrtLv] = useState([]);
  const [modalDataShortfall, setModalDataShortfall] = useState([]);
  const [remarkModal, setremarkModal] = useState(false);
  const [remarkModalText, setremarkModalText] = useState(false);
  const [remarkModalData, setremarkModalData] = useState(false);

  const [remarkModalShrt, setremarkModalShrt] = useState(false);
  const [remarkModalTextShrt, setremarkModalTextShrt] = useState(false);
  const [remarkModalDataShrt, setremarkModalDataShrt] = useState(false);

  const [Sublist, setSublist] = useState([]);
  const [DefaultSub, setDefaultSub] = useState({});
  const [SublistModalVisible, setSublistModalVisible] = useState(false);
  const [SublistModalVisibleType, setSublistModalVisibleType] = useState(false);
  
  const [SelectedYear, setSelectedYear] = useState('');
  const [isSelected, setSelection] = useState(true);
  const [isSelectedShrt, setSelectionShrt] = useState(true);
  const [BulkLeave, setBulkLeave] = useState([]);
  const [applyLeave, setapplyLeave] = useState(0);

  const [DefaultSubLeave, setDefaultSubLeave] = useState({});

  const [staff, setStaff] = useState('');

  const [ReportDataShrt, setReportDataShrt] = useState([]);

  const [Nem, setNem] = useState('');
  const [staffId, setStaffId] = useState('');



  const [remarkModalBulk, setremarkModalBulk] = useState(false);
  const [remarkModalTextBulk, setremarkModalTextBulk] = useState(false);
  const [remarkModalDataBulk, setremarkModalDataBulk] = useState(false);


  const [remarkModalBulkShrt, setremarkModalBulkShrt] = useState(false);
  const [remarkModalTextBulkShrt, setremarkModalTextBulkShrt] = useState(false);
  const [remarkModalDataBulkShrt, setremarkModalDataBulkShrt] = useState(false);

  const [ischeck, setIsCheck] = useState(false);
  const [ShowZZ, setShowZZ] = useState(false);

  let userId = AppUserData?.data?.userId;
  let UserName = AppUserData?.data?.EMPL_NAME;
  let date = moment(new Date()).format('DD-MMMM-YYYY');

  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const stopLoader = () => {
    setLoader(false);
    setrefresh(false);
  };

  const leaveData =  [
    {
    "LeaveType": "Absence",
     },
     {
      "LeaveType": "Flexi Time Adj.",
       },
    ]
     
  //  Load Sublist ID
  useEffect(() => {
    const permission = LoadSublist();
    return () => {
      permission;
    };
  }, []);

  const LoadSublist = () => {
// $&
// $&
showBanner();
    let userId = AppUserData?.data?.username;
    let apiData = {
      UserName: userId,
    };
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetSubList', apiData, token, authContext)
      .then(result => {
        stopLoader();
// $&
        if (result.Value != '') {
          setSublist(result.Value);
          setDefaultSub(result.Value[0]);
          setDefaultSubLeave(leaveData[0].LeaveType);
          getfinancialyear(result.Value[0].STAFFNO);
          setStaff(result.Value[0].STAFFNO);
          // GetEmplLevDetail(result.Value[0].STAFFNO)
        }
        else{
          setSublist([]);
          setDefaultSub([]);
          getfinancialyear('');
        }

        // let responseData = result.Value;
        // // console.log($1);
        // setEmploy(responseData);
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
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

  const showBanner = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    setLoader(true);
    ApiService.PostMethode('/GetEmployeeProfile', apiData, token, authContext)
      .then(result => {
        // console.log(result);
        stopLoader(false);
        let responseData = result.Value.Table1;
        let responseDataNew1 = result.Value.Table2;
       
        setNem(Decrypt(responseData[0].EMPL_NAME));
        setStaffId(Decrypt(responseData[0].EMPL_ID));
       
      })
      .catch(error => {
        stopLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };
 



  const getfinancialyear = staffNo => {
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/LeaveStatus', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
        if (result.Value) {
          let reasons = [];
          // setFinancialYear(result.Value.Table1);
          if (result.Value && result.Value.Table1[0].FNYR_YEAR) {
            setSelectedYear(Decrypt(result.Value.Table1[0].FNYR_YEAR));
            GetEmplLevDetail(
            
              Decrypt(result.Value.Table1[0].FNYR_YEAR),
            );
          }
        } else {
          Toast.show('No Leave type found');
        }
      })
      .catch(error => {
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetEmplLevDetail = ( fnyear) => {
    let userId = AppUserData?.data?.userId;
    var curryear = new Date().getFullYear().toString().substring(0, 2);
    var from;
    if (parseInt(fnyear.toString().substring(0, 2)) == 99) {
      from =
        '01-apr-' +
        (parseInt(curryear) - 10) +
        fnyear.toString().substring(0, 2);
    } else {
      from = '01-apr-' + curryear + fnyear.toString().substring(0, 2);
    }
    var to = '31-mar-' + curryear + fnyear.toString().substring(2, 4);

    // let userId = AppUserData?.data?.userId
    let token = AppUserData.token;
    let apiData = {
      StaffNo: userId,
      FromDate: from,
      ToDate: to,
    };

// $&
    // // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetEmplLevDetail', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader();
        ApiResult = result.Value;
        setGetEmplLevDetail(result.Value);
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const checkZZShift = async (showLoader = true) => {

    let userId = AppUserData?.data?.userId;
    let apiData = { "UserName": userId }; // created on   9 oct 2025 11:58 AM

    // let apiData = { "UserName": AppUserData?.data?.username }; // commented on created on   9 oct 2025 11:58 AM
    let token = AppUserData.token;
  
    if (showLoader) setLoader(true);
  
    try {
      const result = await ApiService.PostMethode('/GetShrtAccFlg', apiData, token, authContext);
 // Alert.alert(result.Result);
      if (result.Result === "Y") {
        setShowZZ(true);
      } else {
        setShowZZ(false);
      }
    } catch (error) {
      ApiService.showErrorMessage(error, authContext);
    } finally {
      if (showLoader) setLoader(false);
    }
  };
  
 
  const GetPendingLeaveReq = async (showLoader = true) => {
    let token = AppUserData.token;
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
  
    if (showLoader) setLoader(true);
  
    try {
      const result = await ApiService.PostMethode('/GetPendingLeaveReq', apiData, token, authContext);
  
      if (Array.isArray(result?.Value) && result.Value.length > 0) {
        const newarray = result.Value.map(element => ({
          ...element,
          selected: false,
        }));
        setGetPendingLeaveReq(newarray);
      } else {
        setGetPendingLeaveReq([]);
        setTimeout(() => {
          Toast.show('No Pending Request Found');
        }, 500);
      }
    } catch (error) {
      ApiService.showErrorMessage(error, authContext);
    } finally {
      if (showLoader) setLoader(false);
    }
  };
  

  const GetPendingLeaveReqShrt = () => {
    // alert("hiii");
    const stopLoader = () => {
      setLoader(false);
      // setrefresh(false);
    };
  
    let UserName = AppUserData?.data?.EMPL_NAME;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
  
    let apiData = {
      UserName: AppUserData?.data?.username,
      // "UserName": UserName,
    };
  
    setLoader(true);
  
    ApiService.PostMethode('/GetShtfallleaveApp', apiData, token, authContext)
      .then(result => {
        stopLoader();
  
        if (result.Value.length > 0) {
          let apiData = result.Value;
          let newarray = [];
          apiData.forEach(element => {
            newarray.push({ ...element, selected: false });
          });
          setGetPendingLeaveReqShrt(newarray);
        } else {
          // ✅ Toast will show even if Alert is open
          setTimeout(() => {
            Toast.show('No Pending Request Found');
          }, 500);
  
          setGetPendingLeaveReqShrt([]);
        }
      })
      .catch(error => {
        stopLoader();
        ApiService.showErrorMessage(error, authContext);
      });
  };
  

  const changeValue = (item, value) => {
// $&
    let data = PendingLeaveReq;
    let newArray = [];
    data.forEach(element => {
      if (element.LEV_ATTENDANCE_ID == item.LEV_ATTENDANCE_ID) {
        newArray.push({...element, selected: value});
      } else {
        newArray.push({...element});
      }
    });
    setGetPendingLeaveReq(newArray);
  };

  const rejectLeave = (data, modal = false) => {
    if (modal) {
      setremarkModalText('');
      setremarkModalData(data);
      setremarkModal(true);
      return;
    }

    let newData = data;
    newData.remark = remarkModalText;

    Alert.alert('Reject', 'Are you sure you wants to  reject leave?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => rejectLeaveDone(newData, 'R')},
    ]);
  };


  const rejectLeaveShrt = (data, modal = false) => {
    if (modal) {
      setremarkModalTextShrt('');
      setremarkModalDataShrt(data);
      setremarkModalShrt(true);
      return;
    }

    let newData = data;
    newData.remark = remarkModalTextShrt;

    Alert.alert('Reject', 'Are you sure you wants to  reject leave?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => rejectLeaveDoneShrt(newData, 'R')},
    ]);
  };

  const handleLeave = index => {
// $&
   if (index == 1) {
     // getfinancialyear();
   }
   setapplyLeave(index);
 };
  const approveLeave = data => {
    let newData = data;
    newData.remark = '';
    Alert.alert('Approve', 'Are you sure to Approve ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => rejectLeaveDone(newData, 'A')},
    ]);
  };



  const approveLeaveShrt = data => {
    let newData = data;
    newData.remark = '';
    Alert.alert('Approve', 'Are you sure to Approve ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => rejectLeaveDoneShrt(newData, 'A')},
    ]);
  };

  const rejectLeaveDone = (data, type) => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      ApplicationID: data.LEV_ATTENDANCE_ID,
      AppRejFlag: type,
      UserName: AppUserData?.data?.username,
      Comments: data.remark,
    };
    setLoader(true);
   // // console.log($1);
    ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader();
        if (result.Result) {
          if (type == 'A') {
            Alert.alert(
              'Leave',
              // result.Result,
              'Leave has been approved',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
            // Toast.show(result.Result);
          } else {
            Alert.alert(
              'Leave',
              // result.Result,
              'Leave has been rejected',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
          GetPendingLeaveReq();
        } else {
          Toast.show('Failed');
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const rejectLeaveDoneShrt = (data, type) => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;

// $&

    

    const result = [{...data}].flatMap(item => {
      return item.ATTENDANCE_ID.split(',').map(id => ({
        ...item,
        ATTENDANCE_ID: id
      }));
    });

// $&


    for( let i =0 ;i<result.length;i++)
    {


    let apiData = {
      ApplicationID: result[i].ATTENDANCE_ID,
      AppRejFlag: type,
      UserName: AppUserData?.data?.username,
      Comments: result[i].remark,
    };
    setLoader(true);
// $&
    ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader();
        if (result.Result) {
          if (type == 'A') {
            Alert.alert(
              'Leave',
              // result.Result,
              'Leave has been approved',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
            // Toast.show(result.Result);
          } else {
            Alert.alert(
              'Leave',
              // result.Result,
              'Leave has been rejected',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
          GetPendingLeaveReqShrt();
        } else {
          Toast.show('Failed');
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
    }
  };
  const getShortfallReport = (staff_id) => {
    let token = AppUserData.token;
    let apiData = {
      FinYear: "",
      EmplId:staff_id,
      DeptCode:"",
      LeaveFlag:"",
      UserName: userId,
     
    };

// $&
    // // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetShtfallLevData', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader();
        setReportDataShrt(result.Value.Table2);
       
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });

  }

  const BulkRejectDone = (data, type,modal = false) => {
    let chk=false;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;

// $&
// $&
// $&
   
   
    // let newData = data;
    // newData.remark = remarkModalText;
  
    // setLoader(true);
    // // console.log($1);
    // // console.log($1);

   
    for( let i =0 ;i<data.length;i++)
    {
      if(data[i].selected == true)
      {
        chk=true;
        if (modal) {
          setremarkModalTextBulk('');
          setremarkModalDataBulk(data);
          setremarkModalBulk(true);
          return;
        }
      var apiData = {
        ApplicationID: data[i].LEV_ATTENDANCE_ID,
        AppRejFlag: type,
        UserName: AppUserData?.data?.username,
        Comments: remarkModalTextBulk,
      };
// $&
      ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
       // stopLoader();
        if (result.Result) {
          if (type == 'A') {
           
            //Toast.show(result.Result);
          } else {
           // Toast.show(result.Result);
          }
          GetPendingLeaveReq();
        } else {
          Toast.show('Failed');
        }
      })
      
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
      // // console.log($1);
    }
    else{
      //Toast.show("Please select leaves");
// $&
      stopLoader();
      
    }

   

    }

    if(chk)
    {
      stopLoader();
// $&
      Toast.show(" Leave Reject Successfully");
    }
    else{
      stopLoader();
// $&
      Toast.show("Please select leave");
    }
// $&
   
  };


  const BulkRejectDoneShrt = (data, type,modal = false) => {
    let chk=false;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;

    // // console.log($1);
    // // console.log($1);
    // // console.log($1);
   
   
    // let newData = data;
    // newData.remark = remarkModalText;
  
    // setLoader(true);
    // // console.log($1);
    // // console.log($1);


    const result = data.flatMap(item => {
      return item.ATTENDANCE_ID.split(',').map(id => ({
        ...item,
        ATTENDANCE_ID: id
      }));
    });
    

   
    for( let i =0 ;i<result.length;i++)
    {
     
      if(result[i].selected == true)
      {
        chk=true;
     
        if (modal) {
         
          setremarkModalTextBulkShrt('');
          setremarkModalDataBulkShrt(data);
          setremarkModalBulkShrt(true);
          return;
        }
      var apiData = {
        ApplicationID: result[i].ATTENDANCE_ID,
        AppRejFlag: type,
        UserName: AppUserData?.data?.username,
        Comments: remarkModalTextBulk,
      };
      
// $&
      ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
       // stopLoader();
        if (result.Result) {
          if (type == 'A') {
            
            //Toast.show(result.Result);
          } else {
            
           // Toast.show(result.Result);
          }
          
          GetPendingLeaveReqShrt();
        } else {
          Toast.show('Failed');
        }
      })
      
      .catch(error => {
        stopLoader();
        // // console.log($1);
       // alert("Nine");
        ApiService.showErrorMessage(error, authContext);
      });
      // // console.log($1);
    }
    else{
      //Toast.show("Please select leaves");
// $&
      stopLoader();
      
    }

   

    }

    if(chk)
    {
      stopLoader();
// $&
      Toast.show(" Leave Reject Successfully");
    }
    else{
      stopLoader();
// $&
      Toast.show("Please select leave");
    }
// $&
   
  };

  const BulkApproveDone = (data, type) => {
    let chk=false;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
  
    setLoader(true);
// $&
// $&
    for( let i =0 ;i<data.length;i++)
    {
      if(data[i].selected == true)
      {
        chk=true;
      var apiData = {
        ApplicationID: data[i].LEV_ATTENDANCE_ID,
        AppRejFlag: type,
        UserName: AppUserData?.data?.username,
        Comments: "",
      };
    
      ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
        
        if (result.Result) {
          if (type == 'A') {
            
            //Toast.show(result.Result);
          } else {
           // Toast.show(result.Result);
          }
          GetPendingLeaveReq();
        } else {
          Toast.show('Failed');
        }
      })
      
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
      // // console.log($1);
    }
    else{
      //Toast.show("Please select leaves");
// $&
      stopLoader();
      
    }
   
    }
    if(chk)
    {
      stopLoader();
// $&
      Toast.show(" Leave Approved Successfully");
    }
    else{
      stopLoader();
// $&
      Toast.show("Please select leave");
    }
// $&
   
  };

  const BulkApproveDoneShrt = (data, type) => {
    let chk=false;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
  
    setLoader(true);
// $&
// $&
    const result = data.flatMap(item => {
      return item.ATTENDANCE_ID.split(',').map(id => ({
        ...item,
        ATTENDANCE_ID: id
      }));
    });

// $&
    for( let i =0 ;i<result.length;i++)
    {
      if(result[i].selected == true)
      {
        chk=true;
      var apiData = {
        ApplicationID: result[i].ATTENDANCE_ID,
        AppRejFlag: type,
        UserName: AppUserData?.data?.username,
        Comments: "",
      };
    
      ApiService.PostMethode('/ApproveRejectLeave', apiData, token, authContext)
      .then(result => {
// $&
        
        if (result.Result) {
          if (type == 'A') {
            Toast.show(" Leave Approved Successfully");
            //Toast.show(result.Result);
          } else {
           // Toast.show(result.Result);
          }
          GetPendingLeaveReqShrt();
        } else {
          Toast.show('Failed');
        }
      })
      
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
      // // console.log($1);
    }
    else{
      //Toast.show("Please select leaves");
// $&
      stopLoader();
      
    }
   
    }
    if(chk)
    {
      stopLoader();
// $&
      //Toast.show(" Leave Approved Successfully");
    }
    else{
      stopLoader();
// $&
      Toast.show("Please select leave");
    }
// $&
   
  };

  const handleApprove = index => {
    setApprove(index);
  };

  const initialLoading = async () => {
    setLoader(true); // Start loader once at the beginning
  
    try {
      // Run both APIs in parallel
      await Promise.allSettled([
        checkZZShift(false),     // pass flag to skip setLoader(true/false) inside
        GetPendingLeaveReq(false),
      ]);
    } finally {
      // Always stop loader, even if one fails
      setLoader(false);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      initialLoading();
    }, []),
  );
  

  const ItemRender = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
// $&

        setModalData(item);
        setLeaveDetailModal(!LeaveDetailModal);
      }}>
      <View style={[styles.itemColumn, {flex: 0.35}]}>
        <Text style={styles.itemText}>{item['From Date']}</Text>
        <Text style={styles.itemText}>{item['To Date']}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item['Leave Type']}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.3}]}>
        <Text style={styles.itemText}>{item.Period}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item.Status}</Text>
      </View>
    </TouchableOpacity>
  );

  const ItemRenderShortfall = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
// $&

        setModalDataShortfall(item);
        setLeaveDetailModalShortfall(!LeaveDetailModalShortfall);
      }}>
      <View style={[styles.itemColumn, {flex: 0.35}]}>
        <Text style={styles.itemText}>{item['MONTH DESC']}</Text>
        {/* <Text style={styles.itemText}>{item['To Date']}</Text> */}
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item['WEEK NUMBER']}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.3}]}>
        <Text style={styles.itemText}>{item['LEAVE TYPE']}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item.DAYS}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item.STATUS}</Text>
      </View>
    </TouchableOpacity>
  );

  function test(index, item) {
    //PendingLeaveReq
    //setGetPendingLeaveReq([...PendingLeaveReq,{...item,Selected:!item.Selected}]);
    const pendingLeaveReqData = PendingLeaveReq.map(mem => {
      if (item.LEV_ATTENDANCE_ID === mem.LEV_ATTENDANCE_ID) {
        mem.selected = !item.selected;
      }
      return mem;
    });
    const isAllSelected = pendingLeaveReqData.every(item=>item.selected);
  
      
    setSelection(!isAllSelected);
    setGetPendingLeaveReq([...pendingLeaveReqData]);
    //console.log([...PendingLeaveReq,{...item,Selected:!item.Selected}])
    // setSelection(index)
// $&
// $&
   
  }

  function testshrt(index, item) {
    //PendingLeaveReq
    //setGetPendingLeaveReq([...PendingLeaveReq,{...item,Selected:!item.Selected}]);
// $&
    const pendingLeaveReqDataShrt = PendingLeaveReqShrt.map(mem => {
      if (item.ATTENDANCE_ID === mem.ATTENDANCE_ID) {
        mem.selected = !item.selected;
      }
      return mem;
    });

    const isAllSelected = pendingLeaveReqDataShrt.every(item=>item.selected);
  
      
    setSelectionShrt(!isAllSelected);
     

    setGetPendingLeaveReqShrt([...pendingLeaveReqDataShrt]);
    //console.log([...PendingLeaveReq,{...item,Selected:!item.Selected}])
    // setSelection(index)
// $&
// $&
   
  }

  function selectAll() {
   setSelection(!isSelected);
    const pendingLeaveReqData = PendingLeaveReq.map(mem => {
      if(isSelected)
      {
        mem.selected = true;
      }
      else
      {
        mem.selected = false;
      }
    

      return mem;
    });
    //// console.log($1);
    setGetPendingLeaveReq([...pendingLeaveReqData]);
// $&
   
    
  }

  function selectAllShrt() {
    setSelectionShrt(!isSelectedShrt);
     const pendingLeaveReqDataShrt = PendingLeaveReqShrt.map(mem => {
       if(isSelectedShrt)
       {
         mem.selected = true;
       }
       else
       {
         mem.selected = false;
       }
     
 
       return mem;
     });
     //// console.log($1);
     setGetPendingLeaveReqShrt([...pendingLeaveReqDataShrt]);
// $&
    
     
   }

  // function toggle_Leave()
  // {
  //   setSelection(!isSelected);
  // }

  const ItemRenderLeave = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
// $&
        setModalData(item);
        setLeaveDetailModal(!LeaveDetailModal);
      }}>
      <View style={[styles.itemColumn, {flex: 0.3}]}>
        <Text style={styles.itemText}>{item.EMPL_NAME}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item['NAME']}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.35}]}>
        <Text style={styles.itemText}>{item['FROM_DATE']}</Text>
        <Text style={styles.itemText}>{item['TO_DATE']}</Text>
      </View>
      <View style={styles.itemColumnButtons}>
      <TouchableOpacity>
                                        <CheckBox
                                            disabled={false}
                                            value={item.selected}
                                            onChange={() => test(!item.selected, item)}
                                            boxType="square"
                                            // hideBox
                                            style={{ height: 20, width: 20, marginRight:5 }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                            onCheckColor={GlobalColor.Secondary}
                                            onTintColor={GlobalColor.Secondary}
                                        />  

                     </TouchableOpacity>     

        <TouchableOpacity
          style={[styles.itemButton, {marginRight: 15}]}
          onPress={() => approveLeave(item)}>
          <Ionicons
            name="checkmark-done-sharp"
            size={17}
            color={GlobalColor.Primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemButton}
          onPress={() => rejectLeave(item, true)}>
          <Ionicons name="close-sharp" size={17} color={GlobalColor.Danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const ItemRenderLeaveShrt = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
// $&
        setModalDataShrtLv(item);
        setLeaveDetailModalShrtLv(!LeaveDetailModalShrtLv);
      }}>
      <View style={[styles.itemColumn, {flex: 0.38}]}>
        <Text style={styles.itemText}>{item.EMPL_NAME}</Text>
      </View>
      <View style={styles.itemColumn}>
        <Text style={styles.itemText}>{item.LEV_NAME}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.35}]}>
        <Text style={styles.itemText}>{item.DAYS}</Text>
        
      </View>
      <View style={styles.itemColumnButtons}>
        <TouchableOpacity>
        <CheckBox
          disabled={false}
          value={item.selected}
          //   onValueChange={(newValue) => {
          //          console.log(newValue)
          //         toggle_Leave();
          //  }}
          boxType="square"
          // hideBox
          onChange={() => testshrt(!item.selected, item)}
          style={{ height: 20, width: 20, marginRight:5 }}
          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
          onCheckColor={GlobalColor.Secondary}
          onTintColor={GlobalColor.Secondary}
        />
</TouchableOpacity>
        <TouchableOpacity
          style={[styles.itemButton, {marginRight: 15}]}
          onPress={() => approveLeaveShrt(item)}>
          <Ionicons
            name="checkmark-done-sharp"
            size={17}
            color={GlobalColor.Primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemButton}
          onPress={() => rejectLeaveShrt(item, true)}>
          <Ionicons name="close-sharp" size={17} color={GlobalColor.Danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.35}]}>
          Date
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Type
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          Period
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Status
        </Text>
      </View>
    );
  };


  const FlatList_HeaderShortfall = () => {
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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.39}]}>
          Payroll Month
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Block
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          Type
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          Days
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Status
        </Text>
      </View>
    );
  };

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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          Name
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Type
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.35}]}>
          Date
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Approval
        </Text>
      </View>
    );
  };

  const FlatList_Header_LeaveShrt = () => {
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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.3}]}>
          Name
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Type
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.35}]}>
          Days
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Approval
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight}}>
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
<HeaderMgr title ="Leave Approval"/>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          marginBottom: 5,
          paddingHorizontal: 10,
        }}>
        <SegmentedControlTab
          borderRadius={0}
          values={['Approve Leave', 'View Report']}
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

      <View style={{paddingHoriZontal: 10, flex: 1}}>
        {approve == 0 ? (
          // <View style={{flex: 1}}>
          //   <View style ={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:20}}>
          //   <View style={styles.checkboxContainer}>
           
          //     <CheckBox
          //       disabled={false}
          //       value={!isSelected}
          //       onChange={() => selectAll()}
          //       tintColors={{
          //         true: GlobalColor.Secondary,
          //         false: GlobalColor.LightDark,
          //       }}
          //     />
          //     <Text Bold style={styles.checkboxText}>
          //       Select All
          //     </Text>
          //   </View>
          //   </View>
          //   <FlatList
          //     contentContainerStyle={{flexGrow: 1}}
          //     data={PendingLeaveReq}
          //     renderItem={ItemRenderLeave}
          //     keyExtractor={item => item.id}
          //     ListHeaderComponent={FlatList_Header_Leave}
          //     ListHeaderComponentStyle={{
          //       borderBottomColor: '#43C6DB',
          //       borderBottomWidth: 1,
          //     }}
          //     ListEmptyComponent={
          //       <ListEmptyComponent
          //         title="No Data Found"
          //         enableRefresh={true}
          //         onRefreshCallback={() => GetPendingLeaveReq(true)}
          //         refreshing={refresh}></ListEmptyComponent>
          //     }
          //   />
          // </View>
          <View style={{flex: 1}}>
            <View
  style={{
    width: '95%',
    alignSelf: 'center',
    marginTop: -7,
    paddingHorizontal: 2,
  }}>


  <ScrollView horizontal={true}>
    <SegmentedControlTab
      borderRadius={2}
      values={[
        'Absence',
        'Flexi Time Adj.',
      ]}
      selectedIndex={applyLeave}
      onTabPress={index => {
        handleLeave(index);
        index == 1 ? GetPendingLeaveReqShrt() : null
      }}
      
      tabsContainerStyle={styles.tabsContainerStyle1}
      tabStyle={styles.tabStyle1}
      tabTextStyle={styles.activeTabTextStyle1}
      activeTabStyle={styles.activeTabStyle1}
      activeTabTextStyle={styles.activeTabTextStyle1}
    />
  </ScrollView>
 
</View>


  
      <View style={{flexGrow: 1, paddingHorizontal: 10,}}>
      {applyLeave == 0 ?
       <View style={{flex: 1,}}>
            <View style ={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:20}}>
            <View style={styles.checkboxContainer}>
           
              <CheckBox
                disabled={false}
                value={!isSelected}
                onChange={() => selectAll()}
                boxType="square"
                // hideBox
                style={{ height: 20, width: 20, marginRight:5 }}
                tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                onCheckColor={'#FF6347'}
                onTintColor={'#FF6347'}
              />
              <Text Bold style={styles.checkboxText}>
                Select All
              </Text>
            </View>
            </View>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={PendingLeaveReq}
              renderItem={ItemRenderLeave}
              keyExtractor={item => item.id}
              style={{marginBottom:"2%"}}
              ListHeaderComponent={FlatList_Header_Leave}
              ListHeaderComponentStyle={{
                borderBottomColor: '#FF6347',
                borderBottomWidth: 1,
              }}
              ListEmptyComponent={
                <ListEmptyComponent
                  title="No Data Found"
                  enableRefresh={true}
                  onRefreshCallback={() => GetPendingLeaveReq(true)}
                  refreshing={refresh}></ListEmptyComponent>
              }
            />
          </View>
       :
       null}
      {applyLeave == 1 ? 
      <View style={{flex: 1}}>
      <View style ={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:20}}>
      <View style={styles.checkboxContainer}>
    
        <CheckBox
          disabled={false}
          value={!isSelectedShrt}
          onChange={() => selectAllShrt()}
          boxType="square"
          // hideBox
          style={{ height: 20, width: 20, marginRight:5 }}
          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
          onCheckColor={'#FF6347'}
                onTintColor={'#FF6347'}
        />
        <Text Bold style={styles.checkboxText}>
          Select All
        </Text>
      </View>
      </View>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={PendingLeaveReqShrt}
        renderItem={ItemRenderLeaveShrt}
        keyExtractor={item => item.id}
        style={{marginBottom:"10%"}}
        ListHeaderComponent={FlatList_Header_LeaveShrt}
        ListHeaderComponentStyle={{
          borderBottomColor: '#43C6DB',
          borderBottomWidth: 1,
        }}
        ListEmptyComponent={
          <ListEmptyComponent
            title="No Data Found"
            enableRefresh={true}
            onRefreshCallback={() => GetPendingLeaveReqShrt(true)}
            refreshing={refresh}></ListEmptyComponent>
        }
      />
    </View>
       : null}
      
    </View>
            </View>
        ) : (
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.reportHeader1}
              onPress={() => {
               // setSublistModalVisible(true);
              }}>
             {usrAccess == 'Y'?<Text></Text>: <Text style={{color: '#000', fontSize: 13}}>
                {staffId} {Nem}
              </Text>}
              {/* <Ionicons name="send" size={17} color={'#FF6347'} /> */}
            </TouchableOpacity>
            {ShowZZ == true ?
            <TouchableOpacity
              style={styles.reportHeader}
              onPress={() => {
                setSublistModalVisibleType(true);
              }}>
             {usrAccess == 'Y'?<Text></Text>: <Text style={{color: '#000', fontSize: 13}}>
                {DefaultSubLeave}
              </Text>}
              <Ionicons name="send" size={17} color={'#43C6DB'} />
            </TouchableOpacity>
            :null
            }
            {DefaultSubLeave != 'Flexi Time Adj.'?

            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={EmplLevDetail}
              renderItem={ItemRender}
              style={{marginBottom:"30%"}}
              keyExtractor={item => item.id}
              ListHeaderComponent={FlatList_Header}
              ListHeaderComponentStyle={{
                borderBottomColor: '#FF6347',
                borderBottomWidth: 1,
              }}
              ListEmptyComponent={
                <ListEmptyComponent
                  title="No Data Found"
                  enableRefresh={true}
                  onRefreshCallback={() =>
                    GetEmplLevDetail(SelectedYear)
                  }
                  refreshing={refresh}></ListEmptyComponent>
              }
            />
            :
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={ReportDataShrt}
              renderItem={ItemRenderShortfall}
              style={{marginBottom:"30%"}}
              keyExtractor={item => item.id}
              ListHeaderComponent={FlatList_HeaderShortfall}
              ListHeaderComponentStyle={{
                borderBottomColor: '#43C6DB',
                borderBottomWidth: 1,
              }}
              ListEmptyComponent={
                <ListEmptyComponent
                  title="No Data Found"
                  enableRefresh={true}
                  onRefreshCallback={() =>
                    GetEmplLevDetail(SelectedYear)
                  }
                  refreshing={refresh}></ListEmptyComponent>
              }
            />}
          </View>
        )}

        <Modal transparent={true} visible={LeaveDetailModal}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 0,
                width: '95%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  paddingVertical: 5,
                }}>
                <Text
                  Bold
                  style={{
                    fontSize: 15,
                    color: GlobalColor.Primary,
                  }}>
                  Leave Details
                </Text>

                <TouchableOpacity
                  onPress={() => setLeaveDetailModal(!LeaveDetailModal)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  {/* <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Name : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Id : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Dept : {modalData["Leave Type"]}
                          </Text> */}
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Leave Type :{' '}
                    {approve ? modalData['Leave Type'] : modalData['NAME']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Leave From :{' '}
                    {approve ? modalData['From Date'] : modalData['FROM_DATE']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Leave To :{' '}
                    {approve ? modalData['To Date'] : modalData['TO_DATE']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    No of Days : {approve ? modalData.Days : modalData['DAYS']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Planned/Unplanned :{' '}
                    {approve
                      ? modalData['Planned/Unplanned']
                      : modalData['PLANNED_UNPLANNED']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Period : {approve ? modalData.Period : modalData.PERIOD}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Reason : {approve ? modalData.Reason : modalData.REASON}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 12,
                    }}>
                    Remark : {modalData.Comments}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    {/* {
                              modalData.Status && modalData.Status.toLowerCase() == 'pending' ? (
                                <TouchableOpacity
                                style={{ padding: 12, borderRadius: 5,backgroundColor: GlobalColor.Secondary, minWidth:100, marginRight:25 }} 
                                onPress={() => {
                                  setLeaveDetailModal(!LeaveDetailModal);
                                  DeleteLeavePending(modalData);
                                }}>
                                <Text style={{color:'#fff', alignSelf:'center'}} Bold>Delete</Text>
                              </TouchableOpacity>
                              ) : null
                            } */}
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: '#FF6347',
                        minWidth: 100,
                      }}
                      onPress={() => {
                        setLeaveDetailModal(!LeaveDetailModal);
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Okay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>


       {/* Modal Shortfall leave Approve Reject Open*/}

       <Modal transparent={true} visible={LeaveDetailModalShrtLv}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 0,
                width: '95%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  paddingVertical: 5,
                }}>
                <Text
                  Bold
                  style={{
                    fontSize: 15,
                    color: GlobalColor.Primary,
                  }}>
                  Leave Details
                </Text>

                <TouchableOpacity
                  onPress={() => setLeaveDetailModalShrtLv(!LeaveDetailModalShrtLv)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  {/* <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Name : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Id : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Dept : {modalData["Leave Type"]}
                          </Text> */}
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Leave Type :{' '}
                    {modalDataShrtLv.LEV_NAME}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                   Payroll Month :{' '}
                    {modalDataShrtLv['LEV_PYROL_MONTH']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Block :{' '}
                    {modalDataShrtLv['LEV_WEEK_NUMBER']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    No of Days : {modalDataShrtLv['DAYS']}
                  </Text>
              
             
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Reason : {modalDataShrtLv.REASON}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 12,
                    }}>
                    Comment : {modalDataShrtLv.COMMENTS}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    {/* {
                              modalData.Status && modalData.Status.toLowerCase() == 'pending' ? (
                                <TouchableOpacity
                                style={{ padding: 12, borderRadius: 5,backgroundColor: GlobalColor.Secondary, minWidth:100, marginRight:25 }} 
                                onPress={() => {
                                  setLeaveDetailModal(!LeaveDetailModal);
                                  DeleteLeavePending(modalData);
                                }}>
                                <Text style={{color:'#fff', alignSelf:'center'}} Bold>Delete</Text>
                              </TouchableOpacity>
                              ) : null
                            } */}
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: '#FF6347',
                        minWidth: 100,
                      }}
                      onPress={() => {
                        setLeaveDetailModalShrtLv(!LeaveDetailModalShrtLv);
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Okay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {}

        {/* Modal Shortfall leave Approve Reject Open*/}



        <Modal transparent={true} visible={LeaveDetailModalShortfall}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 0,
                width: '95%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  paddingVertical: 5,
                }}>
                <Text
                  Bold
                  style={{
                    fontSize: 15,
                    color: GlobalColor.Primary,
                  }}>
                 Flexi Time Adj. Details
                </Text>

                <TouchableOpacity
                  onPress={() => setLeaveDetailModalShortfall(!LeaveDetailModalShortfall)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  {/* <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Name : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Emp. Id : {modalData["Leave Type"]}
                          </Text>
                          <Text style={{ fontWeight: "700", marginVertical: 8 }}>
                            Dept : {modalData["Leave Type"]}
                          </Text> */}
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Leave Type :{' '}
                    { modalDataShortfall['LEAVE TYPE']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Month :{' '}
                    {modalDataShortfall['MONTH DESC']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Block :{' '}
                    {modalDataShortfall['WEEK NUMBER']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    No of Days : { modalDataShortfall['DAYS']}
                  </Text>
                  
              
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Reason : {modalDataShortfall.REASON}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 12,
                    }}>
                    Comment : {modalDataShortfall.COMMENTS}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    {/* {
                              modalData.Status && modalData.Status.toLowerCase() == 'pending' ? (
                                <TouchableOpacity
                                style={{ padding: 12, borderRadius: 5,backgroundColor: GlobalColor.Secondary, minWidth:100, marginRight:25 }} 
                                onPress={() => {
                                  setLeaveDetailModal(!LeaveDetailModal);
                                  DeleteLeavePending(modalData);
                                }}>
                                <Text style={{color:'#fff', alignSelf:'center'}} Bold>Delete</Text>
                              </TouchableOpacity>
                              ) : null
                            } */}
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: '#FF6347',
                        minWidth: 100,
                      }}
                      onPress={() => {
                        setLeaveDetailModalShortfall(!LeaveDetailModalShortfall);
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Okay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>


       {/* Model Shortfall Detail Close */}

        <Modal transparent={true} visible={remarkModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setremarkModal(!remarkModal)}
                style={styles.modalClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={GlobalColor.Danger}
                />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <Text Bold style={styles.modalText}>
                  Enter Remark
                </Text>
                <TextInput
                  placeholder="Enter Remark"
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setremarkModalText(text)}
                />
              </View>

              <Button
                title="Submit"
                onPress={() => {
                  if (!remarkModalText) {
                    Alert.alert('Error', 'Please enter remark', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setremarkModal(!remarkModal);
                    rejectLeave(remarkModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>


        {/* Shortfall leave Reject Single Open */}

        <Modal transparent={true} visible={remarkModalShrt}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setremarkModalShrt(!remarkModalShrt)}
                style={styles.modalClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={GlobalColor.Danger}
                />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <Text Bold style={styles.modalText}>
                  Enter Remark
                </Text>
                <TextInput
                  placeholder="Enter Remark"
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setremarkModalTextShrt(text)}
                />
              </View>

              <Button
                title="Submit"
                onPress={() => {
                  if (!remarkModalTextShrt) {
                    Alert.alert('Error', 'Please enter remark', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setremarkModalShrt(!remarkModalShrt);
                    rejectLeaveShrt(remarkModalDataShrt);
                  }
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Shortfall leave Reject Single Close */}

         {/* Bulk Reject Model  */}


         <Modal transparent={true} visible={remarkModalBulk}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => 
                  {
                    setremarkModalBulk(!remarkModalBulk);
                   
                  }
                }
                style={styles.modalClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={GlobalColor.Danger}
                />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <Text Bold style={styles.modalText}>
                  Enter Remark
                </Text>
                <TextInput
                  placeholder="Enter Remark"
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setremarkModalTextBulk(text)}
                />
              </View>

              <Button
                title="Submit"
                onPress={() => {
                  if (!remarkModalTextBulk) {
                    Alert.alert('Error', 'Please enter remark', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setremarkModalBulk(!remarkModalBulk);
                    BulkRejectDone(remarkModalDataBulk,"R");
                    //rejectLeave(remarkModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>


         {/* Bulk Reject Model */}



        { /*Bulk Reject Done Shortfall Open*/}

        <Modal transparent={true} visible={remarkModalBulkShrt}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setremarkModalBulkShrt(!remarkModalBulkShrt)}
                style={styles.modalClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={GlobalColor.Danger}
                />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <Text Bold style={styles.modalText}>
                  Enter Remark
                </Text>
                <TextInput
                  placeholder="Enter Remark"
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setremarkModalTextBulkShrt(text)}
                />
              </View>

              <Button
                title="Submit"
                onPress={() => {
                  if (!remarkModalTextBulkShrt) {
                    Alert.alert('Error', 'Please enter remark', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setremarkModalBulkShrt(!remarkModalBulkShrt);
                    BulkRejectDoneShrt(remarkModalDataBulkShrt,"R");
                    //rejectLeave(remarkModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>

       { /* Bulk Reject Done Shortfall Close */ }

       {/* {position: 'absolute', top: 45, right: 5, zIndex: 55555} */}

        <Modal
          backdropOpacity={0.1}
          coverScreen={true}
          visible={SublistModalVisible}>
          <View style={[styles.modal,{marginTop:30,marginBottom:30}]}>
            <TouchableOpacity
              style={{position: 'absolute', top: 15, right: 5, zIndex: 55555}}>
              <Feather
                name="x-circle"
                color={GlobalColor.Danger}
                size={23}
                onPress={() => {
                  setSublistModalVisible(false);
                }}
                style={{margin: 10}}
              />
            </TouchableOpacity>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={Sublist}
              style={{marginTop:15,marginBottom:50}}
              ListEmptyComponent={() => {
                return (
                  <ListEmptyComponent
                    title="No Data Found"
                    // enableRefresh={true}
                    // onRefreshCallback={()=>GetShutlPastFutrReportApi(true)} refreshing={refresh}
                  ></ListEmptyComponent>
                );
              }}
              keyExtractor={({item, index}) => index}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSublistModalVisible(false);
                    GetEmplLevDetail(SelectedYear);
                    getShortfallReport(item.STAFFNO);
                    setStaff(item.STAFFNO);
                    setDefaultSub(item);
                  }}
                  style={styles.textContainer}>
                  <Text
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      color: '#000',
                      fontSize: 13,
                      
                    }}>
                    {item.NAME}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

   {/* Model Leave Type */}

   <Modal
          backdropOpacity={0.1}
          coverScreen={true}
          visible={SublistModalVisibleType}>
          <View style={[styles.modal,{height:'auto',marginTop:35,marginBottom:30}]}>
            <TouchableOpacity
              style={{position: 'absolute', top: 15, right: 5, zIndex: 55555}}>
              <Feather
                name="x-circle"
                color={GlobalColor.Danger}
                size={23}
                onPress={() => {
                  setSublistModalVisibleType(false);
                }}
                style={{margin: 10}}
              />
            </TouchableOpacity>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={leaveData}
              style={{marginTop:15,marginBottom:50}}
              ListEmptyComponent={() => {
                return (
                  <ListEmptyComponent
                    title="No Data Found"
                    // enableRefresh={true}
                    // onRefreshCallback={()=>GetShutlPastFutrReportApi(true)} refreshing={refresh}
                  ></ListEmptyComponent>
                );
              }}
              keyExtractor={({item, index}) => index}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSublistModalVisibleType(false);
                    //GetEmplLevDetail(item.STAFFNO, SelectedYear);
// $&

// $&
                    setDefaultSubLeave(item.LeaveType);

                    {item.LeaveType == 'Flexi Time Adj.'?getShortfallReport(staffId):null}
                    //setDefaultSub(item);
                  }}
                  style={styles.textContainer}>
                  <Text
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      color: '#000',
                      fontSize: 13,
                      
                    }}>
                    {item.LeaveType}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

      </View>
      {approve == 0 ?(
<View>
      {applyLeave == 0 ? (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
          justifyContent: 'space-between',
          marginBottom:"15%"
        }}>
        <View
          style={{
            height: 100,
            marginTop: 5,
            width: '50%',
            alignSelf: 'center',
            padding: 10,
           
          }}>
          <ButtonMgr
            onPress={() => {
// $&
              BulkApproveDone(PendingLeaveReq, 'A');
            }}
            title={'Approve'}></ButtonMgr>
        </View>
        <View
          style={{
            height: 100,
            marginTop: 5,
            width: '50%',
            alignSelf: 'center',
            padding: 10,
          }}>
          <ButtonMgr
            onPress={() => {
              BulkRejectDone(PendingLeaveReq, 'R',true)
            }}
            title={'Reject'}></ButtonMgr>
        </View>
      </View>
      ): <View
      style={{
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginBottom:"15%",
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          height: 100,
          marginTop: 5,
          width: '50%',
          alignSelf: 'center',
          padding: 10,
        }}>
        <ButtonMgr
          onPress={() => {
// $&
            BulkApproveDoneShrt(PendingLeaveReqShrt, 'A');
          }}
          title={'Approve'}></ButtonMgr>
      </View>
      <View
        style={{
          height: 100,
          marginTop: 5,
          width: '50%',
          alignSelf: 'center',
          padding: 10,
        }}>
        <ButtonMgr
          onPress={() => {
            BulkRejectDoneShrt(PendingLeaveReqShrt, 'R',true)
          }}
          title={'Reject'}></ButtonMgr>
      </View>
    </View>}
    </View>
):null}

    </SafeAreaView>
  );
};

export default ManagerLeave;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: GlobalColor.White,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#43C6DB',
  },
  HeaderColumn: {
    flex: 0.25,
    fontSize: 13,
  },
  itemColumn: {
    flex: 0.25,
    justifyContent: 'center',
  },
  itemButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GlobalColor.PrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    marginLeft: 2,
    fontSize: 13,
  },
  itemColumnButtons: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  spinnerTextStyle: {
    color: '#fff',
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  tabsContainerStyle1: {
    marginTop: 10,
    borderRadius: 0,
    width: '70%',
  },
  tabStyle: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#FF6347',
  },
  tabStyle1: {
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#0754b1',
    width:150
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
  activeTabStyle1: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#0754b1',
  },
  activeTabTextStyle: {
    color: '#FF6347',
  },
  activeTabTextStyle1: {
    color: '#0754b1',
  },
  checkboxContainer: {
    // width: '100%',
     flexDirection: 'row',
    alignItems: 'center',
    marginBottom:10,
    marginTop:10
    // marginRight: 9,
  },
  reportHeader: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: GlobalColor.White,
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 5,
  },

  reportHeader1: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'lightgrey',
    shadowColor: GlobalColor.Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    position: 'relative',
    width: '90%',
    backgroundColor: GlobalColor.White,
    padding: 20,
    // minHeight:200
  },
  modalText: {
    marginBottom: 20,
    fontSize: 13,
  },
  modalClose: {
    right: 5,
    top: 5,
    position: 'absolute',
    zIndex: 55555555,
  },
  inputBox: {
    height: 100,
    marginBottom: 5,
  },
  textContainer: {
    width: '100%',
    padding: 5,
    backgroundColor: GlobalColor.White,
    alignSelf: 'center',
    // marginVertical: 8.5,
    // shadowColor: GlobalColor.Black,
    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 3.0,
    // elevation: 5,
    // borderRadius:3,
    // paddingVertical: 10,
    // paddingHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderBottomWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  itemText: {
    fontSize: 13,
  },
});
