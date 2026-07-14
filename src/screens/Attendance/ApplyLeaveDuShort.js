//import liraries
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView, 
  Alert,
  Image,
  ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast'
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import Button from './../../components/reusable/Button';
import Text from '../../components/reusable/Text';
import CheckBox from '@react-native-community/checkbox';
import TextInput2 from '../../components/reusable/TextInput';
import {Header} from '../../components/reusable/Header';



const ApplyLeaveDuShort = ({navigation,route}) => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [loader, setLoader] = useState(false);
    const [textinputSecondDate, setTextinputSecondDate] = useState('');
    const [open, setOpen] = useState(false);
    const [second, setSecond] = useState(false);
    const [checked, setChecked] = useState(null);
    const [validReason, setValidReason] = useState('Select Reason');
    const [validReasonCode, setValidReasonCode] = useState('');
    const { authContext, AppUserData } = useContext(AuthContext);
    // const [comment, setComment] = useState('');
    // added for leave page 
    const [LeaveTypes, setLeaveTypes] = useState([]);
    const [Leavereason, setLeavereason] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);

    const [LeaveTyp, setLeaveTyp] = useState('');
    const [LeaveComment, setLeaveComment] = useState('');

    const [value, setValue] = useState(0);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedFinYear, setSelectedFinYear] = useState(null);
    const [capping, setCapping] = useState(0);


    const [fin_year, setFin_Year] = useState([
      {
        label: 'No-Data',
        value: 'No-Data',
      },
    ]);
    const [fn_yr, setfn_yr] = useState('');

    const [mnth, setmnth] = useState([
      {
        label: 'Select Yr.',
        value: 'Select Yr.',
      },
    ]);
    const [mnt, setmnt] = useState('');
  
    const [block, setBlock] = useState([
      {
        label: 'Select Mnth',
        value: 'Select Mnth',
      },
    ]);
    const [blck, setblck] = useState('');


    const increment = () => {
      setValue(prevValue => (prevValue < capping ? (Number(prevValue) + 0.5).toFixed(1):capping));
    };

handleComment = text => {
  setLeaveComment(text);
 };

const decrement = () => {
  setValue(prevValue => (prevValue > 0 ? (Number(prevValue) - 0.5).toFixed(1) : '0.0'));
};
    
  
  
    const def_options = [
        {
          label: '--select--',
          value: '--select--',
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
      ];
      const LoadInitial = () => {
        GetShortfallLeaveType("","","");
        GetFnyear("","","");
        setfn_yr(route.params.finYear);
        setmnt(route.params.salDeductPay);
        setblck(route.params.period);
        setValue(route.params.totalDays);
        setCapping(route.params.totalDays);
// $&
        // "FinYear":fn_yr == ''?route.params.finYear:fn_yr,
        //                   "Month":mnt == ''?route.params.salDeductPay:mnt,
        //                   "Block":blck == ''?route.params.period:blck,
       
       
        //Exp_out();
    }
  
    useFocusEffect(
      React.useCallback(() => {
        const unsubscribe =  LoadInitial();
        return () => unsubscribe;
      }, [])
    )
  
    var radio_props = [
      { label: 'Planned', value: "P" },
      { label: 'Unplanned', value: "U" },
    ];
    var radio_propsSecond = [
      { label: 'Full Day', value: 3 },
      { label: '1st Half', value: 1 },
      { label: '2nd Half', value: 2 },
    ];
  
    const leaveTypeScheema = yup.object().shape({
      leave: yup.string().required('Leave type is required'),
      planned: yup.string().required('Choose an option'),
      period: yup.string().required('Please select period'),
      selectDate: yup.string().required('Start Date is required'),
      selectDateSecond: yup.string().required('End Date is required'),
      reason: yup.string().required('Please select a reason'),
      comment: yup.string()
      .matches(/^[a-zA-Z0-9_ .-]*$/, 'Special characters not allowed'),
    });
    const fromRef = useRef(null);

    function convertToApiFormat(inputDate)
    { 
      // Define a mapping of month abbreviations to numbers
      const monthMap = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
       // Trim spaces and split the string into month abbreviation and year
        const [monthAbbreviation, year] = inputDate.trim().split(/\s*-\s*/); // Handles spaces around '-'
        // Convert month abbreviation to corresponding month number
        const monthNumber = monthMap[monthAbbreviation.toUpperCase()]; // Ensure case consistency // If monthNumber is undefined, return an error message or handle it gracefully
        if (!monthNumber) { throw new Error(`Invalid month abbreviation: ${monthAbbreviation}`); }
        // Format the result as "YYYYMM"
        return `${year}${monthNumber}`;

       }
  
    const PostSubmitLeave = () => {

      if (!fn_yr || !mnt || !blck || !value || !LeaveTyp || !validReasonCode ) {
        Alert.alert(
          "Error",
          "All fields are required. Please fill in all the details.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel"
            },
          ]
        );
        return;
      }

      else if(validReason == 'Others (Give details in comments)' && LeaveComment == '' )
      {
        Alert.alert(
          "Error",
          "Comment is Mandatory",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel"
            },
          ]
        );
        return;
      }

      else if(value == '0.0' )
      {
        Alert.alert(
          "Error",
          "All fields are required. Please fill in all the details.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "cancel"
            },
          ]
        );
        return;

      }
      
    
let apiData =
      {
                          "FinYear":fn_yr,
                          "Month":convertToApiFormat(mnt),
                          "Block":blck,
                          "Days":value,
                          "LeaveType":LeaveTyp,
                          "Reason":validReasonCode,
                          "Comments":LeaveComment,
                          "UserName": AppUserData?.data?.username,
    }

// $&
  
      let token = AppUserData.token;

      
      setLoader(true);
      ApiService.PostMethode('/ApplyShortfallLeave', apiData, token)
        .then(result => {
          setLoader(false);
// $&
         
            if(result.Result === ""){
              
              setLeaveComment('');
              setValidReason('');
              setValue(0);

              GetFnyear("","","");
              setFin_Year('');

              setmnth('')
              GetMonth(fn_yr,"","")

              setBlock('');
             
             
              setSelectedFinYear(null);
             
              fromRef.current.resetForm();
              setChecked(null);
              setValidReason("Select Reason"); 
              Alert.alert(
                "Leave",
                "Leave Applied Successfully",
                [
                  {
                    
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                ]
              );
                  
            }   

            else
            {
              Alert.alert(result.Result);
            }  
        
        //   Toast.show(result.Result);

       
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    };

    const GetFnyear = (finyear,month,block) => {
    
      let apiData = {
        "FinYear": finyear,
        "Month":month,
        "Block": block,
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
  
// $&
      
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetShortfallData', apiData, token, authContext)
        .then(result => {
// $&
// $&
  
         
  
  
  
  
          let responseDataNew = result.Value.Table.map(element => {
            return {
              
              label:element.SRTFALL_FNYR,
              value:element.SRTFALL_FNYR
             
            };
          });
          setFin_Year(responseDataNew);
     
          setLoader(false);
          
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
    const GetMonth = (finyear,month,block) => {
    
      let apiData = {
        "FinYear": finyear,
        "Month":month,
        "Block": block,
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
  
// $&
      
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetShortfallData', apiData, token, authContext)
        .then(result => {
// $&
  
          
          
  
  
         let responseDataNew1 = result.Value.Table1.map(element => {
          return {
            
            label:element.MONTH_DESC,
            value:element.SRTFALL_PAYROLL_MONTH
           
          };
        });
        setmnth(responseDataNew1);
  
       
  
        
      //  setBlock(responseDataNew2);
        // settotalH(result.Value.Table2[0]['SRTFALL_TOT_HRS']);
        // setavaild_hrs(result.Value.Table2[0]['SRTFALL_AVILD_HRS'])
          setLoader(false);
          // if (result.Value) {
          //   setRawPunches(result.Value);
          // }
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  
    const GetBlock = (finyear,month,block) => {
      
      let apiData = {
        "FinYear": finyear,
        "Month":month,
        "Block": block,
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
  
// $&
      
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetShortfallData', apiData, token, authContext)
        .then(result => {
        
  
// $&
          let responseDataNew2 = result.Value.Table2.map(element => {
            return {
              
              label:element.SRTFALL_WEEK_NUMBER,
              value:element.DAYS
             
            };
          });
        setBlock(responseDataNew2);
  
        
    
  
        // settotalH(result.Value.Table2[0]['SRTFALL_TOT_HRS']);
        // setavaild_hrs(result.Value.Table2[0]['SRTFALL_AVILD_HRS'])
          setLoader(false);
          // if (result.Value) {
          //   setRawPunches(result.Value);
          // }
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
    const GetShortfallLeaveType = (finyear,month,block) => {
    
      let apiData = {
        "FinYear": finyear,
        "Month":month,
        "Block": block,
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
  
// $&
      
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetShortfallData', apiData, token, authContext)
        .then(result => {
// $&
// $&

          if (result.Value) {
            let updatedArray = [];
            result.Value.Table5.forEach((element, index) => {
              updatedArray.push({ ...element, id: index, Type: element.SHORT_NAME, value: element.ABSENCE_ID });
            });
// $&
            setLeaveTypes(updatedArray);
          } else {
            Toast.show('No Leave type found');
          }
  
        
          setLoader(false);
          // if (result.Value) {
          //   setRawPunches(result.Value);
          // }
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }

    const GetData = (finyear,month,block) => {
      
      let apiData = {
        "FinYear": finyear,
        "Month":month,
        "Block": block,
        "UserName": AppUserData?.data?.userId
      };
      // // console.log($1);
      // AppUserData?.data?.userId
  
// $&

     // GetData(fn_yr,mnt,blck);
      
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetShortfallData', apiData, token, authContext)
        .then(result => {
        
  
// $&
          if(result.Value.Table2 == '')
          {
               setBlock(def_options);
          }
          else{
            let responseDataNew2 = result.Value.Table2.map(element => {
              return {
                
                label:element.SRTFALL_WEEK_NUMBER,
                value:element.DAYS
               
              };
            });
          //setBlock(responseDataNew2);
// $&
          setValue(result.Value.Table2[0].DAYS);
          setCapping(result.Value.Table2[0].DAYS);
          }
          
  
        
    
  
        // settotalH(result.Value.Table2[0]['SRTFALL_TOT_HRS']);
        // setavaild_hrs(result.Value.Table2[0]['SRTFALL_AVILD_HRS'])
          setLoader(false);
          // if (result.Value) {
          //   setRawPunches(result.Value);
          // }
        })
        .catch(error => {
          setLoader(false);
          // // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  
    const getleavetypes = () => {
     
      let apiData = { "UserName": AppUserData?.data?.username };
      // AppUserData?.data?.userId 222852
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetInitialLeave', apiData, token, authContext)
        .then(result => {
// $&
          setLoader(false);
          if (result.Value) {
            let updatedArray = [];
            result.Value.Table2.forEach((element, index) => {
              updatedArray.push({ ...element, id: index, Type: element.SHORT_NAME, value: element.ABSENCE_ID.replace(/\D/g, "") });
            });
// $&
            setLeaveTypes(updatedArray);
          } else {
            Toast.show('No Leave type found');
          }
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  
    const GetLeaveReasonShortFall = (type) => {
      let apiData =
       { 
        "LeaveType": type,
        "UserName": AppUserData?.data?.username
      };
    
      // AppUserData?.data?.userId 222852
// $&
      let token = AppUserData.token;

// $&
      setLoader(true);
      ApiService.PostMethode('/GetShotfallReason', apiData, token, authContext)
        .then(result => {
// $&
          setLoader(false);
          if (result.Value) {
            let reasons = [];
            result.Value.forEach((element, index) => {
              reasons.push({ ...element, id: index });
            });
            setLeavereason(reasons);
          } else {
            Toast.show('No Leave type found');
          }
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }

    const GetLeaveReason = (type) => {
      let apiData = { "LeaveType": type };
      // AppUserData?.data?.userId 222852
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetLeaveReason', apiData, token, authContext)
        .then(result => {
// $&
          setLoader(false);
          if (result.Value) {
            let reasons = [];
            result.Value.forEach((element, index) => {
              reasons.push({ ...element, id: index });
            });
            setLeavereason(reasons);
          } else {
            Toast.show('No Leave type found');
          }
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  
  
    const getEmpLeaveDetail = (fnyear) => {
  
      var curryear = ((new Date().getFullYear()).toString()).substring(0, 2);
      var from;
      if (parseInt(((fnyear.toString()).substring(0, 2))) == 99) {
        from = '01-apr-' + (parseInt(curryear) - 10) + ((fnyear.toString()).substring(0, 2));
      } else {
        from = '01-apr-' + curryear + ((fnyear.toString()).substring(0, 2));
      }
      var to = '31-mar-' + curryear + ((fnyear.toString()).substring(2, 4));
      let apiData = {
        "StaffNo": AppUserData?.data?.userId,
        "FromDate": from,
        "ToDate": to
      };
  
      // AppUserData?.data?.userId 222852
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetEmplLevDetail', apiData, token, authContext)
        .then(result => {
          // // console.log($1);
          setLoader(false);
          let arr = []
          if (result.Value) {
            arr.push(result.Value)
            // // console.log($1);
            setEmpLeaveDetail(...arr);
          } else {
            Toast.show('No Leave type found');
          }
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    }  
  
  
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
  
    const rederReason = ({ item }) => {
        return (
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              margin: 2,
              borderBottomWidth: 1,
              borderBottomColor: '#43C6DB',
              marginVertical: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
// $&
                setValidReason(item.REASON);
                setValidReasonCode(item.LOOKUP_CODE);
                fromRef.current.setFieldValue('reason', item.LOOKUP_CODE);
                setModalVisible(false);
              }}>
              <Text style={{fontSize:13}}>{item.REASON}</Text>
            </TouchableOpacity>
          </View>
        );
      };
    
  
    return (
        <SafeAreaView style={{ flex: 1, }}>
            {
                loader ?
                    <Spinner
                        visible={loader}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    : null
            }
 <Header title="Flexi Time Adj." />
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}>
                <View showsVerticalScrollIndicator={false} style={styles.container}></View>
                <Formik
                    innerRef={fromRef}
                    validateOnBlur={false}
                    validationSchema={leaveTypeScheema}
                    initialValues={{
                        leave: '',
                        planned: '',
                        period: '',
                        selectDate: '',
                        selectDateSecond: '',
                        reason: '',
                        comment: '',
                    }}
                    onSubmit={values => {
                        let data = {
                            UserName: AppUserData?.data?.userId,
                            StaffNo: AppUserData?.data?.userId,
                            PlannedUnplanned: values.planned,
                            LeaveType: values.leave,
                            Period: values.period,
                            FromDate: values.selectDate,
                            ToDate: values.selectDateSecond,
                            Reason: values.reason,
                            Comments: '',
                        };

                        let submitData =
                        {
                          "FinYear":fn_yr,
                          "Month":mnt,
                          "Block":blck,
                          "Days":value,
                          "LeaveType":values.leave,
                          "Reason":values.reason,
                          "Comments":values.comment,
                          "UserName": AppUserData?.data?.username,

                            
                        }
                        PostSubmitLeave(submitData);
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
                        <View style={{ flex: 1 ,marginHorizontal:10,marginBottom:"10%"}}>
                            <Text style={{ paddingVertical: 10, paddingHorizontal: 0,fontSize:13 }} Bold>
                                Leave Type
                            </Text>
                            <View style={styles.box}>
                                <FlatList
                                    numColumns={6}
                                    data={LeaveTypes}
                                    keyExtractor={item => item.ABSENCE_ID.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.circleBox}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                  GetLeaveReasonShortFall(item.ABSENCE_ID);
                                                  setLeaveTyp(item.ABSENCE_ID);
                                                    setChecked(item.id);
                                                    setValidReason('Select Reason');
                                                    fromRef.current.setFieldValue('leave', item.ABSENCE_ID);
                                                    // setFieldValue(item.id);
                                                }}
                                                style={[
                                                    styles.circle,
                                                    {
                                                        backgroundColor:
                                                            checked == item.id ? '#43C6DB' : null,
                                                    },
                                                ]}>
                                                <Text
                                                    style={{
                                                        color: checked == item.id ? '#fff' : '#000',
                                                        fontSize: 10
                                                    }}>
                                                    {item.Type}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                            {errors.leave && touched.leave && (
                                <View
                                    style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        paddingVertical: 2,
                                    }}>
                                    <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                        {errors.leave}
                                    </Text>
                                </View>
                            )}

                            {/* <Text style={{ paddingVertical: 10, paddingHorizontal: 0,fontSize:13 }} Bold>
                                Planned/Unplanned
                            </Text>
                            <View style={styles.box}>
                                <View style={{ flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-between' }}>
                                  
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.planned == "P" ? true : false}
                                            onValueChange={(newValue) =>
                                                fromRef.current.setFieldValue('planned', "P")
                                            }
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                        />
                                        <Text style={styles.checkboxText}>Planned</Text>
                                    </View>


                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.planned == "U" ? true : false}
                                            onValueChange={(newValue) => {
                                                fromRef.current.setFieldValue('planned', "U")
                                            }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                        />
                                        <Text style={styles.checkboxText}>Unplanned</Text>
                                    </View>


                                </View>
                            </View>
                            {errors.planned && touched.planned && (
                                <View
                                    style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        paddingVertical: 2,
                                    }}>
                                    <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                        {errors.planned}
                                    </Text>
                                </View>
                            )} */}

                            {/* <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                                Period
                            </Text> */}
                            {/* <View style={styles.box}>
                                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                   
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.period == "3" ? true : false}
                                            onValueChange={(newValue) => {
                                                fromRef.current.setFieldValue('period', "3")
                                            }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                        />
                                        <Text style={styles.checkboxText}>Full Day</Text>
                                    </View>
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.period == "1" ? true : false}
                                            onValueChange={(newValue) => {
                                                fromRef.current.setFieldValue('period', "1")
                                            }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                        />
                                        <Text style={styles.checkboxText}>1st Half</Text>
                                    </View>
                                </View> */}

                                {/* <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.period == "2" ? true : false}
                                            onValueChange={(newValue) => {
                                                fromRef.current.setFieldValue('period', "2")
                                            }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                        />
                                        <Text style={styles.checkboxText}>2nd Half</Text>
                                    </View>
                                </View>
                            </View>
                            {errors.period && touched.period && (
                                <View
                                    style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        paddingVertical: 2,
                                    }}>
                                    <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                        {errors.period}
                                    </Text>
                                </View>
                            )} */}



                            {/* <Text style={{ paddingVertical: 10, paddingHorizontal: 0,fontSize:13 }} Bold>
                                Select Date
                            </Text> */}
                            {/* <View
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
                                    date={fromDate}
                                    mode="date"
                                    theme='light'
                                    onConfirm={fromDate => {
                                        setOpen(false);
                                        setFromDate(fromDate);
                                        let format = moment(fromDate).format('DD-MMM-YYYY');
                                        // setTextinputDate(format);
                                        // // console.log($1);
                                        fromRef.current.setFieldValue('selectDate', format);
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
                                    date={toDate}
                                    mode="date"
                                    theme='light'
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
                            </View> */}
 <View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Financial Year  {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                
                   <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={selectedFinYear}
                    defaultButtonText={route.params.finYear}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    
                    dropdownBackgroundColor={'transparent'}
                    data={fin_year}
                    onSelect={(selectedItem, index) => {
                        GetFnyear("","","");
// $&
// $&
                      setfn_yr(selectedItem.value);
                      setSelectedFinYear(selectedItem);
                      GetMonth(selectedItem.value,mnt,blck);
                      setSelectedItem(selectedItem); 
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

           
           
            <View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                 Payroll Month  {<Text style  ={{color :'red'}}>*</Text>}
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
                    defaultButtonText={mnt}
                    defaultValue={'Select Month'}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={mnth}
                    onSelect={(selectedItem, index) => {
// $&
// $&
                     
                      // {selectedItem.value == 'Select Yr.'?GetBlock(fn_yr,selectedItem.value,blck):GetMonth(fn_yr,"","")}
                    
                      GetBlock(fn_yr,selectedItem.value,"");
                     // setmnt(selectedItem.value);
                     setmnt(selectedItem.label);
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
            <View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                 Block No.  {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
               

                   <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultButtonText={route.params.period}
                    defaultValue={def_options}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={block}
                    onSelect={(selectedItem, index) => {
// $&
// $&
                      setblck(selectedItem.label);

                      GetData(fn_yr,mnt,selectedItem.label);
                      GetBlock(fn_yr,mnt,"")
                      // GetRawPunch(fn_yr,mnt,selectedItem.label);
                      // {selectedItem.value == 'Select Mnth'?GetBlock(fn_yr,mnt,""):GetFnyear("","","")}
                    
                     // GetBlock(fn_yr,mnt,"")
                     
                     
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

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',borderWidth:1,borderRadius:1,borderColor:"#43C6DB" ,backgroundColor:"#fff",marginVertical:10}}>
              <View style ={{marginHorizontal:10}}>
            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                                Days
            </Text>
            </View>
          <View>
          

           
          <View style ={{marginHorizontal:-15}}>


            <TouchableOpacity
               onPress={() => decrement()}
              >
            <Image
              source={require('../../assets/Images/home/minus.png')}
              style={{
                width: 25,
                height: 25,
                overflow: 'hidden',
                borderRadius: 100,
                alignSelf: 'center',
              }}
            />
            </TouchableOpacity>
</View>
          
            </View>
            <View style ={{marginHorizontal:-10}}>
            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                        {value}        
            </Text>
            </View>
            <View style ={{marginHorizontal:8}}>
      


        <TouchableOpacity
            onPress={() => increment()}
            >
            <Image
              source={require('../../assets/Images/home/plus.png')}
              style={{
                width: 25,
                height: 25,
                overflow: 'hidden',
                borderRadius: 100,
                alignSelf: 'center',
              }}
            />
            </TouchableOpacity>

   
            </View>
            </View>

                            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                                Enter Your Reason
                            </Text>

                            <View style={styles.box}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (checked == null) {
                                            Toast.show("Please select leave type");
                                            return;
                                        }
                                        toggleModal()
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        padding: 10,
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={{fontSize:13}}>{validReason}</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        color={'#43C6DB'}
                                        size={20}
                                    />


                                    <Modal isVisible={isModalVisible}>
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
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                }}>
                                                <Text
                                                    Bold
                                                    style={{
                                                        fontSize: 14
                                                    }}>
                                                    Select Reason
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
                                                data={Leavereason}
                                                keyExtractor={item => item.id}
                                                renderItem={rederReason}
                                            />
                                        </View>
                                    </Modal>
                                </TouchableOpacity>
                            </View>
                            {errors.reason && touched.reason && (
                                <View
                                    style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        paddingVertical: 2,
                                    }}>
                                    <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                        {errors.reason}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.comment}>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={10}
                                    placeholder={'Comments'}
                                    onChangeText={handleComment}
                                    onBlur={handleBlur('comment')}
                                    value={LeaveComment}
                                />
                            </View>

                            {errors.comment && touched.comment && (
                                <View
                                    style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        paddingVertical: 2,
                                    }}>
                                    <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                        {errors.comment}
                                    </Text>
                                </View>
                            )}
                            <View style={{ height: 100, marginTop: 20, width: "100%", alignSelf: 'center' ,marginBottom:"20%"}}>
                                <Button
                                    onPress={() => {
                                      PostSubmitLeave();
                                    }}
                                    title={"Submit"}
                                ></Button>
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: GlobalColor.PrimaryLight
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
        borderColor: GlobalColor.Secondary
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
    circleBox: {
        width: "16.6%",
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
    comment: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%',
        maxHeight: 100,
        height:170,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10
    },
    spinnerTextStyle: {
        color: '#fff'
    },
    addtnlBtn: {
        position: 'absolute',
        right: 10,
        top: 0,
        zIndex: 55555
    },
    checkboxContainer: {
        width: "50%",
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxText: {
        marginLeft: 2,
        fontSize:13
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


export default ApplyLeaveDuShort;