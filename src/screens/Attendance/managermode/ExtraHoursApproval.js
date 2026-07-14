import React, {Component, useState, useEffect, useContext,useRef} from 'react';
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
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



import { useCallback } from 'react';





export const ExtraHoursApproval = () => {
  const [approve, setApprove] = useState(0);
  const [EmplLevDetail, setGetEmplLevDetail] = useState([]);
  const [PendingLeaveReq, setGetPendingLeaveReq] = useState([]);
  const [PendingLeaveReqShrt, setGetPendingLeaveReqShrt] = useState([]);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
 
  const [modalData, setModalData] = useState([]);
 
  const [remarkModal, setremarkModal] = useState(false);
  const [remarkModalText, setremarkModalText] = useState(false);
  const [remarkModalData, setremarkModalData] = useState(false);
 
  const [appHrsModal, setappHrsModal] = useState(false);
  const [appHrsModalText, setappHrsModalText] = useState(false);
  const [appHrsModalData, setappHrsModalData] = useState(false);



  const [Sublist, setSublist] = useState([]);
  const [DefaultSub, setDefaultSub] = useState({});
  const [SublistModalVisible, setSublistModalVisible] = useState(false);
  const [SublistModalVisibleType, setSublistModalVisibleType] = useState(false);
 
  const [SelectedYear, setSelectedYear] = useState('');
  const [Depart, setDepart] = useState('');
 
 
  const [isSelected, setSelection] = useState(true);
  const [isSelectedShrt, setSelectionShrt] = useState(true);
 
  const [ShowZZ, setShowZZ] = useState(false);
 
  const [DefaultSubLeave, setDefaultSubLeave] = useState({});
 
  const [staff, setStaff] = useState('');
  const [allDept, setAllDept] = useState([]);
 



  const [remarkModalBulk, setremarkModalBulk] = useState(false);
  const [remarkModalTextBulk, setremarkModalTextBulk] = useState(false);
  const [remarkModalDataBulk, setremarkModalDataBulk] = useState(false);
 
  const [appHrsModalBulk, setappHrsModalBulk] = useState(false);
  const [appHrsModalTextBulk, setappHrsModalTextBulk] = useState(false);
  const [appHrsModalDataBulk, setappHrsModalDataBulk] = useState(false);
 
  const bookingTypeDropdownRef = useRef(null);




  let userId = AppUserData?.data?.userId;
  let UserName = AppUserData?.data?.EMPL_NAME;
  let DeptCode = AppUserData?.data?.userDept;
 
  let date = moment(new Date()).format('DD-MMMM-YYYY');
 
  let usrAccess = AppUserData?.data?.userFlag;
 
  // console.log($1);
 
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
     
 
 
    const optRooms = [
      {
        label: 'No-Data',
        value: '',
      },
     
    ];




  const getfinancialyear = staffNo => {
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/LeaveStatus', apiData, token, authContext)
      .then(result => {
        // console.log($1);
        stopLoader(false);
        if (result.Value) {
          let reasons = [];
          // setFinancialYear(result.Value.Table1);
          if (result.Value && result.Value.Table1[0].FNYR_YEAR) {
            setSelectedYear(Decrypt(result.Value.Table1[0].FNYR_YEAR));
            GetEmplLevDetail(
              staffNo,
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
 
  const GetEmplLevDetail = (userId, fnyear) => {
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
 
    // console.log($1);
    // // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetEmplLevDetail', apiData, token, authContext)
      .then(result => {
         // console.log($1);
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
 
  const GetDept = async () => {
    try {
      const userId = AppUserData?.data?.userId;
      const token = AppUserData.token;
      const apiData = { UserName: userId };
 
      setLoader(true);
 
      const result = await ApiService.PostMethode('/GetDeptData', apiData, token, authContext);
      setLoader(false);
 
      const responseData = result.Value;
      // console.log($1);
 
      let deptCode = '';
 
      if (responseData == '') {
        setDepart('');
        setAllDept(optRooms);
      } else {
        deptCode = responseData[0]['DEPT_CODE'];
        setDepart(deptCode);
 
        const dropdownData = responseData.map(emp => ({
          label: emp.DEPT_CODE,
          value: emp.DEPT_CODE
        }));
        setAllDept(dropdownData);
      }
 
      // ✅ Fetch pending leave requests after department is set
      //GetPendingLeaveReq(deptCode, true);
 
    } catch (error) {
      setLoader(false);
      ApiService.showErrorMessage(error, authContext);
    }
  };
 
 
  const GetPendingLeaveReq = (dept) => {
   
    const stopLoader = () => {
      setLoader(false);
      // setrefresh(false);
    };
    let UserName = AppUserData?.data?.EMPL_NAME;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let DeptCode = AppUserData?.data?.userDept;
 
    console.log("hihi",DeptCode)
    let apiData = {
      Dept: dept,
      EmplId:"",
      Username: userId,
      // "UserName": UserName,
    };
    // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetExtraWorkApproval', apiData, token, authContext)
      .then(result => {
      //  // console.log($1);
        stopLoader();
        if (result.Value.length > 0) {
          let apiData = result.Value;
          let newarray = [];
          apiData.forEach((element,index) => {
           
newarray.push({
  ...element,
  selected: false,
  customKey: `${element.EMPL_ID}_${index}`, // Example of a unique key
       
});
 
          });
          setGetPendingLeaveReq(newarray);
          //// console.log($1);
        } else {
          setGetPendingLeaveReq([]);
          Toast.show('No Pending Request Found');
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };
 
  const checkZZShift = () => {
    let apiData = { "UserName": AppUserData?.data?.username };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetShrtAccFlg', apiData, token, authContext)
      .then(result => {
        // console.log($1);
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
 
  const approveLeaveHrs = (data, modal = false) => {
    if (modal) {
      setappHrsModalText('');
      setappHrsModalData(data);
      setappHrsModal(true);
      return;
    }
 
    let newData = data;
    newData.AppHrs = appHrsModalText;
 
    Alert.alert('Approved', 'Are you sure you wants to  Approve leave?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => rejectLeaveDone(newData, 'A')},
    ]);
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








  const rejectLeaveDone = (data, type) => {

    let userId = AppUserData?.data?.userId;
  
    let token = AppUserData.token;
  
    let categoryNumber = data.ALLOW_CATG?.split('-')[0];
  
    let remark = data.remark == undefined ? '' : data.remark;
  
    let appHrs = data.AppHrs == undefined ? '' : data.AppHrs;
   
    // Validation for approval (type === 'A')
  
    if (type === 'A') {
  
      // Validation 1: Check if approved hours is a valid number >= 0 and <= 16
  
      const approvedHours = parseFloat(appHrs);
  
      if (isNaN(approvedHours) || approvedHours < 0 || approvedHours > 16) {
  
        Alert.alert('Invalid Input', 'Approved hours must be a number between 0 and 16.');
  
        return;
  
      }
   
      // Validation 2: Check if approved hours is <= EXTH_HOURS_CREATED
  
      const createdHours = parseFloat(data.EXTH_HOURS_CREATED);
  
      if (isNaN(createdHours) || approvedHours > createdHours) {
  
        Alert.alert(
  
          'Invalid Input',
  
          `Approved hours (${approvedHours}) cannot exceed created hours (${data.EXTH_HOURS_CREATED}).`,
  
          [
  
            {
  
              text: 'OK',
  
              onPress: () => console.log('OK Pressed'),
  
              style: 'cancel',
  
            },
  
          ]
  
        );
  
        return;
  
      }
   
      // Validation 3: Check quarterly hours limit using APP_HRS
  
      const totalQuarterHours = data.APP_HRS + approvedHours;
  
      const staffName = data.EMPL_NAME;
  
      const staffNo = data.EMPL_ID;
   
      if (totalQuarterHours > 50) {
  
        Alert.alert(
  
          'Limit Exceeded',
  
          `${staffName} (${staffNo}) has already performed OT ${data.APP_HRS} Hours and now, you want to approve OT Hours more than statutory limit (i.e. 50 hours per quarter). Hence, Entry of extra hours denied and same will be rejected.`,
  
          [
  
            {
  
              text: 'OK',
  
              onPress: () => console.log('OK Pressed'),
  
              style: 'cancel',
  
            },
  
          ]
  
        );
  
        return;
  
      }
   
      if (totalQuarterHours >= 42 && totalQuarterHours <= 50) {
  
        Alert.alert(
  
          'Warning',
  
          `${staffName} (${staffNo}) has worked ${totalQuarterHours} extra hours in current quarter which is near to statutory limit of 50 hours per Quarter`,
  
          [
  
            {
  
              text: 'Cancel',
  
              onPress: () => console.log('Cancel Pressed'),
  
              style: 'cancel',
  
            },
  
            {
  
              text: 'OK',
  
              onPress: () => proceedWithApiCall(data, type, userId, token, categoryNumber, remark, appHrs),
  
            },
  
          ]
  
        );
  
        return; // Wait for user confirmation before proceeding
  
      }
  
    }
   
    // If no validation issues or type is not 'A', proceed with API call
  
    proceedWithApiCall(data, type, userId, token, categoryNumber, remark, appHrs);
  
  };
   
  // Helper function to handle API call
  
  const proceedWithApiCall = (data, type, userId, token, categoryNumber, remark, appHrs) => {
  
    let apiData = {
  
      UserName: AppUserData?.data?.username,
  
      EmplID: data.EMPL_ID,
  
      HoursApproved: appHrs,
  
      Status: type,
  
      Date: data.Date,
  
      Remarks: remark,
  
      Category: categoryNumber == undefined ? '' : categoryNumber,
  
    };
   
    setLoader(true);
  
    // console.log($1);
  
    ApiService.PostMethode('/ApproveExtraWork', apiData, token, authContext)
  
      .then(result => {
  
        // console.log($1);
  
        stopLoader();
  
        if (result == true) {
  
          if (type == 'A') {
  
            Alert.alert(
  
              'Leave',
  
              'Leave has been approved',
  
              [
  
                {
  
                  text: 'OK',
  
                  onPress: () => console.log('Cancel Pressed'),
  
                  style: 'cancel',
  
                },
  
              ]
  
            );
  
          } else {
  
            Alert.alert(
  
              'Leave',
  
              'Leave has been rejected',
  
              [
  
                {
  
                  text: 'OK',
  
                  onPress: () => console.log('Cancel Pressed'),
  
                  style: 'cancel',
  
                },
  
              ]
  
            );
  
          }
  
          GetPendingLeaveReq(Depart);
  
        } else {
  
          Toast.show('Failed');
  
        }
  
      })
  
      .catch(error => {
  
        stopLoader();
  
        ApiService.showErrorMessage(error, authContext);
  
      });
  
  };
   
   
 
 
  // const rejectLeaveDone = (data, type) => {
  //   let userId = AppUserData?.data?.userId;
  //   let token = AppUserData.token;
  //   let categoryNumber = data.ALLOW_CATG?.split('-')[0];
  //   let remark = data.remark == undefined ? '':data.remark;
  //   let appHrs = data.AppHrs ==  undefined ? '':data.AppHrs;
  //   // console.log($1);
  //   let apiData = {
  //     UserName: AppUserData?.data?.username,
  //     EmplID:data.EMPL_ID,
  //     HoursApproved:appHrs,
  //     Status: type,
  //     Date:data.Date,
  //     Remarks: remark,
  //     Category:categoryNumber == undefined ? "":categoryNumber
  //   };
  //   setLoader(true);
  //   // console.log($1);
  //   // console.log($1);
 
  //     // console.log($1);
  //   ApiService.PostMethode('/ApproveExtraWork', apiData, token, authContext)
  //     .then(result => {
  //       // console.log($1);
  //       stopLoader();
  //       if (result == true) {
  //         if (type == 'A') {
  //           Alert.alert(
  //             'Leave',
  //             // result.Result,
  //             'Leave has been approved',
  //             [
  //               {
  //                 text: 'OK',
  //                 onPress: () => console.log('Cancel Pressed'),
  //                 style: 'cancel',
  //               },
  //             ],
  //           );
  //           // Toast.show(result.Result);
  //         } else {
  //           Alert.alert(
  //             'Leave',
  //             // result.Result,
  //             'Leave has been rejected',
  //             [
  //               {
  //                 text: 'OK',
  //                 onPress: () => console.log('Cancel Pressed'),
  //                 style: 'cancel',
  //               },
  //             ],
  //           );
  //         }
  //         GetPendingLeaveReq(Depart);
  //       } else {
  //         Toast.show('Failed');
  //       }
  //     })
  //     .catch(error => {
  //       stopLoader();
  //       // // console.log($1);
  //       ApiService.showErrorMessage(error, authContext);
  //     });
  // };
 
  const getShortfallReport = (staff_id) => {
    let token = AppUserData.token;
    let apiData = {
      FinYear: "",
      EmplId:staff_id,
      DeptCode:"",
      LeaveFlag:"",
      UserName: userId,
     
    };
 
    // console.log($1);
    // // console.log($1);
    setLoader(true);
    ApiService.PostMethode('/GetShtfallLevData', apiData, token, authContext)
      .then(result => {
         // console.log($1);
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
 
    // console.log($1);
    // console.log($1);
    // console.log($1);
   
   
 
 
   
    for( let i =0 ;i<data.length;i++)
    {
     
      if(data[i].selected == true)
      {
       
        let categoryNumber = data[i].ALLOW_CATG?.split('-')[0];
        let remark = data[i].remark === undefined ? '' : data[i].remark;
        chk=true;
        if (modal) {
          setremarkModalTextBulk('');
          setremarkModalDataBulk(data);
          setremarkModalBulk(true);
          return;
        }
        let apiData = {
          UserName: AppUserData?.data?.username,
          EmplID: data[i].EMPL_ID,
          HoursApproved: "",
          Status: type,
          Date: data[i].Date,
          Remarks: remarkModalTextBulk,
          Category:categoryNumber == undefined ? "":categoryNumber
        };
      // console.log($1);
      ApiService.PostMethode('/ApproveExtraWork', apiData, token, authContext)
      .then(result => {
        // console.log($1);
       // stopLoader();
        if (result == true) {
          if (type == 'A') {
           
            //Toast.show(result.Result);
          } else {
           // Toast.show(result.Result);
          }
          GetPendingLeaveReq(Depart);
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
      // console.log($1);
      stopLoader();
     
    }
 
   
 
    }
 
    if(chk)
    {
      stopLoader();
      // console.log($1);
      Toast.show(" Leave Reject Successfully");
    }
    else{
      stopLoader();
      // console.log($1);
      Toast.show("Please select leave");
    }
  //  // console.log($1);
   
  };




  const BulkApproveDone = (data, type,modal = false) => {
    let chk=false;
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
 
   
   
   
 
    setLoader(true);
     // console.log($1);
     // console.log($1);
     let approvedItems = [];
 
     for (let i = 0; i < data.length; i++) {
       if (data[i].selected === true) {
         let categoryNumber = data[i].ALLOW_CATG?.split('-')[0];
         let remark = data[i].remark === undefined ? '' : data[i].remark;
       
         chk=true;
         if (modal) {
          setappHrsModalTextBulk('');
          setappHrsModalDataBulk(data);
          setappHrsModalBulk(true);
          return;
        }
     
         let apiData = {
           UserName: AppUserData?.data?.username,
           EmplID: data[i].EMPL_ID,
           HoursApproved: appHrsModalTextBulk,
           Status: type,
           Date: data[i].Date,
           Remarks: remark,
           Category:categoryNumber == undefined ? "":categoryNumber
         };
         console.log("apidatata",apiData)
         approvedItems.push(apiData);
     
         ApiService.PostMethode('/ApproveExtraWork', apiData, token, authContext)
           .then(result => {
             if (result == true) {
               GetPendingLeaveReq(Depart);
             } else {
               Toast.show('Failed');
             }
           })
           .catch(error => {
             stopLoader();
             
             ApiService.showErrorMessage(error, authContext);
           });
       }
     }
     
     // console.log($1);
     
    if(chk)
    {
      stopLoader();
      // console.log($1);
      Toast.show(" Leave Approved Successfully");
    }
    else{
      stopLoader();
      // console.log($1);
      Toast.show("Please select leave");
    }
    //// console.log($1);
   
  };
 
 
 
  const initialLoading = () => {
    //checkZZShift();
    GetDept();
   
   
  };



  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = initialLoading();
  //     return () => unsubscribe;
  //   }, []),
  // );
 
 
useFocusEffect(
  useCallback(() => {
    GetDept(); // Now handles both department and leave request fetching
  }, [])
);
 
 



  function test(index, item) {
    //PendingLeaveReq
    //setGetPendingLeaveReq([...PendingLeaveReq,{...item,Selected:!item.Selected}]);
    const pendingLeaveReqData = PendingLeaveReq.map(mem => {
      if (item.customKey === mem.customKey) {
        mem.selected = !item.selected;
      }
      return mem;
    });
 
    const isAllSelected = pendingLeaveReqData.every(item=>item.selected);
 
     
    setSelection(!isAllSelected);
 
    setGetPendingLeaveReq([...pendingLeaveReqData]);
    //console.log([...PendingLeaveReq,{...item,Selected:!item.Selected}])
    // setSelection(index)
    // console.log($1);
    // console.log($1);
   
  }
 
 
 
  // function selectAll() {
  //  setSelection(!isSelected);
  //   const pendingLeaveReqData = PendingLeaveReq.map(mem => {
  //     if(isSelected)
  //     {
  //       mem.selected = true;
  //     }
  //     else
  //     {
  //       mem.selected = false;
  //     }
   
 
  //     return mem;
  //   });
  //   //// console.log($1);
  //   setGetPendingLeaveReq([...pendingLeaveReqData]);
  //   // console.log($1);
   
   
  // }
 
 



  const ItemRenderLeave = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // console.log($1);
        setModalData(item);
        setLeaveDetailModal(!LeaveDetailModal);
      }}>
      <View style={[styles.itemColumn, {flex: 0.3}]}>
        <Text style={styles.itemText}>{item.EMPL_NAME}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.06}]}>
        <Text style={styles.itemText}>{item.EXTH_HOURS_APPROVED}</Text>
      </View>
      <View style={[styles.itemColumn, {flex: 0.25}]}>
        <Text style={styles.itemText}>{item.Date}</Text>
        {/* <Text style={styles.itemText}>{item['TO_DATE']}</Text> */}
      </View>
      <View style={styles.itemColumnButtons}>
        {/* <CheckBox
          disabled={false}
          value={item.selected}
          //   onValueChange={(newValue) => {
          //          console.log(newValue)
          //         toggle_Leave();
          //  }}
 
          onChange={() => test(!item.selected, item)}
          tintColors={{
            true: '#FF6347',
            false: GlobalColor.LightDark,
          }}
        /> */}
 
        <TouchableOpacity
          style={[styles.itemButton, {marginRight: 15}]}
          onPress={() => approveLeaveHrs(item,true)}>
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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.50}]}>
          Extra  Hours
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.40}]}>
          Date
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Approval
        </Text>
      </View>
    );
  };
 
 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight,marginBottom:100}}>
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
  <HeaderMgr title ="Extra Hours Approval"/>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          marginBottom: 5,
          paddingHorizontal: 10,
        }}>
       
      </View>
 
      <View style={{paddingHoriZontal: 10, flex: 1,}}>
      <View style={{flex: 1}}>
            <View style ={{flexDirection: 'row', justifyContent: 'flex-end',marginRight:20}}>
            <View style={{ width: '95%', paddingRight: 10,marginBottom:5 }}>
              <Text style={{ paddingHorizontal: 0, marginVertical: 5, fontSize: 13, fontWeight: 'bold' }}>
                Department {<Text style={{ color: 'red' }}>*</Text>}
              </Text>
              <SelectDropdown
                ref={bookingTypeDropdownRef}
                buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                defaultButtonText="Select Department"
                rowTextForSelection={(item) => item.label}
                dropdownBackgroundColor={'transparent'}
                data={allDept}
                onSelect={(selectedItem) => {
                  // console.log($1);
                  setDepart(selectedItem.value);
                  selectedItem.value == ''?null:GetPendingLeaveReq(selectedItem.value);
                  //setSelectedBookingType(selectedItem.value);
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => (
                  <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#FF6347'} size={14} />
                )}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
              />
            </View>
            {/* <View style={styles.checkboxContainer}>
           
              <CheckBox
                disabled={false}
                value={!isSelected}
                onChange={() => selectAll()}
                tintColors={{
                  true: '#FF6347',
                  false: GlobalColor.LightDark,
                }}
              />
              <Text Bold style={styles.checkboxText}>
                Select All
              </Text>
            </View> */}
            </View>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={PendingLeaveReq}
              renderItem={ItemRenderLeave}
              keyExtractor={item => item.id}
              ListHeaderComponent={FlatList_Header_Leave}
              ListHeaderComponentStyle={{
                borderBottomColor: '#FF6347',
                borderBottomWidth: 1,
              }}
              ListEmptyComponent={
                <ListEmptyComponent
                  title="No Data Found"
                  enableRefresh={true}
                  onRefreshCallback={() => GetPendingLeaveReq(Depart,true)}
                  refreshing={refresh}></ListEmptyComponent>
              }
            />
{/*
<View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
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
              // console.log($1);
              BulkApproveDone(PendingLeaveReq, 'A',true);
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
      </View> */}
 
          </View>
       
 
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
                 
                    <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Employee Name :{' '}
                    {modalData.EMPL_NAME}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Date :{' '}
                    {modalData.Date}
                  </Text>
 
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Extra Hours :{' '}
                    {modalData.EXTH_HOURS_CREATED }
                  </Text>
 
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Reimbursement Amount :{' '}
                    { modalData.ALLOW_AMT}
                  </Text>
 
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Allowance Category :{' '}
                    { modalData.ALLOW_CATG}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Source : {modalData.ALLOW_SOURCE}
                  </Text>
                 
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Allowance Description :{' '}
                    { modalData.ALLOW_DESC }
                  </Text>
                 
                 
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Approved Extra Hours : { modalData.EXTH_HOURS_APPROVED}
                  </Text>

                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Approved Quarter Hours : { modalData.APP_HRS}
                  </Text>
                 
                 
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                   
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
 
              <ButtonMgr
                title="Submit"
                onPress={() => {
                  if (!remarkModalText) {
                    Alert.alert('Error', 'Please enter remarks', [
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
 
        {/* Modal for Extra Hours  open*/}
 
        <Modal transparent={true} visible={appHrsModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setappHrsModal(!appHrsModal)}
                style={styles.modalClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={GlobalColor.Danger}
                />
              </TouchableOpacity>
 
              <View style={styles.inputBox}>
                <Text Bold style={styles.modalText}>
                  Enter Approved Hours
                </Text>
                <TextInput
                  placeholder="Enter Approved Hours"
                  keyboardType="numeric"  
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setappHrsModalText(text)}
                />
              </View>
 
              <ButtonMgr
                title="Submit"
                onPress={() => {
                  if (!appHrsModalText) {
                    Alert.alert('Error', 'Please enter hours', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setappHrsModal(!appHrsModal);
                    approveLeaveHrs(appHrsModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
     
 
         {/* Modal for Extra hours close */}
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
 
              <ButtonMgr
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




      {/* Extra Hours Bulk open */}
 
      <Modal transparent={true} visible={appHrsModalBulk}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() =>
                  {
                    setLoader(false);
                    setappHrsModalBulk(!appHrsModalBulk);
                   
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
                  Enter Approved Extra Hours
                </Text>
                <TextInput
                  placeholder="Enter Approved Extra Hours"
                  keyboardType="numeric"  
                  style={{
                    // width: '100%',
                    borderWidth: 1,
                    padding: 6,
                    fontSize: 13,
                    height: 40,
                    backgroundColor: '#fff',
                    borderColor: '#FF6347',
                  }}
                  onChangeText={text => setappHrsModalTextBulk(text)}
                />
              </View>
 
              <ButtonMgr
                title="Submit"
                onPress={() => {
                  if (!appHrsModalTextBulk) {
                    Alert.alert('Error', 'Please enter approved hours', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  }
                 
                   else {
                    setappHrsModalBulk(!appHrsModalBulk);
                    BulkApproveDone(appHrsModalDataBulk,"A");
                    //rejectLeave(remarkModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>



      {/* Extra Hours Bulk close */}
 
       
     
 
   
 
   {/* Model Leave Type */}
 
   <Modal
          backdropOpacity={0.1}
          coverScreen={true}
          visible={SublistModalVisibleType}>
          <View style={[styles.modal,{height:'auto'}]}>
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
                    // console.log($1);
 
                    // console.log($1);
                    setDefaultSubLeave(item.LeaveType);
 
                    {item.LeaveType == 'Flexi Time Adj.'?getShortfallReport(staff):null}
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
     
 
    </SafeAreaView>
  );
};
 
export default ExtraHoursApproval;
 
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: GlobalColor.White,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#FF6347',
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
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderBottomWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },
  itemText: {
    fontSize: 13,
  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#FF6347',
  },
  dropdown2BtnTxtStyle: { textAlign: 'left', fontSize: 14 },
  dropdown2DropdownStyle: { backgroundColor: GlobalColor.White },
  dropdown2RowStyle: { backgroundColor: GlobalColor.White, borderBottomColor: '#FF6347' },
  dropdown2RowTxtStyle: { textAlign: 'left', fontSize: 16 },
});