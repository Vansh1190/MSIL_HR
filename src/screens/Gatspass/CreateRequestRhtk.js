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
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
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
import Toast from 'react-native-simple-toast'
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
import { CommonActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { visitIterationBody } from 'typescript';

const CreateRequestRhtk = ({navigation}) => {

   let userDep ='';
  let formatDet = new Date();


  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [searchLevel] = useState();
  const [superVision, setSuperVision] = useState([]);
  const [loader, setLoader] = useState(false);
  const [textinputSecondDate, setTextinputSecondDate] = useState('');
  const [isSuprVis, setisSuprVis] = useState(false);
  const [isSelected, setSelection] = useState(false);
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
      label: 'No-Data',
      value: 'No-Data',
    },
    
  ];

  const optionsAuthDrive = [
    {
      label: 'Select',
      value: '',
    },
    {
      label: 'ALL',
      value: 'RHD,LHD,EV,Forklift',
    },
    {
      label: 'EV',
      value: 'EV',
    },
    {
      label: 'Forklift',
      value: 'Forklift',
    },
    {
      label: 'LHD',
      value: 'LHD',
    },
    {
      label: 'RHD',
      value: 'RHD',
    },
  ];

  const Purpose = [
    {
      label: 'Select',
      value: '',
    },
    {
      label: 'PART TESTING',
      value: 'PART TESTING',
    },
    {
      label: 'AMC',
      value: 'AMC',
    },
    {
      label: 'MEETING',
      value: 'MEETING',
    },
    {
      label: 'JOINT ANALYSIS',
      value: 'JOINT ANALYSIS',
    },
    {
      label: 'VEHICLE TESTING',
      value: 'VEHICLE TESTING',
    },
    {
      label: 'FACILITY INSPECTION',
      value: 'FACILITY INSPECTION',
    },
    {
      label: 'AUDIT',
      value: 'AUDIT',
    },
    {
      label: 'DQR',
      value: 'DQR',
    },
  ];

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() + 7);

  const [selectBuilding, setSelectBuilding] = useState([]);
  const [BuildingData, setBuildingData] = useState([]);
  const [removeBuilding, setRemoveBuilding] = useState();
  const [selectTime, setselectTime] = useState();
  const [OpenDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [employ, setEmploy] = useState([]);
  const [show, setShow] = useState(false);
  const [isTrackShow, setIsTrackShow] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedNameData, setSearchedNameData] = useState('');
  const [empmodalVisible, setEmpModalVisible] = useState(false);
  const [LocationDisabled, setLocationDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [vehNo, setvehNo] = useState('');
  const [reson, setreson] = useState('');
  const [Dqr, setDqr] = useState('');
  const [SuperReq, setSuperReq] = useState('No');
  const [SelBuild, setSelBuild] = useState('');
  const [TestTrackData, setTestTrackData] = useState([]);
  const [selectTestTrack, setSelectTestTrack] = useState([]);
  const [ActivityDone, setActivityDone] = useState('');
  const [AuthVeh, setAuthVeh] = useState('');
  const [ConsentApp, setConsentApp] = useState('');
  const [supervsrId, setsupervsrId] = useState('');
  const [UserData, setUserData] = useState([]);
  const [superEmpId, setsuperEmpId] = useState('');
  const [superEname, setsuperEname] = useState('');
  const [AuthVehData, setAuthVehData] = useState([]);

  const [selectAuthVeh, setSelectAuthVeh] = useState([]);

  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const [fromDate, setFromDate] = useState(new Date((new Date()).getDate()-1));
    const [toDate, setToDate] = useState(new Date((new Date()).getDate()-1));
    const [toDateMy, setToDateMy] = useState(new Date((new Date()).getDate()-1));
    

   const [Uid, setUID] = useState('');
    const [userNm, setuserNm] = useState('');
     const [userDept, setuserDept] = useState('');
      const [userDesg, setuserDesg] = useState('');
       const [userDiv, setuserDiv] = useState('');
        const [userVert, setuserVert] = useState('');
        const [maxToDate, setMaxToDate] = useState(new Date());
        const [FormateDate, setFormateDate] = useState(new Date());

        const [selectAuthDrive, setselectAuthDrive] = useState([]);
        const [AuthDriveData, setAuthDriveData] = useState('');
        const [isAuthDrive, setIsAuthDriveShow] = useState(false);
        const [purposeData, setpurposeData] = useState('');
        const [isAuthVeh, setIsAuthVehShow] = useState(false);


  const [Uname, setUname] = useState('');

  // By Anoop
  const [licence, setlicence] = useState([]);

  const [Locations, setLocations] = useState([]);

  const [selectSuperVis, setselectSuperVis] = useState('');

 


  // Insert Record

  const handleButtonPress = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;

    
    //let frmdate = fromDate.setDate(fromDate.getDate() - 7)
   // // console.log($1);
// $&

// $&
// $&
// $&
// $&
// $&
// $&
// $&

 
   
    
   
    let buldings = BuildingData.filter(element => {
      if (element.isSelected) {
        return element.VGLM_NAME;
      }
    }).map(obj => obj.VGLM_NAME);
// $&
    // Implement any desired actions with the input value here

    let TestTrack = TestTrackData.filter(element => {
      if (element.isSelected) {
        return element.TSTK_NAME
      }
    }).map(obj => obj.TSTK_NAME);

    var val ='';
    var valAll = '';
    let authVehDta = AuthVehData.filter(element => {
      if (element.isSelected) {
         val = element.LOVM_VALUE_CODE;
      
         valAll = val + ","+ valAll;
        // valAll = valAll.substring(",", valAll.length - 1);
// $&
        return element.LOVM_VALUE_CODE
      }
    }).map(obj => obj.LOVM_VALUE_CODE);

        
        
       

// $&
// $&

// $&
// $&
     
// $&


    

     if(moment(fromDate).format('DD-MMM-YYYY') == '01-Jan-1970' )
     {
         Toast.show("Please fill from date ");
     }
     else if(moment(toDate).format('DD-MMM-YYYY') == '01-Jan-1970')
     {
      Toast.show("Please fill to date ");
     }
     else if(purposeData == '')
     {
      Toast.show("Please fill Purpose");
     }
     else if(SuperReq == '')
     {
      Toast.show("Supervision is  Required");
     }
    //  else if(Dqr == '' )
    //  {
    //   Toast.show("Please select DQR");
    //  }

     else if(buldings[0] == undefined)
     {
      Toast.show("Please select buildings");
     }

     else if(valAll == '' && isSelected == true )
     {
       Toast.show("Please select at least one item from Authorize to drive.")
     }
     else if(valAll != '' && isSelected == false)
     {
         Toast.show("Please tick mark on consent as you are required to drive at R&D center.")
     }

     else if(moment(toDate).format('DD-MMM-YYYY') < moment(fromDate).format('DD-MMM-YYYY'))
     {
      Toast.show("To Date should not be less than current date.");
     }
     else if(SuperReq == 'Y' && superEmpId == '')
     {
      Toast.show("Please select supervisior name or Select Supervision Required No")
     }

     
     else{

      let newdata = {
            "Activity": ActivityDone,
            "AuthVehicle": valAll,
            "Building": buldings.join(','),
            "ConsentApp": isSelected == true ? "Y":"N",
            "DQRFlag": Dqr,
            "Dept": userDept,
            "Desg": userDesg,
            "Divn": userDiv,
            "FromDate": moment(fromDate).format('DD-MMM-YYYY'),
            "Lisence": inputValue,
            "Name": Uname,
            "Puprose": purposeData,
            "StaffNo": Uid,
            "SupervisorID": (SuperReq == 'Y')?selectSuperVis:'',
            "SupervisorReq": SuperReq,
            "TestTrack": TestTrack[0] == undefined?'':TestTrack.join(','),
            "ToDate": moment(toDate).format('DD-MMM-YYYY'),
            "VehRegNo": vehNo == ''?'':vehNo,
            "Vert": userVert,
          };


// $&

    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLInsertRqst', newdata, token, authContext)
      .then(result => {
// $&
       
        if(result.Value == ''){
          Alert.alert("Gate pass Generated Successfully");
          //Toast.show("Gate pass Generated Successfully",Toast.LONG);
          navigation.dispatch(
            CommonActions.navigate({
              name: 'HomeGate',
            })
          );
        }
        else{
          Alert.alert(result.Value);
          //Toast.show(result.Value,Toast.LONG);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        
// $&
        ApiService.showErrorMessage(error, authContext);
      });

    }

  };

  

 

  
  const GetAccessListVGPSApi = () => {
    let userId = AppUserData?.data?.userId;
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      UserName: userId,
    
    };
// $&
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLGetBuilding', apiData, token, authContext)
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
        // // console.log($1);
        setBuildingData(responseDataNew);
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const GetTest_TrackApi = () => {
    let userId = AppUserData?.data?.userId;
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      UserName: userId,
    };
// $&
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLGetTestTrack', apiData, token, authContext)
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
        setTestTrackData(responseDataNew);
// $&
// $&
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
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
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetEmpApi = () => {
    let userId = AppUserData?.data?.userId;
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      UserName: userId,
    
    };
// $&
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLGetEmpl', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
// $&
        //    // console.log($1);
        // // console.log($1);
       
        //  // console.log($1);
        //   // console.log($1);
        //   // console.log($1);

           userDep = responseData[0].EMPL_DEPT_CODE;

// $&
          setUID(responseData[0].EMPL_ID);
          setUname(responseData[0].EMPL_NAME);
          setuserDesg(responseData[0].EMPL_DESG_CODE);
          setuserDept(responseData[0].EMPL_DEPT_CODE);
          setuserDiv(responseData[0].DIVN_CODE);
          setuserVert(responseData[0].DIVN_DIRC_CODE);
         

        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
        // // console.log($1);
        setUserData(responseDataNew);
       
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const GetSupDetail_Api = () => {
    let userId = AppUserData?.data?.userId;
    let userDept = AppUserData?.data?.userDept;
// $&
 
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      StaffNo: userId,
      Dept:userDept
    };
   
    let token = AppUserData.token;
// $&
// $&
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLSupDetails', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;


        if(responseData != '')
        {
        let responseDataNew = responseData.map(element => {
          return {
            
            label:element.EMPL_NAME,
            value:element.DEP_EMPL_ID
           
          };
        });
// $&
       
        setSuperVision(responseDataNew);
// $&
// $&
// $&
        setsuperEmpId(responseData[0].DEP_EMPL_ID);
        setsuperEname(responseData[0].EMPL_NAME);
      }
      else{
        setSuperVision(SuperVisiors);
        setsuperEmpId('');
        setsuperEname('');
      }
      
      })
      .catch(error => {
        setLoader(false);
// $&
        ApiService.showErrorMessage(error, authContext);
      });
  };



 
     
  const emptyList = () => {
    setSearch('');
  };

 
  const gatePassScheema = yup.object().shape({
    fromDate: yup.object().required('From Date  is required'),
    // date: yup.string().required('select one is required'),
    duration: yup
      .string()
      .required('Duration  is required')
      .max(24, 'Duration should be less then 24 hours'),
    searchLevel: yup.object().required('select one search level please'),
    reson: yup
      .string()
      .required('Reason is required')
      .matches(/^[a-zA-Z0-9_ .-]*$/, 'Special characters not allowed'),
    Dqr: yup.object().required('Select an option'),
    SuperReq: yup.object().required('Select an option'),
   
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

  const toggleTestTrack = () => {
    setIsTrackShow(!isTrackShow);
  };

  const toggleAuthDrive = () => {
    setIsAuthDriveShow(!isAuthDrive);
  };
  const toggleAuthVeh = () => {
    setIsAuthVehShow(!isAuthVeh);
  };

  const toggleSuperVis = () => {
    setisSuprVis(!isSuprVis);
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

 

  const initialLoading = () =>{
    GetEmpApi();
    GetAuthVehApi();
    GetAccessListVGPSApi();
    GetTest_TrackApi();
    GetSupDetail_Api();
   // // console.log($1);
  }
  useEffect(() => {
    initialLoading(); 
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight}}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {/* <Header title="Visitor Gatepass" /> */}
      {/* BODY */}
      <Formik
        // enableReinitialize
        innerRef={fromRef}
        validateOnBlur={false}
        validationSchema={gatePassScheema}
        initialValues={{
          
            ActivityDone: '',
            AuthVeh:'',
            ConsentApp:'',
            userDept:'',
            userDesg:'',
            userDiv:'',
            fromDate: new Date(),
            toDate: new Date(),
            inputValue:'',   // licence
            buldings: '',
            Uname:'',
            reson:'',
            Uid:'',
            supervsrId:'577170',
            SuperReq: {
              label: 'No',
              value: 'N',
            },
            Dqr: {
              label: 'No',
              value: 'N',
            },
            TestTrack: '',
            vehNo: '',
            userVert: '',

        }}
        onSubmit={(values) => {
          handleButtonPress();
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
            {/* Selct Date And Time */}

            <Text style={{ paddingVertical: 10, paddingHorizontal: 0,fontSize:13 }} Bold>
                                Select Date {<Text style  ={{color :'red'}}>*</Text>}
                            </Text>
                            <View
                                style={{
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
                                }}>
                                <DatePicker
                                    modal
                                    open={open}
                                    date={new Date()}
                                    mode="date"
                                    theme='light'
                                    key="fromdet"
                                    minimumDate={new Date()}
                                    maximumDate={lastWeek}
                                    onConfirm={frmDate => {
// $&
                                      setOpen(false);
                                      formatDet = frmDate;
                                      setToDateMy(new Date(frmDate))
                                      
                                      let format = moment(frmDate).format('DD-MMM-YYYY');
                                      setFromDate(format);
                                     // alert(formatDet);
                                     
                                      fromRef.current.setFieldValue('selectDate', format);
                                         
                                     // // console.log($1);
                                    
                                     
                                      let mydett = formatDet;
                                      mydett.setDate(frmDate.getDate() + 7);
                                      
// $&
                                      setMaxToDate(mydett);

                                      // let frrm = fromDate;
                                      // frrm.setDate(frrm.getDate() - 7);
                                      // setFromDate(frrm);
// $&
                                    
// $&
                                    }}
                                    
                                    onCancel={() => {
                                        setOpen(false);
                                    }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <TextInput2
                                        placeholder="Start date"
                                        style={{
                                            color: '#000',
                                            fontSize:13
                                        }}
                                        editable={false}
                                        paddingHorizontal={14}
                                        value={values.selectDate}
                                    />
                                    <TouchableOpacity onPress={() => setOpen(true)}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={25}
                                            color={'#43C6DB'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <DatePicker
                                    modal
                                    open={second}
                                    date={toDateMy}
                                    key = "toDet"
                                    mode="date"
                                    theme='light'
                                    minimumDate={toDateMy}
                                    maximumDate={maxToDate}
                                    onConfirm={toDate => {
                                        setSecond(false);
                                        setToDate(toDate);
                                        let formatSecond = moment(toDate).format('DD-MMM-YYYY');
                                        setTextinputSecondDate(formatSecond);
// $&
                                        fromRef.current.setFieldValue(
                                            'selectDateSecond',
                                            formatSecond,
                                        );
                                    }}
                                    onCancel={() => {
                                        setSecond(false);
                                    }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <TextInput2
                                        style={{ color: '#000', letterSpacing: 1,fontSize:13 }}
                                        placeholder="End Date"
                                        editable={false}
                                        paddingHorizontal={14}
                                        value={values.selectDateSecond}
                                    />
                                    <TouchableOpacity onPress={() => setSecond(true)}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={25}
                                            color={'#43C6DB'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

            {/* Search Level */}
            <View style={{marginVertical: 5,display:'none'}}>
              <View style={{marginBottom: 5}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    // paddingVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Track License No.
                </Text>
              </View>

              <TextInput
                placeholder="Track License No."
               // onChangeText={handleChange('inputValue')}
                onBlur={handleBlur('inputValue')}
                value={inputValue}
                maxLength={14}
                onChangeText={text => setInputValue(text)}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 6,
                  alignSelf: 'center',
                  borderColor: '#43C6DB',
                  fontSize: 13,
                }}
              />

              {errors.reason && touched.reason && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                    {errors.reason}
                  </Text>
                </View>
              )}
            </View>

            {/* Commuting Veh Reg. No. */}
            {/* <View style={{marginVertical: 5}}>
              <View style={{marginBottom: 5}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    // paddingVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Commuting Veh. Reg. No.
                </Text>
              </View>

              <TextInput
                placeholder="Commuting Veh. Reg. No."
               // onChangeText={handleChange('vehNo')}
                onBlur={handleBlur('vehNo')}
                value={vehNo}
                maxLength={24}
                onChangeText={text => setvehNo(text)}
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 6,
                  alignSelf: 'center',
                  borderColor: '#43C6DB',
                  fontSize: 13,
                }}
              />
              {errors.reason && touched.reason && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                    {errors.reason}
                  </Text>
                </View>
              )}
            </View> */}

            {/* Reason To come number */}
            <View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Purpose  {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                {/* <TextInput
                  placeholder="Reason"
                //  onChangeText={handleChange('reson')}
                maxLength={34}
                  onBlur={handleBlur('reson')}
                 value={reson}
                 onChangeText={text => setreson(text)}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 6,
                    alignSelf: 'center',
                    borderColor: '#43C6DB',
                    fontSize: 13,
                  }}
                /> */}

                   <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={values.persionalVehical}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={Purpose}
                    onSelect={(selectedItem, index) => {
// $&
// $&
                      setpurposeData(selectedItem.value);
                      setFieldValue('AuthDrive FLAG', selectedItem);
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
                {errors.reason && touched.reason && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.reason}
                    </Text>
                  </View>
                )}
              </View>
            </View>

           
            {/* Select Building / multiple selection*/}
            <View>
              <View style={{width: '100%', alignSelf: 'center', marginTop: 10}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Select Area {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <View
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    borderColor: '#43C6DB',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minHeight: 37,
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {/* <Text>{JSON.stringify(BuildingData)}</Text> */}
                      {BuildingData.length > 0 &&
                        BuildingData.map((element, index) =>
                          element.isSelected ? (
                            <View
                              key={index}
                              style={{
                                padding: 5,
                                backgroundColor: '#43C6DB',
                                margin: 5,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 13,
                              }}>
                              <TextInput
                                editable={false}
                                style={{
                                  color: '#fff',
                                  padding: 5,
                                  fontSize: 13,
                                }}>
                                {element.VGLM_NAME}
                              </TextInput>
                              <TouchableOpacity
                                onPress={item => {
                                  let newState = [...BuildingData];
                                  newState[index].isSelected = false;
                                  setBuildingData(newState);
                                  setSelectBuilding(newState);
// $&
                                }}>
                                <Ionicons
                                  name="remove-circle"
                                  size={27}
                                  color={'#43C6DB'}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null,
                        )}
                      {selectBuilding.length < 0 ? 'hi' : null}
                    </ScrollView>
                    <TouchableOpacity onPress={toggleBuilding}>
                      {show == true ? (
                        <Ionicons name="caret-up" size={25} color={'#43C6DB'} />
                      ) : (
                        <Ionicons
                          name="caret-down"
                          size={25}
                          color={'#43C6DB'}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={show}
                    onRequestClose={() => {
                      // Alert.alert("Modal has been closed.");
                      // setModalVisible(!modalVisible);
                      onPress = {toggleBuilding};
                    }}>
                    <View style={styles.centeredView}>
                      <TouchableOpacity
                        style={styles.Modalclose}
                        onPress={toggleBuilding}>
                        <Text style={styles.Modalclosetxt}>Done</Text>
                        {/* <Ionicons name="close" size={25} /> */}
                      </TouchableOpacity>
                      <Text style={styles.ModalHeading}>Select Buildings</Text>

                      <FlatList
                        data={BuildingData}
                        numColumns={2}
                        keyExtractor={item => item.VGLM_ID.toString()}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: '48%',
                              padding: 10,
                              // borderWidth: 1,
                              borderColor: GlobalColor.Secondary,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 2,
                              backgroundColor: item.isSelected
                                ? '#C9EFD9'
                                : '#eee',
                            }}
                            onPress={() => {
                              let newState = [...BuildingData];

                              if (item.isSelected) {
                                newState[index].isSelected = false;
                                setBuildingData(newState);
                                setSelectBuilding(newState);
                              } else {
                                newState[index].isSelected = true;
                                setBuildingData(newState);
                              }

                              if (newState.length == 0) {
                                setFieldValue('building', '');
                              } else {
                                setFieldValue('building', 'added');
                              }
                            }}>
                            <Text style={styles.checkboxLabel}>
                              {item.VGLM_NAME}
                            </Text>
                            <View>
                              {item.isSelected ? (
                                <Ionicons
                                  name="remove-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              ) : (
                                <Ionicons
                                  name="add-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </Modal>
                </View>

                {errors.building && touched.building && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.building}
                    </Text>
                  </View>
                )}
              </View>
              {/* {BuildingData.length == 0 ? (
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingVertical: 2,
                            }}>
                            <Text style={{ fontSize: 12, color: 'red' }}>
                             {errors.building}
                            </Text>
                          </View>
                        ):null} */}
            </View>

            {/* select Test Track */}

            <View>
              <View style={{width: '100%', alignSelf: 'center', marginTop: 10,display:'none'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Select Test Track 
                </Text>
                <View
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    borderColor: '#43C6DB',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minHeight: 37,
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {/* <Text>{JSON.stringify(BuildingData)}</Text> */}

                      {TestTrackData.length > 0 &&
                        TestTrackData.map((element, index) =>
                          element.isSelected ? (
                            <View
                              key={index}
                              style={{
                                padding: 5,
                                backgroundColor: '#43C6DB',
                                margin: 5,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 13,
                              }}>
                              <TextInput
                                editable={false}
                                style={{
                                  color: '#fff',
                                  padding: 5,
                                  fontSize: 13,
                                }}>
                                {element.TSTK_NAME}
                              </TextInput>
                              <TouchableOpacity
                                onPress={item => {
                                  let newState = [...TestTrackData];

                                  newState[index].isSelected = false;
                                  setTestTrackData(newState);
                                  setSelectTestTrack(newState);
                                }}>
                                <Ionicons
                                  name="remove-circle"
                                  size={27}
                                  color={'#43C6DB'}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null,
                        )}
                      {selectTestTrack.length < 0 ? 'hi' : null}
                    </ScrollView>
                    <TouchableOpacity onPress={toggleTestTrack}>
                      {isTrackShow == true ? (
                        <Ionicons name="caret-up" size={25} color={'#43C6DB'} />
                      ) : (
                        <Ionicons
                          name="caret-down"
                          size={25}
                          color={'#43C6DB'}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isTrackShow}
                    onRequestClose={() => {
                      // Alert.alert("Modal has been closed.");
                      // setModalVisible(!modalVisible);
                      onPress = {toggleTestTrack};
                    }}>
                    <View style={styles.centeredView}>
                      <TouchableOpacity
                        style={styles.Modalclose}
                        onPress={toggleTestTrack}>
                        <Text style={styles.Modalclosetxt}>Done</Text>
                        {/* <Ionicons name="close" size={25} /> */}
                      </TouchableOpacity>
                      <Text style={styles.ModalHeading}>Select Test Track</Text>

                      <FlatList
                        data={TestTrackData}
                        numColumns={2}
                        keyExtractor={item => item.TSTK_ID.toString()}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: '48%',
                              padding: 10,
                              // borderWidth: 1,
                              borderColor: GlobalColor.Secondary,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 2,
                              backgroundColor: item.isSelected
                                ? '#C9EFD9'
                                : '#eee',
                            }}
                            onPress={() => {
                              let newState = [...TestTrackData];

                              if (item.isSelected) {
                                newState[index].isSelected = false;
                                setTestTrackData(newState);
                                setSelectTestTrack(newState);
                              } else {
                                newState[index].isSelected = true;
                                setTestTrackData(newState);
                              }

                              if (newState.length == 0) {
                                setFieldValue('building', '');
                              } else {
                                setFieldValue('building', 'added');
                              }
                            }}>
                            <Text style={styles.checkboxLabel}>
                              {item.TSTK_NAME}
                            </Text>
                            <View>
                              {item.isSelected ? (
                                <Ionicons
                                  name="remove-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              ) : (
                                <Ionicons
                                  name="add-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </Modal>
                </View>

                {errors.building && touched.building && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.building}
                    </Text>
                  </View>
                )}
              </View>
              {/* {BuildingData.length == 0 ? (
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingVertical: 2,
                            }}>
                            <Text style={{ fontSize: 12, color: 'red' }}>
                             {errors.building}
                            </Text>
                          </View>
                        ):null} */}
            </View>

            {/* Activity to be done(consent) */}

            <View style={{marginVertical: 5,display:'none'}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Activities to be done 
                </Text>
                <TextInput
                  placeholder="Activity"
                 // onChangeText={handleChange('ActivityDone')}
                 maxLength={54}
                  onBlur={handleBlur('ActivityDone')}
                 value={ActivityDone}
                  onChangeText={text => setActivityDone(text)}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 6,
                    alignSelf: 'center',
                    borderColor: '#43C6DB',
                    fontSize: 13,
                  }}
                />
                {errors.reason && touched.reason && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.reason}
                    </Text>
                  </View>
                )}
              </View>
            </View>
     {/* new Auth Drive */}

    
            {/* Authourised to Drive */}

       

            <View>
              <View style={{width: '100%', alignSelf: 'center', marginTop: 10}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Required to Drive
                </Text>
                <View
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    borderColor: '#43C6DB',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minHeight: 37,
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {/* <Text>{JSON.stringify(BuildingData)}</Text> */}

                      {AuthVehData.length > 0 &&
                        AuthVehData.map((element, index) =>
                          element.isSelected ? (
                            <View
                              key={index}
                              style={{
                                padding: 5,
                                backgroundColor: '#43C6DB',
                                margin: 5,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 13,
                              }}>
                              <TextInput
                                editable={false}
                                style={{
                                  color: '#fff',
                                  padding: 5,
                                  fontSize: 13,
                                }}>
                                {element.LOVM_VALUE_CODE == 'ALL'? 'EV' + ' LHD' + ' RHD' + ' FORKLIFT ': element.LOVM_VALUE_CODE}
                              </TextInput>
                              <TouchableOpacity
                                onPress={item => {
                                  let newState = [...AuthVehData];

                                  newState[index].isSelected = false;
                                  setAuthVeh(newState);
                                  setSelectAuthVeh(newState);
                                }}>
                                <Ionicons
                                  name="remove-circle"
                                  size={27}
                                  color={'#43C6DB'}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null,
                        )}
                      {selectAuthVeh.length < 0 ? 'hi' : null}
                    </ScrollView>
                    <TouchableOpacity onPress={toggleAuthVeh}>
                      {isAuthVeh == true ? (
                        <Ionicons name="caret-up" size={25} color={'#43C6DB'} />
                      ) : (
                        <Ionicons
                          name="caret-down"
                          size={25}
                          color={'#43C6DB'}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isAuthVeh}
                    onRequestClose={() => {
                      // Alert.alert("Modal has been closed.");
                      // setModalVisible(!modalVisible);
                      onPress = {toggleAuthVeh};
                    }}>
                    <View style={styles.centeredView}>
                      <TouchableOpacity
                        style={styles.Modalclose}
                        onPress={toggleAuthVeh}>
                        <Text style={styles.Modalclosetxt}>Done</Text>
                        {/* <Ionicons name="close" size={25} /> */}
                      </TouchableOpacity>
                      <Text style={styles.ModalHeading}>Required to Drive</Text>

                      <FlatList
                        data={AuthVehData}
                        numColumns={2}
                        keyExtractor={item => item.LOVM_VALUE_CODE}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: '48%',
                              padding: 10,
                              // borderWidth: 1,
                              borderColor: GlobalColor.Secondary,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 2,
                              backgroundColor: item.isSelected
                                ? '#C9EFD9'
                                : '#eee',
                            }}
                            onPress={() => {
                              let newState = [...AuthVehData];

                              if (item.isSelected) {
                                newState[index].isSelected = false;
                                setAuthVehData(newState);
                                setSelectAuthVeh(newState);
                              } else {
                                newState[index].isSelected = true;
                                setAuthVehData(newState);
                              }

                              if (newState.length == 0) {
                                setFieldValue('building', '');
                              } else {
                                setFieldValue('building', 'added');
                              }
                            }}>
                            <Text style={styles.checkboxLabel}>
                              {item.LOVM_VALUE_CODE}
                            </Text>
                            <View>
                              {item.isSelected ? (
                                <Ionicons
                                  name="remove-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              ) : (
                                <Ionicons
                                  name="add-circle"
                                  size={22}
                                  color={'#43C6DB'}
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </Modal>
                </View>

                {errors.building && touched.building && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.building}
                    </Text>
                  </View>
                )}
              </View>
              {/* {BuildingData.length == 0 ? (
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingVertical: 2,
                            }}>
                            <Text style={{ fontSize: 12, color: 'red' }}>
                             {errors.building}
                            </Text>
                          </View>
                        ):null} */}
            </View>



            {/* Supervisor Required */}

            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{width: '48%',display:'none'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    DQR {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={values.persionalVehical}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={options}
                    onSelect={(selectedItem, index) => {
// $&
// $&
                      setDqr(selectedItem.value);
                      setFieldValue('DQRFLAG', selectedItem);
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
                  {errors.Dqr && touched.Dqr && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.Dqr}
                      </Text>
                    </View>
                  )}
                </View>


                

                <View style={{width: '100%'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    Supervision Required {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={values.SuperReq}
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
                      setSuperReq(selectedItem.value);
// $&
                      setFieldValue('SPRFLAG', selectedItem);
                   
                      
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
                  {errors.internalVehical && touched.internalVehical && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.internalVehical}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
             
            </View>

                   
          
            <View>
              {SuperReq == 'Y' ? (
              <View style={{width: '100%', marginVertical: 10}}>
               
               

               
              </View>
              ):setisSuprVis(true)}
              {/* TExtInput */}

              {loader == true ? (
                <Spinner
                  visible={loader}
                  textContent={'Loading...'}
                  textStyle={{color: '#fff'}}
                />
              ) : null}
              {SuperReq == 'Y' ? (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginVertical: 10,
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
                     // setSuperVision(selectedItem);
// $&
                      setselectSuperVis(selectedItem.value);
// $&
                      setFieldValue('SPRFLAG', selectedItem);
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
                  {errors.internalVehical && touched.internalVehical && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.internalVehical}
                      </Text>
                    </View>
                  )}
                </View>

              
           
                ):setisSuprVis(true)}
              {/* Next Button */}
                        <View style={{paddingVertical: 10, marginBottom: 70}}>
                        <View style={styles.checkboxContainer}>
                      
                                        <CheckBox
                                            disabled={false}
                                            value={isSelected}
                                            onValueChange={setSelection}
                                            boxType="square"
                                            // hideBox
                                            style={{ height: 20, width: 20, marginRight:5 }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                            onCheckColor={GlobalColor.Secondary}
                                            onTintColor={GlobalColor.Secondary}
                                        />  
              <Text Bold style={styles.checkboxText}>
              Required to drive vehicle in R&D Centre
              </Text>
            </View>
            <View style = {{marginBottom:"30%"}}>
                              <Button  onPress={() => {
                                      handleButtonPress();
                              }} title="SUBMIT" textStyle={{fontSize:13}}></Button>
                              </View>
                         </View>
                         
          </View>

            {/* MOdal for searchEMP List */}
            <Modal transparent={false} visible={empmodalVisible}>
              <Pressable
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: GlobalColor.White,
                    padding: 0,
                    borderRadius: 0,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <TouchableOpacity
                    style={{position: 'absolute', top: 0, right: 0}}
                    onPress={() => {
                      setEmpModalVisible(false);
                    }}>
                    <Ionicons
                      style={styles.searchIcon}
                      name="close-circle-outline"
                      size={30}
                      color={'#43C6DB'}
                    />
                  </TouchableOpacity>

                  {/* {employ.length > 0 ? ( */}

                  <FlatList
                    style={{width: '100%', marginHorizontal: 0, marginTop: 40}}
                    ListEmptyComponent={
                      <ListEmptyComponent
                        title="No Data Found"
                        enableRefresh={false}
                        subtitle="Please change the Id & Employee Name"></ListEmptyComponent>
                    }
                    data={employ}
                    keyExtractor={item => item['Staff No']}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.FlatListData}
                        key={index}
                        onPress={() => {
                          setFieldValue('searchEmp', item.Name);
                          setFieldValue('perName', item.Name);
                          setFieldValue('empId', item['Staff No']);
                          setFieldValue('Desig', item['Desg']);
                          setFieldValue('MOB_NO', item['mobilenumber']);
                          // // console.log($1);
                          // setSearchedNameData(item)
                          setEmpModalVisible(false);
                        }}>
                        <Ionicons
                          style={styles.searchIcon}
                          name="person-circle-outline"
                          size={25}
                          color={'#43C6DB'}
                        />
                        <View
                          style={{
                            flexDirection: 'column',
                            flex: 1,
                            marginLeft: 10,
                          }}>
                          <Text style={{fontSize: 16}}>{item.Name}</Text>
                          <Text>
                            {item.Desg} , {item.Dept} ({item['Staff No']})
                          </Text>
                        </View>
                        <TouchableOpacity>
                          <Ionicons
                            style={styles.searchIcon}
                            name="chevron-forward-circle-outline"
                            size={25}
                            color={'#43C6DB'}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  />
                  {/* // ) : (
                    //   <Text>Searched Data not found</Text>
                    // )} */}
                </View>
              </Pressable>
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
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10
  },
  checkboxText: {
    marginLeft: 2,
    fontSize: 13,
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
    flex: 0.9,
    position: 'relative',
    backgroundColor: '#fff',
  },
  Modalclose: {
    position: 'absolute',
    right: 0,
    backgroundColor: GlobalColor.Primary,
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
  ModalHeading: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
});

// //make this component available to the app
export default CreateRequestRhtk;
