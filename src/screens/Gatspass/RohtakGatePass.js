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
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

let lvl = 1;
let formatDet = new Date();
const RohtakGatePass = ({navigation}) => {
  let BuildName = '';
  
  const [open, setOpen] = useState(false);
  const [second, setSecond] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [maxToDate, setMaxToDate] = useState(new Date());
  const [searchLevel] = useState();
  const [searchLevelData, setSearchLevelData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [textinputSecondDate, setTextinputSecondDate] = useState('');
  const [inputMob, setInputMob] = useState('');

  const [toDateMy, setToMyDate] = useState(new Date((new Date()).getDate()-1));

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  

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

  const visitorType = [
    {
      label: 'Other',
      value: 'OTH',
    },
    
  ];

  const visitorlevel = [
    {
      label: '1',
      value: '1',
    },

    {
      label: '2',
      value: '2',
    },

    {
      label: '3',
      value: '3',
    },
    
  ];

  const Purpose = [
    {
      label: 'Select',
      value: '',
    },
    {
      label: 'MEETING',
      value: 'MEETING',
    },
    {
      label: 'DELIVERY',
      value: 'DELIVERY',
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
      label: 'COMPONENT FITMENT/VEHICLE STUDY',
      value: 'COMPONENT FITMENT/VEHICLE STUDY',
    },
    {
      label: 'DISCUSSION/PRESENTATION',
      value: 'DISCUSSION/PRESENTATION',
    },
    {
      label: 'TRAINING BY SUPPLIER',
      value: 'TRAINING BY SUPPLIER',
    },
    {
      label: 'TESTING WITH SUPPLIER',
      value: 'TESTING WITH SUPPLIER',
    },
    {
      label: 'OTHER',
      value: 'OTHER',
    },
  ];

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() + 20);
  

  const [selectBuilding, setSelectBuilding] = useState([]);
  const [BuildingData, setBuildingData] = useState([]);
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
  const [VisitorLevel, setVisitorLevel] = useState('1');
  const [employBuilding, setEmployBuilding] = useState([]);
  const [searchBuild, setSearchBuild] = useState('');
  const [empmodalBuild, setEmpModalBuild] = useState(false);

  const [timeExp, settimeExp] = useState(new Date());

  const [Locations, setLocations] = useState([]);

  const [purposeData, setpurposeData] = useState('');
  const [inputValue, setInputValue] = useState('');

  const showDatePickera= () => {
    setDatePickerVisibility(true);
  };

  const hideDatePickera = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirma = (date) => {
    console.warn("A date has been picked: ", date);
    settimeExp(date);
    hideDatePicker();
  };

  const GetLocationListVGPSApi = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    // console.log('UserName', userId);
    let apiData = {UserName: userId};
    // console.log(apiData);
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTLocnList', apiData, token, authContext)
      .then(result => {
        // console.log('APiresult RHTKVSTLocnList', result);
        setLoader(false);
        if (result?.Value?.length > 0) {
          setLocations(result.Value);
          let Location = result.Value[0].LOCN;
          let LocationCode = result.Value[0].CODE;
          //  console.log("LocationCode", LocationCode)
          setEmpLoc(Location);
          setEmpLocCode(LocationCode);
          //console.log("Location code is ",empLocCode.split(',')[0]);
          fromRef.current.setFieldValue('office', result.Value[0]);
          GetAccessListVGPSApi(result.Value[0].CODE.split(',')[0]);
        } else {
          setLocationDisabled(true);
          setLocations([]);
        }
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetSearchLevelsListVGPSApi = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    // console.log('UserName Search level', userId);
    let apiData = {UserName: userId};
    // console.log('Search level-----',apiData);
    setLoader(true);
    ApiService.PostMethode(
      '/GetSearchLevelsListVGPS',
      apiData,
      token,
      authContext,
    )
      .then(result => {
        // console.log('Search level-----', result);
        setLoader(false);
        if (result?.Value?.length > 0) {
          let arrData = result.Value.map(item => {
            return {label: item.MEANING, value: item.VAL};
          });
          setSearchLevelData(arrData);
          fromRef.current.setFieldValue('searchLevel', arrData[0]);
        }
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const SearchEmployee = () => {
    let userId = AppUserData?.data?.userId;
    // console.log('post data', search);
    if (search === '') {
      alert('Please enter a valid keyWord ');
      return;
    } else {
      let apiData = {
        Search: search,
        UserName:userId
      };
      // console.log(apiData);
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/RHTKVSTConEmpllookup', apiData, token, authContext)
        .then(result => {
          setLoader(false);

          // console.log('ApiResult in Search Employee 2', result);

          let responseData = result.Value;
          // console.log('ApiResult', responseData);
          setEmploy(responseData);
          setEmpModalVisible(true);
        })
        .catch(error => {
          setLoader(false);
          // console.log('Error occurred==>', error);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  };

  const SearchEmployeeBuilding = () => {
    let userId = AppUserData?.data?.userId;
    // console.log('post data', search);
    if (searchBuild === '') {
      alert('Please enter a valid keyWord ');
      return;
    } else {
      let apiData = {
        Search: searchBuild,
        UserName:userId
      };
      // console.log('Api in Concern',apiData);
      let token = AppUserData.token;
      setLoader(true);
      ApiService.PostMethode('/RHTKVSTConEmpllookup', apiData, token, authContext)
        .then(result => {
          setLoader(false);

          // console.log('ApiResult in Concern', result);

          let responseData = result.Value;
          // console.log('ApiResult in building', responseData);
          setEmployBuilding(responseData);
          setEmpModalBuild(true);
        })
        .catch(error => {
          setLoader(false);
          // console.log('Error occurred==>', error);
          ApiService.showErrorMessage(error, authContext);
        });
    }
  };
  const GetAccessListVGPSApi = (locationcode = '001') => {
    let userId = AppUserData?.data?.userId;
    let visitlevel = VisitorLevel;
    
    // let newLoc = empLocCode.split(",")[0]
    // console.log("Visitor level in Building" ,lvl);
    let apiData = {
      UserName: userId,
      LocationCode: locationcode,
      LevelID:lvl,
    };
    // console.log('post data in Building ', apiData);
    // console.log('post userId', userId);
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetAccessListVGPS', apiData, token, authContext)
      .then(result => {
        setLoader(false);
        let responseData = result.Value;
        // console.log('building data', responseData)
        let responseDataNew = responseData.map(element => {
          return {
            ...element,
            isSelected: false,
          };
        });
        // console.log("response data new", responseDataNew);
        setBuildingData(responseDataNew);
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  useEffect(() => {
    GetLocationListVGPSApi();
    GetSearchLevelsListVGPSApi();
    //GetAccessListVGPSApi();
  }, []);
  // useEffect(() => {
  //   console.log(selectBuilding);
  // }, [selectBuilding])

  const emptyList = () => {
    setSearch('');
  };

  const emptyListBuild = () => {
    setSearchBuild('');
  };

  const gatePassScheema = yup.object().shape({
    office: yup.object().required('Location is required'),
    date: yup.string().required('select one is required'),
    duration: yup
      .string()
      .required('Duration  is required')
      .max(24, 'Duration should be less then 24 hours'),
    // searchLevel: yup.object().required('select one search level please'),
    Purpose: yup.object().required('Select an option'),
    // persionalVehical: yup.object().required('Select an option'),
    // internalVehical: yup.object().required('Select an option'),
    // VisitLevel: yup.object().required('Select an option'),
    // VisitType: yup.object().required('Select an option'),

    
    // vehicleNumber: yup.string().test('Vehicle Number is required', function () {
    //   if (this.parent.persionalVehical.value === 'N') {
    //     return true;
    //   } else {
    //     if (this.parent.vehicleNumber) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // }),
    building: yup.string().required('Building it is required'),
    searchEmp: yup.string().required('Please select an employee'),
    VisitLevel: yup.object().required('Select an option'),
    // VisitType: yup.object().required('Select an option'),
    mobEmp: yup
    .string()
    .required('Please enter mobile number')
    .matches(/^[0-9]+$/, 'Only digits are allowed')
    .length(10, 'Mobile number must be 10 digits'),
  
    // perName:yup.string().required('Please enter employee name'),
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
    // console.log("Time Picker demo",date);
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
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalColor.PrimaryLight,marginBottom:"35%"}}>
      
    
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {/* <Header title="Rohtak Visitor Gatepass" /> */}
      {/* BODY */}
      <Formik
        // enableReinitialize
        innerRef={fromRef}
        validateOnBlur={false}
        validationSchema={gatePassScheema}
        initialValues={{
          office: '',
          date: new Date(),
          duration: '',
          searchLevel: '',
          reason: '',
          persionalVehical: {
            label: 'No',
            value: 'N',
          },
          internalVehical: {
            label: 'No',
            value: 'N',
          },
          visitorType: {
            label: 'Other',
            value: 'OTH',
          },

          VisitorLevel: {
            label: '',
            value: '',
          },
          vehicleNumber: '',
          building: '',
          searchEmp: '',
          perName: '',
          Desig: '',
          noOfPerson: '',
          empId: '',
          MOB_NO:'',
          searchEmpBuild: '',
          perNameBuild: '',
          empIdBuild: '',
          DesigBuild: '',
          MOB_NOBuild: '',
          VisitLevel:'',
          VisitType:'',
          Purpose:'',
          mobEmp:'',
         
        }}
        onSubmit={values => {
           console.log('values', BuildingData);

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
            visitDateFrom: fromDate,
            visitDateTo:toDate,
            visitDate: moment(values.date).format('MM-DD-YYYY'),
            authorizedPerson: AppUserData?.data?.userId,
            Pvehicle: values.persionalVehical.value,
            VisType: 'O',
            visLevel: lvl,
            // buildings: buldings,
            buildings: buldings?.join(', '),
            duration: values.duration,
            exArrTime: moment(timeExp).format('hh:mm'),
            SearchLevel: values.searchLevel.value,
            interVehicle: values.internalVehical.value,
            ReasonToCome: purposeData == 'OTHER'?"Other Reason "+values.reason :purposeData,
            perName: values.perName,
            Desig: values.Desig,
            noOfPerson: '5',
            empId: values.empId,
            vehicleNumber: values.vehicleNumber,
            dateDummy: moment(values.date).format('MM-DD-YYYY'),
            mobileNo:values.mobEmp,
            perNameBuild:values.perNameBuild,
            empIdBuild: values.empIdBuild,
            DesigBuild: values.DesigBuild,
            mobileNoBuild:values.MOB_NOBuild,
          };
           console.log('payload----', newdata);
         // console.log('search level my',values.searchLevel.value);
          // return;
          navigation.navigate('VisitorDetailRohtak', {
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
            <View style={{paddingBottom: 5}}>
              <Text
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 5,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Your Location {<Text style  ={{color :'red'}}>*</Text>}
              </Text>
            </View>

         

            <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        is24Hour={false}
        onConfirm={handleConfirma}
        onCancel={hideDatePickera}
      />

            <SelectDropdown
              data={Locations}
              disabled={LocationDisabled}
              defaultValue={values.office}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index);
                // console.log(selectedItem);
                setBuildingData([]);
                // setFieldValue('office', selectedItem.CODE);
                setFieldValue('office', selectedItem);
                GetAccessListVGPSApi(selectedItem.CODE.split(',')[0]);
              }}
              defaultButtonText={
                LocationDisabled ? 'No location found' : 'Select Location'
              }
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem.LOCN;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item.LOCN;
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
              mode="datetime"
              theme='light'
              open={OpenDateTimePicker}
              minimumDate={new Date()}
              date={values.date}
              onConfirm={date => {
                // console.log(date);
                setFieldValue('date', date);
                setOpenDateTimePicker(false);
                // setDate(date);
                // console.log(date);
              }}
              onCancel={() => {
                setOpenDateTimePicker(false);
              }}
            />

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
                                    minimumDate={new Date()}
                                    maximumDate={lastWeek}
                                    onConfirm={frmDate => {
                                        setOpen(false);
                                        setToMyDate(new Date(frmDate));
                                        formatDet = frmDate;
                                        // console.log("From Date is -----",frmDate);

                                        let format = moment(frmDate).format('MM-DD-YYYY');
                                        setFromDate(format);

                                        // setFromDate(fromDate);
                                        // let format = moment(fromDate).format('DD-MMM-YYYY');

                                       // let mydett = fromDate;
                                       // mydett.setDate(fromDate.getDate() + 20)
                                        
                                       // setMaxToDate(mydett);

                                        // setTextinputDate(format);
                                        // console.log(setTextinputDate);
                                        fromRef.current.setFieldValue('selectDate', moment(frmDate).format('DD-MMM-YYYY'));

                                        let mydett = formatDet;
                                        mydett.setDate(frmDate.getDate() + 20)
                                        setMaxToDate(mydett);
                                        // console.log("my date in visitor",mydett);
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
                                    mode="date"
                                    theme='light'
                                    minimumDate={toDateMy}
                                    maximumDate={maxToDate}
                                    onConfirm={toDate => {
                                        setSecond(false);
                                        setToDate(toDate);
                                        let formatSecond = moment(toDate).format('DD-MMM-YYYY');
                                        setTextinputSecondDate(formatSecond);
                                        // console.log(setTextinputSecondDate);
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

            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{width: '70%', paddingRight: 10}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingTop: 10,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    Expected Arrival Time:  {<Text style  ={{color :'red'}}>*</Text>}
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
                    onPress={() => showDatePickera(true)}>
                    <Text style={{color: 'gray',fontSize:13}}>
                      {moment(timeExp).format('hh:mm a')}
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

                <View style={{width: '30%'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingTop: 10,
                      paddingVertical: 5,
                      fontSize:13
                    }}
                    Bold>
                    Duration {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <TextInput
                    style={{
                      width: '100%',
                      borderWidth: 1,
                      padding: 6,
                      backgroundColor: '#fff',
                      borderColor: '#43C6DB',
                      fontSize:13,
                      height:25
                    }}
                    maxLength={10}
                    onChangeText={handleChange('duration')}
                    onBlur={handleBlur('duration')}
                    value={values.duration}
                    keyboardType={'number-pad'}
                  />
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

            {/* Search Level */}
            <View style={{marginVertical: 5,display: 'none'}}>
              <View style={{marginBottom: 5}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    // paddingVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Search Level
                </Text>
              </View>

              <SelectDropdown
                data={searchLevelData}
                defaultValue={values.searchLevel}
                onSelect={(selectedItem, index) => {
                  // console.log(selectedItem, index);
                  // console.log('selectedItem', selectedItem);
                  // setFieldValue('searchLevel', selectedItem.value);
                  setFieldValue('searchLevel', selectedItem);
                }}
                defaultButtonText={'Select Search Level'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item.label;
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
                  Reason of Visit {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                {/* <TextInput
                  placeholder="Reason"
                  maxLength={50}
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  value={values.reason}
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
                    defaultValue={values.Purpose}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={Purpose}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                      // console.log(selectedItem.value);
                      setpurposeData(selectedItem.value);
                      setFieldValue('Purpose', selectedItem);
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
                {errors.Purpose && touched.Purpose && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                      {errors.Purpose}
                    </Text>
                  </View>
                )}
              </View>
            </View>

{purposeData == 'OTHER' ?

            <View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Other Reason {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  placeholder="Other Reason"
                  maxLength={50}
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  value={values.reason}
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

                 
               
              
              </View>
            </View>
            :null}

            {/* Personal Vehicle */}
            <View style={{width: '100%',display: 'none'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{width: '48%'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    Personal Vehicle
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
                      // console.log(selectedItem, index);
                      setFieldValue('persionalVehical', selectedItem);
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
                  {errors.persionalVehical && touched.persionalVehical && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.persionalVehical}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{width: '48%'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    Internal Vehicle
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
                    data={options}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                      setFieldValue('internalVehical', selectedItem);
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

            {/* Vehicle number */}

            {values.persionalVehical.value == 'Y' ? (
              <View style={{marginVertical: 5}}>
                <View style={{width: '100%'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      marginVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    Vehicle Number {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <TextInput
                    placeholder="Vehicle Number"
                    maxLength={24}
                    onChangeText={handleChange('vehicleNumber')}
                    onBlur={handleBlur('vehicleNumber')}
                    value={values.vehicleNumber}
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
                  {errors.vehicleNumber && touched.vehicleNumber && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.vehicleNumber}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : null}

            {/* Select Building / multiple selection*/}

            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View style={{width: '48%',display: 'none'}}>
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      paddingVertical: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                   Visitor Type {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={values.VisitType}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    // defaultButtonText="Yes"
                    dropdownBackgroundColor={'transparent'}
                    data={visitorType}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                      setFieldValue('VisitType', selectedItem);
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
                  {errors.VisitType && touched.VisitType && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.VisitType}
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
                   Visitor Level {<Text style  ={{color :'red'}}>*</Text>}
                  </Text>
                  <SelectDropdown
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                    defaultValue={values.VisitLevel}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                    data={visitorlevel}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                      
                      setFieldValue('VisitLevel', selectedItem);
                    
                      lvl = selectedItem.value;
                     
                    //  console.log("visitor level inner my",selectedItem.value);
                     setVisitorLevel(selectedItem.value);
                      // console.log("visitor level inner",VisitorLevel);
                      // console.log("Live value ",lvl);
                      //setFieldValue('VisitorLevel', selectedItem);
                      GetAccessListVGPSApi("041");
                     
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
                  {errors.VisitLevel && touched.VisitLevel && (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{fontSize: 14, color: 'red', textAlign: 'left'}}>
                        {errors.VisitLevel}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View>
              <View style={{width: '100%', alignSelf: 'center', marginTop: 10}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Select Building {<Text style  ={{color :'red'}}>*</Text>}
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
                            BuildName = element.BNAME,
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
                                fontSize:13
                              }}>
                              <TextInput
                                editable={false}
                                style={{color: '#fff', padding: 5,fontSize:13}}>
                                {
                                element.BNAME
                                }
                              </TextInput>
                              <TouchableOpacity
                                onPress={item => {
                                  let newState = [...BuildingData];
                                  newState[index].isSelected = false;
                                  
                                  setBuildingData(newState);
                                  setSelectBuilding(newState);
                                 
                                }}>
                                <Ionicons name="remove-circle" size={27} color={'#43C6DB'} />
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
                        keyExtractor={item => item.BID.toString()}
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
                               // console.log(newState);
                                setBuildingData(newState);
                                setSelectBuilding(newState);
                               
                               
                                
                              } else {
                                newState[index].isSelected = true;
                               // console.log(newState);
                                setBuildingData(newState);
                               
                              }

                              if (newState.length == 0) {
                                setFieldValue('building', '');
                              } else {
                                setFieldValue('building', 'added');
                              }
                            }}
                            >
                            <Text style={styles.checkboxLabel}>
                              {item.BNAME}
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
            

{BuildingData.length != 1 && lvl > 1 ?(
            <View>
              <View style={{width: '100%', marginVertical: 10,display: 'none'}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    paddingTop: 10,
                    paddingVertical: 5,
                    fontSize:13
                  }}
                  Bold>
                  Person/{BuildName}*
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    borderColor: '#43C6DB',
                  }}>
                  <View
                    style={{
                      width: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Feather name="search" size={18} color={'#43C6DB'} />
                  </View>

                  <TextInput
                    placeholder="Search By Name/Dept/Staff ID"
                    maxLength={20}
                    value={searchBuild}
                    // onBlur={handleBlur('searchEmp')}
                    onChangeText={data => {
                      setSearchBuild(data);
                    }}
                    style={{
                      width: '70%',
                      paddingVertical: 5,
                      fontSize: 13,
                    }}
                  />

                  {searchBuild !== '' ? (
                    <TouchableOpacity
                      style={{
                        borderRadius: 8,
                        marginLeft: -10,
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        emptyListBuild();
                      }}>
                      <Ionicons
                        style={styles.searchIcon}
                        name="close-circle-outline"
                        size={25}
                        color='#43C6DB'
                      />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      SearchEmployeeBuilding();
                    }}
                    style={{
                      width: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="send" size={20} color={'#43C6DB'} />
                  </TouchableOpacity>
                </View>

                {errors.searchEmp && touched.searchEmp && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text style={{fontSize: 14, color: 'red', marginTop: 10}}>
                      {errors.searchEmp}
                    </Text>
                  </View>
                )}

                {/* {search == '' ? (
                    <View>
                      <Text style={{ fontSize: 14, color: 'red', marginTop: 10 }}>
                        {errors.searchEmp}
                      </Text>
                    </View>
                  ) : null} */}

                {/* {searchAlert !== '' ? (<View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text
                    style={{ fontSize: 12, color: 'red', textAlign: 'left' }}>
                    {searchAlert}
                  </Text>
                </View>) : null} */}
              </View>

              {/* TExtInput */}

              {loader == true ? (
                <Spinner
                  visible={loader}
                  textContent={'Loading...'}
                  textStyle={{color: '#fff'}}
                />
              ) : null}
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginVertical: 10,
                  display: 'none',
                }}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Name
                </Text>
                <TextInput
                  value={values.perNameBuild}
                  editable={false}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize:13,
                    height:40
                  }}
                />

                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Designation
                </Text>
                <TextInput
                  value={values.DesigBuild}
                  editable={false}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    height:40,
                    fontSize:13
                  }}
                />

                {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Mobile
                </Text>
                <TextInput
                  value={values.MOB_NOBuild}
                  editable={false}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize:13,
                    height:40
                  }}
                /> */}
              </View>
              </View>
):null}
            {/* SEARCH BOX */}

            <View>
              <View style={{width: '100%', marginVertical: 10}}>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    paddingTop: 10,
                    paddingVertical: 5,
                    fontSize:13
                  }}
                  Bold>
                  Person/Employee to Meet {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    borderColor: '#43C6DB',
                  }}>
                  <View
                    style={{
                      width: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Feather name="search" size={18} color={'#43C6DB'} />
                  </View>

                  <TextInput
                    placeholder="Search By Name/Dept/Staff ID"
                    maxLength={20}
                    value={search}
                    // onBlur={handleBlur('searchEmp')}
                    onChangeText={data => {
                      setSearch(data);
                    }}
                    style={{
                      width: '70%',
                      paddingVertical: 5,
                      fontSize: 13,
                      height:40
                    }}
                  />

                  {search !== '' ? (
                    <TouchableOpacity
                      style={{
                        borderRadius: 8,
                        marginLeft: -10,
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        emptyList();
                      }}>
                      <Ionicons
                        style={styles.searchIcon}
                        name="close-circle-outline"
                        size={25}
                        color='#43C6DB'
                      />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      SearchEmployee();
                    }}
                    style={{
                      width: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="send" size={20} color={'#43C6DB'} />
                  </TouchableOpacity>
                </View>

                {errors.searchEmp && touched.searchEmp && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text style={{fontSize: 14, color: 'red', marginTop: 10}}>
                      {errors.searchEmp}
                    </Text>
                  </View>
                )}

                {/* {search == '' ? (
                    <View>
                      <Text style={{ fontSize: 14, color: 'red', marginTop: 10 }}>
                        {errors.searchEmp}
                      </Text>
                    </View>
                  ) : null} */}

                {/* {searchAlert !== '' ? (<View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    paddingVertical: 2,
                  }}>
                  <Text
                    style={{ fontSize: 12, color: 'red', textAlign: 'left' }}>
                    {searchAlert}
                  </Text>
                </View>) : null} */}
              </View>

              {/* TExtInput */}

              {loader == true ? (
                <Spinner
                  visible={loader}
                  textContent={'Loading...'}
                  textStyle={{color: '#fff'}}
                />
              ) : null}
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
                <TextInput
                  value={values.perName}
                  editable={false}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize:13,
                    height:40
                  }}
                />

                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Designation
                </Text>
                <TextInput
                  value={values.Desig}
                  editable={false}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    height:40,
                    fontSize:13
                  }}
                />

                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Mobile
                </Text>
                <TextInput          
                   keyboardType="numeric"
                   maxLength={10}
                   onChangeText={handleChange('mobEmp')}
                   onBlur={handleBlur('mobEmp')}
                   value={values.mobEmp}
                   // onBlur={handleBlur('mobEmp')}
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    borderWidth: 1,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    borderRadius: 8,
                    backgroundColor: GlobalColor.White,
                    borderColor: '#43C6DB',
                    fontSize:13,
                    height:40
                  }}
                />
                  {errors.mobEmp && touched.mobEmp && (
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text style={{fontSize: 14, color: 'red', marginTop: 10}}>
                      {errors.mobEmp}
                    </Text>
                  </View>
                )}
              </View>
            

              {/* Next Button */}
              <View style={{paddingVertical: 10,paddingBottom:70}}>
                <Button
                  title="Next"
                  onPress={() => {
                    handleSubmit();
                  }}
                  textStyle={{fontSize:13}}
                />
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
                          // console.log(item);
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
                          <Text style={{fontSize: 16}}>
                            {item.Name}
                          </Text>
                          <Text>
                            {item.Desg} , {item.Dept} (
                            {item['Staff No']})
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


            {/* Building Model Search Emp */}

            <Modal transparent={false} visible={empmodalBuild}>
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
                      setEmpModalBuild(false);
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
                    data={employBuilding}
                    keyExtractor={item => item['Staff No']}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.FlatListData}
                        key={index}
                        onPress={() => {
                          setFieldValue('searchEmp', item.Name);
                          setFieldValue('perNameBuild', item.Name);
                          setFieldValue('empIdBuild', item['Staff No']);
                          setFieldValue('DesigBuild', item['Desg']);
                          setFieldValue('MOB_NOBuild', item['mobilenumber']);                          
                          // console.log(item);
                          // setSearchedNameData(item)
                          setEmpModalBuild(false);
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
                          <Text style={{fontSize: 16}}>
                            {item.Name}
                          </Text>
                          <Text>
                            {item.Desg} , {item.Dept} (
                            {item['Staff No']})
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
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    marginTop:"15%"
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
export default RohtakGatePass;
