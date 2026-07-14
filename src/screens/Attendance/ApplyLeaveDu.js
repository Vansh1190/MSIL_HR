//import liraries
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';


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



const ApplyLeaveDu = ({navigation,route}) => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [loader, setLoader] = useState(false);
    const [textinputSecondDate, setTextinputSecondDate] = useState('');
    const [open, setOpen] = useState(false);
    const [second, setSecond] = useState(false);
    const [checked, setChecked] = useState(null);
    const [validReason, setValidReason] = useState('Select Reason');
    const { authContext, AppUserData } = useContext(AuthContext);
    // const [comment, setComment] = useState('');
    // added for leave page 
    const [LeaveTypes, setLeaveTypes] = useState([]);
    const [Leavereason, setLeavereason] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);
    
  
  
  
    useFocusEffect(
      React.useCallback(() => {
        const unsubscribe = getleavetypes();
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
    //   period: yup.string().required('Please select period'),
    //   selectDate: yup.string().required('Start Date is required'),
    //   selectDateSecond: yup.string().required('End Date is required'),
      reason: yup.string().required('Please select a reason'),
    //   comment: yup.string().required('Comment is required'),
    });
    const fromRef = useRef(null);
  
    const PostSubmitLeave = data => {
// $&
      // let dummydata = 
      //   {
      //     "UserName" : "222852",
      //     "StaffNo" :  "222852",
      //     "PlannedUnplanned" : "Planned",
      //     "LeaveType" :"69#N#N",
      //     "Period" : "3",
      //     "FromDate" : "20-JUL-2022",
      //     "ToDate" : "21-JUL-2022",
      //     "Reason" : "skgn sk",
      //     "Comments" : ""
      // }
  
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/SubmitLeave', data, token)
        .then(result => {
          setLoader(false);
// $&
          if(result.Result){
            if(result.Result.search("successfully") != -1){
              fromRef.current.resetForm();
              route.params.period = false;
              route.params.salDeductPay = '';
              setChecked(null);
              setValidReason("Select Reason");     
            }   
          }
        //   Toast.show(result.Result);

        Alert.alert(
            "Leave",
            result.Result,
            [
              {
                text: "OK",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
            ]
          );
        })
        .catch(error => {
          setLoader(false);
        //   // console.log($1);
          ApiService.showErrorMessage(error, authContext);
        });
    };
  
    const getleavetypes = () => {
        // console.log("1---",route.params.period);
// $&
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
                // // console.log($1);
                setValidReason(item.REASON);
                fromRef.current.setFieldValue('reason', item.LOOKUP_CODE);
                setModalVisible(false);
              }}>
              <Text style={{fontSize:13}}>{item.REASON}</Text>
            </TouchableOpacity>
          </View>
        );
      };
    
  
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                loader ?
                    <Spinner
                        visible={loader}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    : null
            }
          <Header title="Apply Leave" />
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
                        period:
      route.params.period === 'Full Day'
        ? '3'
        : route.params.period === 'First Half'
        ? '1'
        : route.params.period === 'Second Half'
        ? '2'
        : '',
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
                            "UserName": AppUserData?.data?.username,
                            "StaffNo": AppUserData?.data?.userId,
                            "PlannedUnplanned": values.planned,
                            "LeaveType": values.leave,
                            "Period": values.period.toString(),
                            // "Period": route.params.period == 'Full Day'?'3':(route.params.period == 'First Half'?'1':'2'),
                            "FromDate": route.params.salDeductPay,
                            "ToDate": route.params.salDeductPay,
                            "Reason": values.reason,
                            "Comments": values.comment
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
                        <View style={{ flex: 1,marginBottom: "10%" }}>
                            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
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
                                                    GetLeaveReason(item.value);
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

                            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                                Planned/Unplanned
                            </Text>
                            <View style={styles.box}>
                                <View style={{ flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-between' }}>
                                    {/* <RadioForm
                          formHorizontal={true}
                          labelHorizontal={true}
                          borderRadius={0}
                          radio_props={radio_props}
                          initial={isSelected}
                          onPress={value => {
                            setSelection(isSelected);
                            fromRef.current.setFieldValue('planned', value);
                          }}
                          borderWidth={0.5}
                          buttonInnerColor={'#e74c3c'}
                          buttonOuterColor={'#23f'}
                          buttonSize={10}
                          buttonOuterSize={20}                          
                        /> */}
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.planned == "P" ? true : false}
                                            onValueChange={(newValue) =>
                                                fromRef.current.setFieldValue('planned', "P")
                                            }
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                            boxType="square"
                                            // hideBox
                                            style={{ height: 20, width: 20, marginRight:8, }}
                                            onCheckColor={'#43C6DB'}
                                            onTintColor={'#43C6DB'}
                                            
                                        />
                                        <Text style={styles.checkboxText,styles.leaveHeadfer}>Planned</Text>
                                    </View>


                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            disabled={false}
                                            value={values.planned == "U" ? true : false}
                                            onValueChange={(newValue) => {
                                                fromRef.current.setFieldValue('planned', "U")
                                            }}
                                            tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
                                            boxType="square"
                                            // hideBox
                                            style={{ height: 20, width: 20, marginRight:5 }}
                                            onCheckColor={GlobalColor.Secondary}
                                            onTintColor={GlobalColor.Secondary}
                                        />
                                        <Text style={styles.checkboxText,styles.leaveHeadfer}>Unplanned</Text>
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
                            )}

<Text style={{ paddingVertical: 10, paddingHorizontal: 0, fontSize: 13, fontWeight: 'bold' }}>
  Period
</Text>

<View style={styles.box}>
  <View style={{ flexDirection: 'row', paddingTop: 8 }}>
    <View style={styles.checkboxContainer}>
      <CheckBox
        disabled={false}
        value={values.period === '3'}
        onValueChange={() => setFieldValue('period', '3')}
        boxType="square"
        style={{ height: 20, width: 20, marginRight: 5 }}
        tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
        onCheckColor={GlobalColor.Secondary}
        onTintColor={GlobalColor.Secondary}
      />
      <Text style={[styles.checkboxText, styles.leaveHeadfer]}>Full Day</Text>
    </View>

    <View style={styles.checkboxContainer}>
      <CheckBox
        disabled={false}
        value={values.period === '1'}
        onValueChange={() => setFieldValue('period', '1')}
        boxType="square"
        style={{ height: 20, width: 20, marginRight: 5 }}
        tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
        onCheckColor={GlobalColor.Secondary}
        onTintColor={GlobalColor.Secondary}
      />
      <Text style={[styles.checkboxText, styles.leaveHeadfer]}>1st Half</Text>
    </View>
  </View>

  <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
    <View style={styles.checkboxContainer}>
      <CheckBox
        disabled={false}
        value={values.period === '2'}
        onValueChange={() => setFieldValue('period', '2')}
        boxType="square"
        style={{ height: 20, width: 20, marginRight: 5 }}
        tintColors={{ true: GlobalColor.Secondary, false: GlobalColor.LightDark }}
        onCheckColor={GlobalColor.Secondary}
        onTintColor={GlobalColor.Secondary}
      />
      <Text style={[styles.checkboxText, styles.leaveHeadfer]}>2nd Half</Text>
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
                            )}



                            <Text style={{ paddingVertical: 10, paddingHorizontal: 0 ,fontSize:13}} Bold>
                                Select Date
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
                                    date={fromDate}
                                    mode="date"
                                
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
                                            fontSize:13
                                        }}
                                        editable={false}
                                        paddingHorizontal={14}
                                        value={route.params.salDeductPay}
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
                                        style={{  letterSpacing: 1,fontSize:13 }}
                                        placeholder="End Date"
                                        editable={false}
                                        paddingHorizontal={13}
                                        value={route.params.salDeductPay}
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
                            <View
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    padding: 0,
                                }}>
                                    <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                {errors.selectDate && touched.selectDate && (
                                        <View
                                            style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                                paddingVertical: 2,
                                            }}>
                                            <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                                {errors.selectDate}
                                            </Text>
                                        </View>
                                    )}
                                    </View>
                                    <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    {errors.selectDateSecond && touched.selectDateSecond && (
                                            <View
                                                style={{
                                                    width: '100%',
                                                    alignSelf: 'center',
                                                    paddingVertical: 2,
                                                }}>
                                                <Text style={{ fontSize: GlobalFontSize.error, color: 'red' }}>
                                                    {errors.selectDateSecond}
                                                </Text>
                                            </View>
                                        )}
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
                                        paddingVertical: 10,
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={{fontSize:13}}>{validReason}</Text>
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        color={'#43C6DB'}
                                        size={20}
                                    />


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
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                }}>
                                                <Text
                                                    Bold
                                                    style={{
                                                        fontSize: 14}}>
                                                    Select Reason
                                                </Text>
                                                <TouchableOpacity onPress={toggleModal}>
                                                    <Ionicons
                                                        name="close-circle-outline"
                                                        size={20}
                                                        color={'#43C6DB'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <FlatList
                                                data={Leavereason}
                                                keyExtractor={item => item.id}
                                                renderItem={rederReason}
                                            />
                                        </View>
                                        </SafeAreaView>
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
                                    onChangeText={handleChange('comment')}
                                    onBlur={handleBlur('comment')}
                                    value={values.comment}
                                    style={{height:80}}
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
                            <View style={{ height: 100, marginTop: 20, width: "90%", alignSelf: 'center',marginBottom:'20%' }}>
                                <Button
                                    onPress={() => {
                                        handleSubmit();
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
        
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
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
    leaveHeadfer:{
        fontSize:13
    },
    checkboxText: {
        marginLeft: 2,
        fontSize:13
    }
});


export default ApplyLeaveDu