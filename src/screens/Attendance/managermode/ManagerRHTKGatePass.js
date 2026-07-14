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
import Button from '../../../components/reusable/Button';
import {CommonActions} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import { HeaderMgr } from '../../../components/reusable/HeaderMgr';


let emp_nem = '';
let authDrive_val = '';

export const ManagerFlexiShift = ({navigation}) => {
  const [flexiShift, setFlexiShift] = useState('');
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [PendingReportData, setPendingReportData] = useState([]);
  const [Empname, setEmpname] = useState([]);
  const [ReqId, setReqId] = useState([]);
  const [ReqDate, setReqDate] = useState([]);
  const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [AllReportData, setAllReportData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [approve, setApprove] = useState(0);
  const [PendingReportDataVSDT, setPendingReportDataVSDT] = useState([]);
  const [remarkModalText, setremarkModalText] = useState(false);
  const [remarkModalData, setremarkModalData] = useState(false);
  const [remarkModal, setremarkModal] = useState(false);
  const [VisitorDetailModal, setVisitorDetailModal] = useState(false);
  const [modalDataVisitor, setModalDataVisitor] = useState([]);
  const [AuthDriveVal, setAuthDriveVal] = useState('');
  const [superEmpId, setsuperEmpId] = useState('');
  const [superEname, setsuperEname] = useState('');
  const [AllReportData1, setAllReportData1] = useState([]);
  const [AllReportData2, setAllReportData2] = useState([]);
  const [AllReportData3, setAllReportData3] = useState([]);
  const [SuperReq, setSuperReq] = useState('');
  const [SelectedSpr, setSelectedSpr] = useState('');

  

  const [isSelected, setSelection] = useState(false);
  const [remarkModalTextEMP, setremarkModalTextEMP] = useState(false);
  const [remarkModalDataEMP, setremarkModalDataEMP] = useState(false);
  const [remarkModalEMP, setremarkModalEMP] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [superVision, setSuperVision] = useState([]);
  const [superVisionDef, setSuperVisionDef] = useState([]);
  const [VehData, setVehData] = useState([]);
  const [selectSuperVis, setselectSuperVis] = useState('');

  const [AuthVehData, setAuthVehData] = useState([]);
  const [selectAuthVeh, setSelectAuthVeh] = useState([]);
  const [isAuthVeh, setIsAuthVehShow] = useState(false);

  const [isSelectedEV, setSelectionEV] = useState(false);
  const [isSelectedFORK, setSelectionFORK] = useState(false);
  const [isSelectedLHD, setSelectionLHD] = useState(false);
  const [isSelectedRHD, setSelectionRHD] = useState(false);
  const [isSelectedALL, setSelectionALL] = useState(false);
  const [GetControlNoDet, setGetControlNoDet] = useState([]);

  const [VisName, setVisName] = useState([]);
  const [VenName, setVenName] = useState([]);

  const [ALLVEH, setALLVEH] = useState('');
  const [EV, setEV] = useState('');
  const [FORKLIFT, setFORKLIFT] = useState('');
  const [LHD, setLHD] = useState('');
  const [RHD, setRHD] = useState('');
  

  const [selctSprVsn, setSlctVsn] = useState(false);

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

  const SuperVisiors = [
    {
      label: 'Select',
      value: '',
    },
  ];

  const optionsAuth = [
    {
      label: 'ALL',
      value: 'RHD,LHD,EV,Forklift',
    },
    {
      label: 'RHD',
      value: 'RHD',
    },
    {
      label: 'LHD',
      value: 'LHD',
    },
    {
      label: 'EV',
      value: 'EV',
    },
    {
      label: 'Forklift',
      value: 'Forklift',
    },
  ];

  const stopLoader = () => {
    setLoader(false);
    setrefresh(false);
  };

  const GetAuthVehApi = () => {
    let userId = AppUserData?.data?.userId;
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      UserName: userId,
    };
// $&
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLGetAuthVeh', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
// $&
        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
// $&
        setAuthVehData(responseDataNew);
// $&
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        console.log("4",error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const RHTKGatePassPendReport = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let userNT = AppUserData?.data?.userNT;
    let apiData = {
      StaffNo: userId,
      Dept: '',
    };
    setLoader(true);

// $&

    ApiService.PostMethode('/RHTKEMPLGetPendRqst', apiData, token, authContext)
      .then(result => {
        stopLoader();
// $&
        let responseData = result.Value;
// $&
        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
// $&

        setPendingReportData(responseDataNew);

// $&
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        console.log("1",error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const RHTKControlNoDet = controlNum => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      ControlNo: controlNum,
      UserName: userId,
    };
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTControlNoDet', apiData, token, authContext)
      .then(result => {
        stopLoader();
// $&
        let responseData = result.Value;
// $&
        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });

       

       
        let VisitorDet = responseData.map(element => {
          // // console.log($1);
          // visNem = element['VISITOR NAME'];

          // VisAll = visNem + ","+ VisAll;
          // valAll = valAll.substring(",", valAll.length - 1);
          return element['VISITOR NAME'];
        });
        setVisName(VisitorDet);


        let VendorDet = responseData.map(element => {
          // // console.log($1);
          // visNem = element['VISITOR NAME'];

          // VisAll = visNem + ","+ VisAll;
          // valAll = valAll.substring(",", valAll.length - 1);
          return element['VENDOR NAME'];
        });
        setVenName(VendorDet);

        

     
        //// console.log($1);s
        setGetControlNoDet(responseDataNew);
// $&
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const RHTKPendReportVisitor = () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      UserName: userId,
      Search: '',
    };
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTPendAppList', apiData, token, authContext)
      .then(result => {
        stopLoader();
// $&
        let responseData = result.Value;
// $&
        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
// $&

        //// console.log($1);
        setPendingReportDataVSDT(responseDataNew);

// $&
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        console.log("2",error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const RHTKGatePassReportDetail = ReqId => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      StaffNo: userId,
      RQST_ID: ReqId,
    };
    setLoader(true);
    setLHD('');
    setRHD('');
    setEV('');
    setFORKLIFT('');
    setALLVEH('');

// $&
    ApiService.PostMethode('/RHTKEMPLGetData', apiData, token, authContext)
      .then(result => {
        stopLoader();

        let responseData = result.Value;
// $&
        let responseDataNew = responseData.Table.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
// $&
        console.log(
          ' All Report data----1---',
          responseDataNew[0].RQST_CONSENT,
        );
        if (responseDataNew[0].RQST_CONSENT == 'Y') {
          setSelection(true);
        } else {
          setSelection(false);
        }

        let responseDataNew1 = responseData.Table1.map(element => {
         return element['RQST_BULD_ID']
        });

// $&
        let responseDataNew2 = responseData.Table2.map(element => {
          return element['RQST_TSTK_ID']
        });

// $&

        let responseDataNew3 = responseData.Table3.map(element => {
          return {
            ...element,
            vehT: element.RQST_VEH_TYPE,
          };
        });

        var valAll = '';
        let authVehDta = responseData.Table3.filter(element => {
          let val = element.RQST_VEH_TYPE;

// $&
          //  valAll = val + ","+ valAll;
          if (val == 'LHD') {
            setLHD('LHD');
            setSelectionLHD(true);
          } else if (val == 'RHD') {
            setRHD('RHD');
            setSelectionRHD(true);
          } else if (val == 'EV') {
            setEV('EV');
            setSelectionEV(true);
          } else if (val == 'FORKLIFT') {
            setFORKLIFT('FORKLIFT');
            setSelectionFORK(true);
          } else if (val == 'ALL') {
            setEV('EV');
            setFORKLIFT('FORKLIFT');
            setLHD('LHD');
            setRHD('RHD');
            setSelectionLHD(true);
            setSelectionRHD(true);
            setSelectionEV(true);
            setSelectionFORK(true);
          }
          // valAll = valAll.substring(",", valAll.length - 1);
// $&
        }).map(obj => obj.LOVM_VALUE_CODE);

// $&
        // setALLVEH(responseDataNew3[0].vehT == 'ALL'?responseDataNew3[0].vehT:'')
        // setEV(responseDataNew3[0].vehT == 'EV'?responseDataNew3[0].vehT:'');
        // setFORKLIFT(responseDataNew3[0].vehT == 'FOREKLIFT'?responseDataNew3[0].vehT:'');
        // setLHD(responseDataNew3[0].vehT == 'LHD'?responseDataNew3[0].vehT:'');
        // setRHD(responseDataNew3[0].vehT == 'RHD'?responseDataNew3[0].vehT:'');
// $&

        setVehData(responseDataNew3);

        let responseOpt = responseData.Table.map(element => {
          return {
            label: element.RQST_SUP_REQD == 'N' ? 'NO' : 'YES',
            value: element.RQST_SUP_REQD == 'N' ? 'N' : 'Y',
          };
        });
// $&
        setSuperVisionDef(responseOpt);

        //// console.log($1);
        setAllReportData(responseDataNew);

        setAllReportData1(responseDataNew1);
        setAllReportData2(responseDataNew2);
        setAllReportData3(responseDataNew3);

// $&
// $&

// $&
// $&
// $&
// $&
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const rejectVSDTGatePass = (data, modal = false) => {
    if (modal) {
      setremarkModalText('');
      setremarkModalData(data);
      setremarkModal(true);
      return;
    }

    let newData = data;
    newData.remark = remarkModalText;

    Alert.alert('Reject', 'Are you sure to Reject ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => GatepassARVSDT(newData, 'R')},
    ]);
  };
  const rejectGatePass = data => {
    Alert.alert('Reject', 'Are you sure to Reject ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => GatepassAR(data, 'REJECT')},
    ]);
  };

  const approveGatePass = data => {
    var val = '';
    var valAll = '';

    let authVehDta = VehData.filter(element => {
      val = element.RQST_VEH_TYPE;

      valAll = val + ',' + valAll;
      // valAll = valAll.substring(",", valAll.length - 1);
// $&
    }).map(obj => obj.LOVM_VALUE_CODE);

// $&
// $&
// $&
// $&

    if (isSelectedEV == false) {
      setEV('');
    } else if (isSelectedLHD == false) {
      setLHD('');
    } else if (isSelectedRHD == false) {
      setRHD('');
    } else if (isSelectedFORK == false) {
      setFORKLIFT('');
    }

    //  let authDrive_val =   isSelectedEV ==false || isSelectedFORK == false || isSelectedLHD == false || isSelectedRHD == false?valAll:EV+LHD+RHD+FORKLIFT;
    // let authDrive_val = '';
    // if (isSelectedEV == true) {
    //   authDrive_val = EV + authDrive_val;
    // }
    // if (isSelectedFORK == true) {
    //   authDrive_val = FORKLIFT + authDrive_val;
    // }

    // if (isSelectedLHD == true) {
    //   authDrive_val = LHD + authDrive_val;
    // }

    // if (isSelectedRHD == true) {
    //   authDrive_val = RHD + authDrive_val;
    // }

    // // console.log($1);
// $&
    // if(isSelected == true && authDrive_val == '')
    // {
    //   Toast.show("Please select at least one item from Authorize to drive.");
    // }
    // else if(isSelected == false && authDrive_val != '')
    // {
    //   Toast.show("Please tick mark on consent as you are authorizing to drive at R&D center.");
    // }

    // else{
    // Toast.show("Every Think is Good");
   

    Alert.alert('Approve', 'Are you sure to Approve ?', [
      {
        text: 'Cancel',
        onPress: () => {
          setselectSuperVis('');
          setSlctVsn(false);
        },
        style: 'cancel',
      },
      {text: 'OK', onPress: () => GatepassAR(data, 'APPROVE')},
    ]);


  };

  const approveGatePassVSDT = data => {
    Alert.alert('Approve', 'Are you sure to Approve ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => GatepassARVSDT(data, 'A')},
    ]);
  };

  const GatepassAR = (data, type) => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let userNT = AppUserData?.data?.userNT;

    var val = '';
    var valAll = '';
    let authVehDta = VehData.filter(element => {
      val = element.RQST_VEH_TYPE;

      valAll = val + ',' + valAll;
      // valAll = valAll.substring(",", valAll.length - 1);
// $&
    }).map(obj => obj.LOVM_VALUE_CODE);


    let authDrive_val = '';
    if(isSelectedALL == true)
    {
// $&
          authDrive_val = "EV , LHD , RHD , FORKLIFT";
    }

    else
    {
      if (isSelectedEV == true) {
        authDrive_val = EV + " " +authDrive_val;
      }
      if (isSelectedFORK == true) {
        authDrive_val = FORKLIFT + " " + authDrive_val;
      }
  
      if (isSelectedLHD == true) {
        authDrive_val = LHD + " " + authDrive_val;
      }
  
      if (isSelectedRHD == true) {
        authDrive_val = RHD + " " + authDrive_val;
      }
  
    }
    
// $&


    let apiData = {
      RequestID: AllReportData[0].RQST_ID,
      StaffNo: userNT,
      FromDate: moment(AllReportData[0].RQST_FROM_DATE).format('MMM Do YYYY'),
      ToDate: moment(AllReportData[0].RQST_TO_DATE).format('MMM Do YYYY'),
      Name:
        AllReportData[0].RQST_EMPL_NAME != ''
          ? AllReportData[0].RQST_EMPL_NAME
          : '',
      Desg: AllReportData[0].RQST_DESG != '' ? AllReportData[0].RQST_DESG : '',
      Dept:
        AllReportData[0].RQST_DEPT_CODE != ''
          ? AllReportData[0].RQST_DEPT_CODE
          : '',
      Divn:
        AllReportData[0].RQST_DIVN_CODE != ''
          ? AllReportData[0].RQST_DIVN_CODE
          : '',
      Vert:
        AllReportData[0].RQST_DIRC_CODE != ''
          ? AllReportData[0].RQST_DIRC_CODE
          : '',
      Lisence:
        AllReportData[0].RQST_LSCN != ''
          ? AllReportData[0].RQST_LSCN == null
            ? ''
            : AllReportData[0].RQST_LSCN
          : '',
      VehRegNo:
        AllReportData[0].RQST_REGN != ''
          ? AllReportData[0].RQST_REGN == null
            ? ''
            : AllReportData[0].RQST_REGN
          : '',
      DQRFlag:
        AllReportData[0].RQST_DQR == 'Y' ? AllReportData[0].RQST_DQR : 'N',
      Puprose:
        AllReportData[0].RQST_PURPOSE != ''
          ? AllReportData[0].RQST_PURPOSE
          : '',
      Building:
        AllReportData1 != ' '
          ? AllReportData1.join(',')
          : '',
      TestTrack:
        AllReportData2 != ' ' ? AllReportData2.join(','):' ',
      ConsentEmpl:
        AllReportData[0].RQST_CONSENT == 'Y'
          ? AllReportData[0].RQST_CONSENT
          : 'N', //   Required to drive vehicle in R&D Centre
      Activity:
        AllReportData[0].RQST_ACTIVITY != ''
          ? AllReportData[0].RQST_ACTIVITY
          : '',
      SupervisorReq: SuperReq == 'Y' ? 'Y' : 'N',
      // AllReportData[0].RQST_SUP_REQD == 'Y'?AllReportData[0].RQST_SUP_REQD:'N',
      SupervisorRemarks:
        SuperReq == 'N' ? inputValue : AllReportData[0].RQST_SUP_REQD,
      SupervisorID:
      SuperReq == 'Y'?SelectedSpr:'',
        // AllReportData[0].RQST_SUP_REQD == 'Y'
        //   ? AllReportData[0].RQST_SUP_ID == null
        //     ? ''
        //     : AllReportData[0].RQST_SUP_ID
        //   : ' ',
      AuthVehicle:authDrive_val,
        // isSelectedEV == false ||
        // isSelectedFORK == false ||
        // isSelectedLHD == false ||
        // isSelectedRHD == false
        //   ? valAll
        //   : EV + ' ' + LHD + ' ' + RHD + ' ' + FORKLIFT + ' ', // veh nem
      ConsentApp: isSelected == true ? 'Y' : 'N', // authorised to drive
      Status: type,
    };
    setLoader(true);
// $&
// $&
// $&
    ApiService.PostMethode('/UpdateRequest', apiData, token, authContext)
      .then(result => {
// $&
console.log(result);
        stopLoader();
        if (result.Value == '' && type == 'APPROVE') {
          //Toast.show('Gatepass Approved Successfully');
          Alert.alert("Gatepass Approved Successfully");
                      setselectSuperVis('');
                      setSlctVsn(false);
          RHTKGatePassPendReport();
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ManagerMode',
            }),
          );
        } else if (result.Value != '' && type == 'REJECT') {
          //Toast.show(result.Value);
          Alert.alert(result.Value);
          //setSlctVsn(false);
          RHTKGatePassPendReport();
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ManagerMode',
            }),
          );
        } else {
          Toast.show(result.Value);
        }
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GatepassARVSDT = (data, type) => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData.token;
    let apiData = {
      UserName: userId,
      ControlNo: data.VGPE_CONTROL_NO,
      ApprovalFlag: type,
      RejectionRemarks: data.remark != undefined ? data.remark : '',
    };
    setLoader(true);

// $&

    ApiService.PostMethode(
      '/RHTKVSTUpdateVGPEStat',
      apiData,
      token,
      authContext,
    )
      .then(result => {
// $&
        stopLoader();
        if (result.Value == '') {
          if (type == 'A') {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ManagerMode',
              }),
            );
            RHTKPendReportVisitor();
            Alert.alert("Gatepass Approved Successfully");
            //Toast.show('Gatepass Approved Successfully');
          } else {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ManagerMode',
              }),
            );
            RHTKPendReportVisitor();
            Alert.alert("Gatepass Reject Successfully");
            //Toast.show('Gatepass Reject Successfully');
          }
        } else {
          Toast.show('Failed');
        }
        //RHTKGatePassPendReport();
      })
      .catch(error => {
        stopLoader();
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetSupDetail_Api = () => {
    const userId = AppUserData?.data?.userId;
    const userDept = AppUserData?.data?.userDept;
  
    const apiData = {
      StaffNo: userId,
      Dept: userDept,
    };
  
    const token = AppUserData?.token;
  
    setLoader(true);
  
    ApiService.PostMethode('/RHTKEMPLSupDetails', apiData, token, authContext)
      .then(result => {
        setLoader(false);
  
        const responseData = result?.Value || [];
  
        if (responseData.length === 0) {
          console.warn('No supervisor details found');
          setSuperVision([]);
          setsuperEmpId(null);
          setsuperEname('');
          return;
        }
  
        const responseDataNew = responseData.map(element => ({
          label: element.EMPL_NAME,
          value: element.DEP_EMPL_ID,
        }));
  
        setSuperVision(responseDataNew);
        setsuperEmpId(responseData[0].DEP_EMPL_ID);
        setsuperEname(responseData[0].EMPL_NAME);
      })
      .catch(error => {
        setLoader(false);
        console.log('GetSupDetail_Api Error:', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  

  const toggleAuthVeh = () => {
    setIsAuthVehShow(!isAuthVeh);
  };

  const handleApprove = index => {
    setApprove(index);
  };

  //  useEffect(() => {
  //   //RHTKGatePassPendReport();
  //   RHTKGatePassReportDetail();
  //   }, []);

  const initialLoading = () => {
    RHTKGatePassPendReport();
    RHTKPendReportVisitor();
    GetSupDetail_Api();
    GetAuthVehApi();
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = initialLoading();
      return () => unsubscribe;
    }, []),
  );

  const ItemRender = ({item}) => (
    <TouchableOpacity
      onPress={() => {
// $&
// $&
// $& .  
          console.log("--",item);
        authDrive_val = '';
        RHTKGatePassReportDetail(item['Request ID']);
        setLeaveDetailModal(!LeaveDetailModal);
        setModalData(item);
        setInputValue('');
// $&
        isSelectedFORK == true ? setSelectionFORK(false) : null;
        isSelectedLHD == true ? setSelectionLHD(false) : null;
        isSelectedRHD == true ? setSelectionRHD(false) : null;
        isSelectedEV == true ? setSelectionEV(false) : null;
        isSelectedALL == true ? setSelectionALL(false) : null;
        isSelected == true ? setSelection(false) : null;

// $&
// $&
      }}>
      <View style={styles.item}>
        <View style={[styles.itemColumn, {flex: 0.4}]}>
          <Text style={styles.itemText}>{item['Employee Name']}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemText}>{item['Request ID']}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemText}>{item['Request Date']}</Text>
        </View>
        {/* <View style={styles.itemColumn}>
         <Text style={styles.itemText}>{item['Status']}</Text>
       </View> */}
        {/* <View style={styles.itemColumnButtons}>  
            <TouchableOpacity style={[styles.itemButton, {marginRight:10}]} onPress={()=>approveGatePass(item)}>
                <Ionicons name='checkmark-done-sharp' size={18} color={GlobalColor.Primary}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemButton} onPress={()=>rejectGatePass(item)}>
                <Ionicons name='close-sharp' size={18} color={GlobalColor.Danger}/>
            </TouchableOpacity>         
       </View>       */}
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
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
          Name
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Req. Id
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Date
        </Text>
        {/* <Text Bold style={[styles.HeaderColumn,{flex:0.40}]}>Status</Text> */}
        {/* <Text Bold style={styles.HeaderColumn}>Approval</Text> */}
      </View>
    );
  };

  const FlatList_HeaderVisitor = () => {
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
          Name
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Control No.{' '}
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Date
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Approval
        </Text>
      </View>
    );
  };

  const ItemRenderVisitor = ({item}) => (
    <TouchableOpacity
      onPress={() => {
// $&
// $&

        RHTKControlNoDet(item.VGPE_CONTROL_NO);

        setVisitorDetailModal(!VisitorDetailModal);
        setModalDataVisitor(item);
      }}>
      <View style={styles.item}>
        <View style={[styles.itemColumn, {flex: 0.4}]}>
          <Text style={styles.itemText}>{item.REQUESTED_BY}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemText}>{item.VGPE_CONTROL_NO}</Text>
        </View>
        <View style={styles.itemColumn}>
          <Text style={styles.itemText}>{item.REQUESTED_ON}</Text>
        </View>
        <View style={styles.itemColumnButtons}>
          <TouchableOpacity
            style={[styles.itemButton, {marginRight: 10}]}
            onPress={() => approveGatePassVSDT(item)}>
            <Ionicons
              name="checkmark-done-sharp"
              size={18}
              color={GlobalColor.Primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemButton}
            onPress={() => rejectVSDTGatePass(item, true)}>
            <Ionicons name="close-sharp" size={18} color={GlobalColor.Danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight}}>
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
 <HeaderMgr title ="Rohtak Gatepass Approval"/>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          marginBottom: 5,
          paddingHorizontal: 10,
        }}>
        <SegmentedControlTab
          borderRadius={0}
          values={['Employee Gatepass', 'Visitor Gatepass']}
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
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
              <FlatList
                contentContainerStyle={{flex: 1, marginBottom: 30, flexGrow: 1}}
                data={PendingReportData}
                renderItem={ItemRender}
                keyExtractor={item => item.RQST_ID}
                ListHeaderComponent={FlatList_Header}
                ListHeaderComponentStyle={{
                  borderBottomColor: '#FF6347',
                  borderBottomWidth: 1,
                }}
                ListEmptyComponent={
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() => FlexiShiftPendAppLOV(true)}
                    refreshing={refresh}></ListEmptyComponent>
                }
              />
            </ScrollView>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
              <FlatList
                contentContainerStyle={{flex: 1}}
                data={PendingReportDataVSDT}
                renderItem={ItemRenderVisitor}
                keyExtractor={item => item.RQST_ID}
                ListHeaderComponent={FlatList_HeaderVisitor}
                ListHeaderComponentStyle={{
                  borderBottomColor: '#FF6347',
                  borderBottomWidth: 1,
                }}
                ListEmptyComponent={
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() => FlexiShiftPendAppLOV(true)}
                    refreshing={refresh}></ListEmptyComponent>
                }
              />
            </ScrollView>
          </View>
        )}

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
                    borderColor: '#43C6DB',
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
                    rejectVSDTGatePass(remarkModalData);
                  }
                }}
              />
            </View>
          </View>
        </Modal>

        {/* EMPLOYEE MODEL */}

        <Modal transparent={true} visible={remarkModalEMP}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setremarkModalEMP(!remarkModalEMP)}
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
                    borderColor: '#43C6DB',
                  }}
                  onChangeText={text => setremarkModalTextEMP(text)}
                />
              </View>

              <Button
                title="Submit"
                onPress={() => {
                  if (!remarkModalTextEMP) {
                    Alert.alert('Error', 'Please enter remark', [
                      {
                        text: 'Okay',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    setremarkModalEMP(!remarkModalEMP);
                    rejectGatePass(remarkModalDataEMP);
                  }
                }}
              />
            </View>
          </View>
        </Modal>

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
                height:'70%'
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  paddingVertical: 5,
                  borderBottomWidth:0.5
                }}>
                <Text
                  Bold
                  style={{
                    fontSize: 15,
                    color:'#43C6DB',
                    textDecorationLine:'underline'
                  }}>
                  Employee GatePass Detail
                </Text>

                <TouchableOpacity
                  onPress={() => 
                    {
                      setLeaveDetailModal(!LeaveDetailModal)
                      setselectSuperVis('');
                      setSlctVsn(false);
                    }
                 
                  }>
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
              style = {{marginTop:5}}>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  {/* <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Track License No. :{' '}
                    {AllReportData == '' ? '' : AllReportData[0].RQST_LSCN}
                  </Text> */}
                  {/* <Text style={{ fontWeight: "600",fontSize:13, marginVertical: 12 }}>
                          Commuting Veh. Reg. No  : {AllReportData == ''?'':AllReportData[0].RQST_REGN}
                          </Text> */}

                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    From Date * :{' '}
                    {moment(
                      AllReportData == ''
                        ? ''
                        : AllReportData[0].RQST_FROM_DATE,
                    ).format('MMM Do YYYY')}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    To Date :{' '}
                    {moment(
                      AllReportData == '' ? '' : AllReportData[0].RQST_TO_DATE,
                    ).format('MMM Do YYYY')}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Supervision Required :{' '}
                    {AllReportData == ''
                      ? ''
                      : AllReportData[0].RQST_SUP_REQD == 'Y'
                      ? 'Yes'
                      : 'No'}
                  </Text>

                  <View
                    style={{
                      width: '48%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text Bold
                      style={{
                        paddingHorizontal: 0,
                        paddingVertical: 5,
                        fontSize: 13,
                        marginRight: 10,
                      }}>
                      Supervision Required
                    </Text>
                    <SelectDropdown
                      buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem.label;
                      }}
                      defaultValue={superVisionDef}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item.label;
                      }}
                      data={options}
                      
                      onSelect={(selectedItem, index) => {
                        // // console.log($1);
// $&
// $&
                        setSlctVsn(true);
                        setSuperReq(selectedItem.value);
// $&
                        //  setFieldValue('SPRFLAG', selectedItem);
                        //setFieldValue('internalVehical', selectedItem);
                      }}
                      buttonStyle={styles.dropdown2BtnStyle}
                      buttonTextStyle={styles.dropdown2BtnTxtStyle}
                      renderDropdownIcon={isOpened => {
                        return (
                          <FontAwesome
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#43C6DB'}
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
                  {SuperReq == 'Y' ? (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginVertical: 10,
                        height: 75,
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 0,
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Name
                      </Text>

                      <SelectDropdown
                        buttonTextAfterSelection={(selectedItem, index) => {
                          // text represented after item is selected
                          // if data array is an array of objects then return selectedItem.property to render after item is selected
                          return selectedItem.label;
                        }}
                        defaultValue={SuperVisiors}
                        rowTextForSelection={(item, index) => {
                          // text represented for each item in dropdown
                          // if data array is an array of objects then return item.property to represent item in dropdown
// $&
                          return item.label;
                        }}
                        data={superVision}
                        onSelect={(selectedItem, index) => {
                          // // console.log($1);
// $&
// $&
                          setselectSuperVis(selectedItem.label);

// $&
                          setSelectedSpr(selectedItem.value);
                          // setSuperVision(selectedItem);
// $&
                          //setFieldValue('SPRFLAG', selectedItem);
                          //setFieldValue('internalVehical', selectedItem);
                        }}
                        buttonStyle={styles.dropdown2BtnStyle}
                        buttonTextStyle={styles.dropdown2BtnTxtStyle}
                        renderDropdownIcon={isOpened => {
                          return (
                            <FontAwesome
                              name={isOpened ? 'chevron-up' : 'chevron-down'}
                              color={'#43C6DB'}
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
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginVertical: 10,
                        height: 95,
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 0,
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                        Justification Remarks
                      </Text>
                      <Text
                        style={{
                          paddingHorizontal: 0,
                          fontSize: 13,
                        }}>
                        {`(To be filled by DPM if Supervisor in not required)`}
                      </Text>
                      <TextInput
                        value={inputValue}
                        editable={true}
                        onChangeText={text => setInputValue(text)}
                        maxLength={200}
                        style={{
                          marginVertical: 10,
                          width: '100%',
                          borderWidth: 1,
                          paddingVertical: 10,
                          alignSelf: 'center',
                          borderRadius: 8,
                          backgroundColor: GlobalColor.White,
                          borderColor: '#43C6DB',
                          fontSize: 13,
                          height: 100,
                        }}
                      />
                    </View>
                  )}
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Purpose :{' '}
                    {AllReportData == '' ? '' : AllReportData[0].RQST_PURPOSE}
                  </Text>

                  {/* <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    DQR : {AllReportData == '' ? '' : AllReportData[0].RQST_DQR}
                  </Text> */}

                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Building Name :{' '}
                    {AllReportData1 == '' ? '' : AllReportData1.join(',')}
                  </Text>

                  {/* <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Test Track :{' '}
                    {AllReportData2 == '' ? '' : AllReportData2.join(',')}
                  </Text> */}

                  {/* <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 13,
                      marginVertical: 8,
                    }}>
                    Activities to be done :{' '}
                    {AllReportData == '' ? '' : AllReportData[0].RQST_ACTIVITY}
                  </Text> */}

                  {/* <Text style={{ fontWeight: "600",fontSize:13, marginVertical: 8 }}>
                          Authorized to Drive : {AllReportData3 == ''?'':AllReportData3[0].RQST_VEH_TYPE}
                          </Text> */}

                  <View
                    style={{width: '100%', alignSelf: 'center', marginTop: 10}}>
                    <Text
                      style={{
                        paddingHorizontal: 0,
                        marginVertical: 5,
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      Required to Drive
                    </Text>
                    <View style={{flexDirection: 'row', paddingVertical: 8}}>
                      <View style={styles.checkboxContainermy}>
                        <CheckBox
                          disabled={false}
                          value={isSelectedALL}
                          boxType="square"
                          // onChange={() => selectAll()}
                          onValueChange={newValue => {
                            setSelectionALL(newValue);
                            setSelectionEV(newValue);
                            setSelectionLHD(newValue);
                            setSelectionRHD(newValue);
                            setSelectionFORK(newValue);
                            //selectAll();
// $&
// $&
                          }}
                          style={{ height: 20, width: 20, marginRight:5 }}
                          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                          onCheckColor={GlobalColor.Secondary}
                          onTintColor={GlobalColor.Secondary}
                        />
                        <Text style={styles.checkboxText}>ALL</Text>
                      </View>
                      <View style={styles.checkboxContainermy}>
                        <CheckBox
                          disabled={false}
                          value={
                            isSelectedALL == true || EV != ''
                              ? true
                              : isSelectedEV
                          }
                          boxType="square"
                          onValueChange={newValue => {
                            setSelectionEV(newValue);
                            newValue == true ? setEV('EV') : setEV('');
// $&
                          }}
                          style={{ height: 20, width: 20, marginRight:5 }}
                          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                          onCheckColor={GlobalColor.Secondary}
                          onTintColor={GlobalColor.Secondary}
                        />
                        <Text style={styles.checkboxText}>EV</Text>
                      </View>

                      <View style={styles.checkboxContainermy}>
                        <CheckBox
                          disabled={false}
                          value={
                            isSelectedALL == true || FORKLIFT != ''
                              ? true
                              : isSelectedFORK
                          }
                          boxType="square"
                          onValueChange={newValue => {
                            setSelectionFORK(newValue);
                            newValue == true
                              ? setFORKLIFT('FORKLIFT')
                              : setFORKLIFT('');
// $&
                          }}
                          style={{ height: 20, width: 20, marginRight:5 }}
                          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                          onCheckColor={GlobalColor.Secondary}
                          onTintColor={GlobalColor.Secondary}
                        />
                        <Text style={styles.checkboxText}>FORKLIFT</Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', paddingVertical: 8}}>
                      <View style={styles.checkboxContainermy}>
                        <CheckBox
                          disabled={false}
                          value={
                            isSelectedALL == true || LHD != ''
                              ? true
                              : isSelectedLHD
                          }
                          boxType="square"
                          onValueChange={newValue => {
                            setSelectionLHD(newValue);
                            newValue == true ? setLHD('LHD') : setLHD('');
// $&
                          }}
                          style={{ height: 20, width: 20, marginRight:5 }}
                          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                          onCheckColor={GlobalColor.Secondary}
                          onTintColor={GlobalColor.Secondary}
                        />
                        <Text style={styles.checkboxText}>LHD</Text>
                      </View>
                      <View style={styles.checkboxContainermy}>
                        <CheckBox
                          disabled={false}
                          value={
                            isSelectedALL == true || RHD != ''
                              ? true
                              : isSelectedRHD
                          }
                          boxType="square"
                          onValueChange={newValue => {
                            setSelectionRHD(newValue);
                            newValue == true ? setRHD('RHD') : setRHD('');
// $&
                          }}
                          style={{ height: 20, width: 20, marginRight:5 }}
                          tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                          onCheckColor={GlobalColor.Secondary}
                          onTintColor={GlobalColor.Secondary}
                        />
                        <Text style={styles.checkboxText}>RHD</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      disabled={false}
                      boxType="square"
                      value={AllReportData == '' ? isSelected : isSelected}
                      onValueChange={newValue => {
                        setSelection(newValue);
                        // newValue ==true?setLHD('LHD'):setLHD('');
// $&
                        console.log(
                          'Authorized to Drive in R&D Centre',
                          newValue,
                        );
                      }}
                      style={{ height: 20, width: 20, marginRight:5 }}
                      tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                      onCheckColor={GlobalColor.Secondary}
                      onTintColor={GlobalColor.Secondary}
                    />
                    <Text style={styles.checkboxText}>
                      Authorized to Drive in R&D Centre
                    </Text>
                  </View>

                
                </View>
              </View>
              </ScrollView>
              <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      borderTopWidth:0.5
                    }}>
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: '#43C6DB',
                        minWidth: 100,
                        marginTop:10
                      }}
                      onPress={() => {
// $&
// $&
// $&
                        if(selctSprVsn == false)
                        {
                          //selectSuperVis == '' && 
// $&
                          Toast.show('Please Select Supervision Required');
                        }

                       else if (SuperReq == 'N' && inputValue == '') {
// $&
                          setLeaveDetailModal(LeaveDetailModal);
                          Toast.show('Please fill Justification');
                          console.log(
                            'Value Super In Approve ',
                            selectSuperVis,
                          );
// $&
// $&
// $&
// $&
// $&
// $&
                        }
                         else if (SuperReq == 'Y' && selectSuperVis == '') {
                          setLeaveDetailModal(LeaveDetailModal);
                          Toast.show('Please Provide Supervisior Name');
                          console.log(
                            'Value Super In Approve ',
                            selectSuperVis,
                          );
// $&
// $&
// $&
// $&
// $&
// $&
                        } 
                        else if (
                          (isSelectedEV == true ||
                            isSelectedFORK == true ||
                            isSelectedLHD == true ||
                            isSelectedRHD == true) &&
                          isSelected == false
                        ) {
// $&
// $&
// $&
// $&
// $&
// $&
                          setLeaveDetailModal(LeaveDetailModal);
                          Toast.show(
                            'Please tick mark on consent as you are authorizing to drive at R&D center.',
                          );
                        } else if (
                          isSelectedEV == false &&
                          isSelectedFORK == false &&
                          isSelectedLHD == false &&
                          isSelectedRHD == false &&
                          isSelected == true
                        ) {
                          setLeaveDetailModal(LeaveDetailModal);
                          Toast.show(
                            'Please select at least one item from Authorize to drive.',
                          );
// $&
// $&
// $&
// $&
// $&
// $&
                        }

                        // else{
                        //   // console.log($1);
                        //   // console.log($1);
                        // }
                        else {
// $&
// $&
// $&
                          approveGatePass(AllReportData[0]);
                          setLeaveDetailModal(!LeaveDetailModal);
                        }
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Approve
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        marginLeft: 10,
                        borderRadius: 5,
                        backgroundColor: '#43C6DB',
                        minWidth: 100,
                        marginTop:10
                      }}
                      onPress={() => {
                        if (SuperReq == 'N' && inputValue == '') {
                          setLeaveDetailModal(LeaveDetailModal);
// $&
                          Toast.show('Please fill Justification');
                        }

                        // else if(SuperReq ==  'Y' && selectSuperVis == '')
                        // {

                        //   setLeaveDetailModal(LeaveDetailModal)
                        //   Toast.show("Please Provide Supervisior Name");
                        //   // console.log($1);
                        //   // console.log($1);
                        else if (
                          (isSelectedEV == true ||
                            isSelectedFORK == true ||
                            isSelectedLHD == true ||
                            isSelectedRHD == true) &&
                          isSelected == false
                        ) {
                          setLeaveDetailModal(LeaveDetailModal);
                          Toast.show(
                            'Please tick mark on consent as you are authorizing to drive at R&D center.',
                          );
                        } else if (
                          isSelectedEV == false &&
                          isSelectedFORK == false &&
                          isSelectedLHD == false &&
                          isSelectedRHD == false &&
                          isSelected == true
                        ) {
                          setLeaveDetailModal(LeaveDetailModal);

                          Toast.show(
                            'Please select at least one item from Authorize to drive.',
                          );
                        } else {
// $&
// $&
                          rejectGatePass(AllReportData[0]);
                          setLeaveDetailModal(!LeaveDetailModal);
                        }
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          fontSize: 13,
                        }}
                        Bold>
                        Reject
                      </Text>
                    </TouchableOpacity>
                  </View>
            </View>
            
          </View>
        
        </Modal>

        <Modal transparent={true} visible={VisitorDetailModal}>
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
                height:'70%'
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  paddingVertical: 5,
                  borderBottomWidth:0.5
                }}>
                <Text
                  Bold
                  style={{
                    fontSize: 15,
                    color:'#43C6DB',
                    textDecorationLine:'underline'
                  }}>
                  Visitor GatePass Detail
                </Text>

                <TouchableOpacity
                  onPress={() => setVisitorDetailModal(!VisitorDetailModal)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={23}
                    color={GlobalColor.Danger}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
              style = {{marginTop:5}}>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    Control No. :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['CONTROL NO']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    VISIT DATE START :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['VISIT DATE START']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    VISIT DATE END :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['VISIT DATE END']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    VISITING AREA :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['VISITING AREA']}
                  </Text>

                  {/* <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    TEST TRACK DRIVING REQUIRED :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['TEST TRACK DRIVING REQUIRED']}
                  </Text> */}

                  {/* <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    TEST TRACK NAME :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['TEST TRACK NAME']}
                  </Text> */}

                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    PURPOSE OF VISIT :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['TEST TRACK NAME']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    EXP ARRIVAL TIME :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['EXP ARRIVAL TIME']}
                  </Text>

                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    GATEPASS DURATION :{' '}
                    {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['GATEPASS DURATION']}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginVertical: 8,
                    }}>
                    Requested By :{' '}
                    {GetControlNoDet == '' ? '' : GetControlNoDet[0]['SPON BY']}
                  </Text>
                  {VisName.map((person, index) => (
                    <Text
                      key={index}
                      style={{
                        fontWeight: '700',
                        fontSize: 12,
                        marginVertical: 8,
                      }}>
                      Visitor Name {index + 1} : {person}
                      {/* {GetControlNoDet == ''
                      ? ''
                      : GetControlNoDet[0]['VISITOR NAME']} */}
                    </Text>
                  ))}

                

                   {VenName.map((vendor, index) => (
                    <Text
                      key={index}
                      style={{
                        fontWeight: '700',
                        fontSize: 12,
                        marginVertical: 8,
                      }}>
                      Vendor Name {index + 1} : {vendor}
                     
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
                      borderTopWidth:0.5
                    }}>
                   
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderRadius: 5,
                        backgroundColor: '#43C6DB',
                        minWidth: 100,
                        marginTop:10
                      }}
                      onPress={() => {
                        setVisitorDetailModal(!VisitorDetailModal);
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
        
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ManagerFlexiShift;

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
  itemText: {
    fontSize: 11,
  },
  itemColumn: {
    flex: 0.25,
    justifyContent: 'center',
  },

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
  modalText: {
    marginBottom: 20,
    fontSize: 13,
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 9,
  },

  checkboxContainermy: {
      width: '30%',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 9,
  },

  modalClose: {
    right: 5,
    top: 5,
    position: 'absolute',
    zIndex: 55555555,
  },
  itemButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GlobalColor.PrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    height: 100,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 30,
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
  modalView: {
    position: 'relative',
    width: '90%',
    backgroundColor: GlobalColor.White,
    padding: 20,
    // minHeight:200
  },
  tabStyle: {
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#FF6347',
    marginTop: 5,
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
  itemColumnButtons: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 13,
  },
  spinnerTextStyle: {
    color: '#fff',
  },
});
