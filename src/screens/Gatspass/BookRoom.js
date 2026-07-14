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
import { CommonActions } from '@react-navigation/native';
import { rm } from 'fs';





const BookRoom = ({navigation,route}) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [searchLevel] = useState();
  const [Occupant, setOccupant] = useState([]);
  const [selOccupant, setSelOccupant] = useState([]);
  const [loader, setLoader] = useState(false);
  const [LocationDisabled, setLocationDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');


  const [rms, setRms] = useState([]);
  const [selRms, setSelRms] = useState([]);
  const [selRmID, setSelRmsID] = useState([]);

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


  const co_Occupant = [
    {
      label: 'No-Data',
      value: 'No-Data',
    },
    
  ];


  const optRooms = [
    {
      label: 'No-Data',
      value: 'No-Data',
    },
    
  ];

  let formatDet = new Date();

  const [BuildingData, setBuildingData] = useState([]);

  const [selectTime, setselectTime] = useState();
  const [OpenDateTimePicker, setOpenDateTimePicker] = useState(false);
 
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');


  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
 
    const [toDate, setToDate] = useState(new Date());
    const [toDateMy, setToMyDate] = useState(new Date((new Date()).getDate()-1));
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() + 7);
    const [maxToDate, setMaxToDate] = useState(new Date());
    const [textinputSecondDate, setTextinputSecondDate] = useState('');

    
  
    let d1 = new Date (),
    d2 = new Date ( d1 );
   // d2.setMinutes ( d1.getHours() + 30 );

   // // console.log($1);
// $&
    if(d1.getMinutes() > 30)
   {
    d2.setHours ( d1.getHours() + 1 );
    d2.setMinutes(0);
   // setFromDate(d2);
// $&
   }
   else{
    
   // d2.setMinutes(0);
    d2.setMinutes(30);
   // setFromDate(d2);
// $&
   }
   const [fromDate, setFromDate] = useState(d2);
   let [toDe, settoD] = useState(false);

   let myDate = new Date();
   


  const SearchEmployee = () => {
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;
// $&
  
      let apiData = {
        Search: search,
        UserName:userNt
      };
// $&
console.log(apiData);
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetRoomEmployee', apiData, token, authContext)
        .then(result => {
          setLoader(false);

          console.log()

// $&

          let responseData = result.Value;
// $&
// $&
console.log(responseData);

          if(responseData != '')
          {
  
          let responseDataNew = responseData.map(element => {
            return {
              
              label:element.EMPL_NAME,
              value:element.EMPL_ID
             
            };
          });
  
// $&
        
          setOccupant(responseDataNew);
// $&
        //   // console.log($1);
        //   // console.log($1);
        //   setsuperEmpId(responseData[0].DEP_EMPL_ID);
        //   setsuperEname(responseData[0].EMPL_NAME);
        }
        else{
  
          setOccupant(co_Occupant);
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


 
  const getRooms = () => {
    let userId = AppUserData?.data?.userId;
    let userNt = AppUserData?.data?.userNT;
   
  
      let apiData = {
         "UserName":userNt,
        "StartTime":moment(fromDate).format('DD-MMM-YYYY hh:mm:01 a'),
        "EndTime": moment(myDate).format('DD-MMM-YYYY hh:mm:00 a'),
      };
// $&
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/GetRoomsFlag', apiData, token, authContext)
        .then(result => {
          setLoader(false);

// $&

          let responseData = result.Value;
// $&


          if(responseData != '')
          {
  
          let responseDataNew = responseData.map(element => {
            return {
              
              label:element.ROOM_NO,
              value:element.FLAG
              
            };
          });
  
// $&
        
          setRms(responseDataNew);
// $&
        //   // console.log($1);
        //   // console.log($1);
        //   setsuperEmpId(responseData[0].DEP_EMPL_ID);
        //   setsuperEname(responseData[0].EMPL_NAME);
        }
        else{
  
          setRms(optRooms);
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




  const bookRooms = () => {


    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;

    let userNt = AppUserData?.data?.userNT;



   
    // // console.log($1);
// $&
// $&
// $&
// $&


    var d1 = new Date(fromDate);
    var d2 = new Date(toDate);
 
// $&
// $&
   
 
    if(d1.getTime() >= d2.getTime())
    {
      Alert.alert("To Date should be greater then from date!!!!");
    }
   else  if(selOccupant == '')
    {
      Alert.alert("Please select Co-Occupant");
    }

    else if(selRmID == '')
    {
      Alert.alert("Please select available rooms");
    }

    else if(inputValue == '')
    {
        Alert.alert("Please enter meeting reason");
    }

  
   

    else{

      let newdata = {
            "UserName": userNt,
            "RoomID": selRmID,
            "StartTime": moment(fromDate).format('MMM-DD-YYYY H:mm:01'),
            "EndTime": moment(toDate).format('MMM-DD-YYYY H:mm:00'),
            "EmplID": selOccupant,
            "Remarks": inputValue,
         
          };

          

// $&

    setLoader(true);
    ApiService.PostMethode('/Insert_Rooms', newdata, token, authContext)
      .then(result => {
// $&
       
        if(result.Value == 'Room Is Booked Succesfully!'){
          Alert.alert(result.Value);
          //Toast.show("Gate pass Generated Successfully");
          navigation.dispatch(
            CommonActions.navigate({
              name: 'RoomBookingHome',
            })
          );
        }

        else if(result.Value == 'Room is not available')
        {
          Alert.alert(result.Value);
          //Toast.show("Gate pass Generated Successfully");
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BookRoom',
            })
          );
        }
        else{
          navigation.dispatch(
            CommonActions.navigate({
              name: 'BookRoom',
            })
          );
          Alert.alert(result.Value);
         //Toast.show(result.Value);
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


  useEffect(() => {
    SearchEmployee();
 

    
   
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
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Header title="Book Room" />
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
          selectDate:'',
          selectToDate:'',
         
          searchEmp: '',
          perName: '',
          Desig: '',
        
          MOB_NO:''
        }}
        onSubmit={values => {
         // // console.log($1);

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
     
         // // console.log($1);
          // return;
         
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
                                    minuteInterval={30}
                                    date={fromDate}
                                    mode="datetime"
                                    theme='light'
                                    title={"Select Date and Time"}
                                    is24hourSource={true}
                                    
                                    minimumDate={new Date()}
                                    maximumDate={new Date(moment(lastWeek).format('YYYY-MM-DD 23:59:59'))}
                                    onConfirm={frmDate => {
                                        setOpen(false);
                                        settoD(false);
                                        setFromDate(frmDate); 
                                       
                                        formatDet = frmDate;
                                      //  d2 = new Date(frmDate);
                                       // // console.log($1);
                                        setToMyDate(new Date(frmDate));
                                       // // console.log($1);
                                        //let format = moment(frmDate).format('DD-MMM-YYYY  hh:mm');
// $&
                                       
                                        // MMM-DD-YYYY hh:mm:ss a
// $&


                                        let format = moment(frmDate).format('DD-MMM-YYYY  H:mm');
                                        // setTextinputDate(format);
// $&
                                        fromRef.current.setFieldValue('selectDate', format);
                                       
                                    }}
                                    onCancel={() => {
                                        setOpen(false);
                                    }}
                                />
                               
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '48%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                       <TouchableOpacity onPress={() => setOpen(true)}>
                                    <TextInput2
                                        placeholder="Start date"
                                        style={{
                                            color: '#000',
                                            fontSize:11
                                        }}
                                        editable={false}
                                        paddingHorizontal={5}
                                        value={values.selectDate}
                                    />
                                  </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setOpen(true)}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color={'#43C6DB'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <DatePicker
                                    modal
                                    open={second}
                                    date={toDateMy}
                                    minimumDate={fromDate}
                                    mode="time"
                                    theme='light'
                                    minuteInterval={30}
                                    is24hourSource={false}
                                    onConfirm={toDate => {
                                      setSecond(false);
                                      setToMyDate(toDate);

                                      var d1 = new Date(fromDate);
                                      var d2 = new Date(moment(toDate).format('YYYY-MM-DD H:mm:01'));
// $&
// $&
                                      toDe == false? setToDate(d2):setToDate(toDate);

                                      if(values.selectDate == '')
                                      {
                                        fromRef.current.setFieldValue('selectToDate','');
                                        Alert.alert("Please select from date");
                                      }
                                      else{
                                      myDate = toDate;
                                       // setSecond(false);
                                        setToDate(toDate);
                                        settoD(true);
// $&
                                       // let formatSecond = moment(toDate).format('DD-MMM-YYYY  hh:mm');
                                       
                                        let formatSecond = moment(toDate).format('DD-MMM-YYYY  H:mm');
                                        // setTextinputDate(format);
                                        // // console.log($1);
                                        fromRef.current.setFieldValue('selectToDate', formatSecond);
                                        getRooms();
                                      }
                                        // MMM-DD-YYYY hh:mm:ss a
                                        //// console.log($1);
                                       
                                    }}
                                    onCancel={() => {
                                        setSecond(false);
                                    }}
                                />
                                
                                <View
                                    
                                    style={{
                                        flexDirection: 'row',
                                        width: '55%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                      <TouchableOpacity onPress={ () =>  setSecond(true)}>
                                    <TextInput2
                                        style={{ color: '#000', letterSpacing: 1,fontSize:11 ,width:'115%'}}
                                        placeholder="End Date"
                                        editable={false}
                                        paddingHorizontal={5}
                                        value={toDe == true ? values.selectToDate:values.selectDate}
                                    />
                                  </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSecond(true)}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            style={{marginRight:8}}
                                            color={'#43C6DB'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

            {/* Search Level */}
            <View style={{marginVertical: 5}}>
              <View style={{marginBottom: 5}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    // paddingVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                 Co-Occupant:	
                </Text>
              </View>

              <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={co_Occupant}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
// $&
                      return item.label;
                    }}
                    data={Occupant}
                    onSelect={(selectedItem, index) => {
                      // // console.log($1);
                      // // console.log($1);
                      // // console.log($1);
                     // setSuperVision(selectedItem);
                    //   // console.log($1);
                    setSelOccupant(selectedItem.value);
                      setFieldValue('SPRFLAG', selectedItem);
// $&
// $&
                     // setselectSuperVis(selectedItem.value);
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
              {errors.searchLevel && touched.searchLevel && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                    {errors.searchLevel}
                  </Text>
                </View>
              )}
            </View>


            <View style={{marginVertical: 5}}>
              <View style={{marginBottom: 5}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    // paddingVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
              Available Rooms:	
                </Text>
              </View>

              <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label == 'No-Data'?'Please select to Date':selectedItem.label.split('~')[1];
                    }}
                    defaultValue={optRooms}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
// $&
                      return item.label;
                    }}
                    data={rms == ''?optRooms:rms}
                    
                    onSelect={(selectedItem, index) => {
                      // // console.log($1);
                      // // console.log($1);
                      // // console.log($1);
                     // setSuperVision(selectedItem);
                    //   // console.log($1);
                      setSelRms(selectedItem.label);
                      setFieldValue('SPRFLAG', selectedItem);
                      setSelRmsID(selectedItem.label.split('~')[0]);
// $&
// $&
                     // setselectSuperVis(selectedItem.value);
                      //setFieldValue('internalVehical', selectedItem);
                    }}
                    
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderCustomizedRowChild={(item, index) => (
                      item.value == 'No-Data'?<Text style ={{fontSize:13}}> Please select to Date</Text>:
                      <View style={[styles.rowContainer]}>
                         <View style={[styles.circle,{backgroundColor:item.value.split('-')[0]}]}></View>
                         <Text style ={{fontSize:13}}> {item.label.split('~')[1]}</Text>
                         <Text Bold style ={{paddingHorizontal:3,fontSize:10,}}> Booked By : {item.value.split('-')[1]}</Text>
                        
                         {/* <Text> {item.value}</Text> */}

                      </View>
                    )}
                    
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
              {errors.searchLevel && touched.searchLevel && (
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                    {errors.searchLevel}
                  </Text>
                </View>
              )}
            </View>

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
                  Note *
                </Text>
                <TextInput
                  placeholder="Reason"
                  onChangeText={text => setInputValue(text)}
                  onBlur={handleBlur('reason')}
                  value={inputValue}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 6,
                    alignSelf: 'center',
                    borderColor: '#43C6DB',
                    fontSize: 12,
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
                        <View style={{marginVertical: 15}}>
                           <Button  onPress={() => {
                                      bookRooms();
                              }} title="SUBMIT" textStyle={{fontSize:13,}}></Button>
                              </View>


                         <View style={[styles.rowContainer1]}>
                         <View style={[styles.circle1,{backgroundColor:'#FF0000'}]}></View>      
                         <Text Bold style ={{fontSize:13, paddingHorizontal:8,}}>Booked</Text>
                         </View>

                         <View style={[styles.rowContainer1]}>
                         <View style={[styles.circle1,{backgroundColor:'#FFA500'}]}></View>      
                         <Text Bold style ={{fontSize:13,paddingHorizontal:8,}}>Partially Booked</Text>
                         </View>

                         <View style={[styles.rowContainer1]}>
                         <View style={[styles.circle1,{backgroundColor:'#008000'}]}></View>      
                         <Text Bold style ={{fontSize:13,paddingHorizontal:8,}}>Available</Text>
                         </View>
            {/* Vehicle number */}


            {/* Select Building / multiple selection*/}
          
            {/* SEARCH BOX */}

         

       

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
  width: 13,
  height: 13,
  borderRadius: 28/2,
  marginTop:2,
   
 },

 circle1: {
  width: 15,
  height: 15,
  borderRadius: 30/2,
  marginTop:2,
  
 
},
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    marginLeft:10,
  
  },

  rowContainer1: {
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
});

// //make this component available to the app
export default BookRoom;
