//import liraries
import React, { useState, useRef, useContext, useEffect } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import VisitDetails from '../../components/VisitDetails';
import SelectDropdown from 'react-native-select-dropdown';
import { Formik, Form, Field, ErrorMessage, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AuthContext from '../../context/AuthContext';
import moment from 'moment';
import * as ApiService from '../../Utils/Utils';
import { GlobalColor } from '../../constants/Colors';
import Text from '../../components/reusable/Text';
import TextInput from '../../components/reusable/TextInput';
import { Header } from '../../components/reusable/Header';
import Button from '../../components/reusable/Button';
import { LoadingScreen } from '../../components/reusable/LoadingScreen';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import { CommonActions } from '@react-navigation/native';
import { GlobalFontSize } from '../../constants/FontSize';
import { Decrypt } from '../../Service/Helper';
import Autocomplete from 'react-native-autocomplete-input';
import { Console } from 'console';
import { is } from 'immer/dist/internal';
import { sendMail } from 'react-native-send-intent';


const VisitorDetailRohtak = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const { authContext, AppUserData } = useContext(AuthContext);

  const [vendorDetail, setvendorDetail] = useState([]);
  const [subvendorDetail, setSubvendorDetail] = useState([]);
  const [selVendor, setSelVendor] = useState('');
  const [selSubVendor, setselSubVendor] = useState('');

  const [isLaptop, setisLaptop] = useState('NO');

  const [films, setFilms] = useState([]);
  // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([]);
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({});

  const [show, setShow] = useState(false);

  const fromRef = useRef(null);

  let leng = 0;

  var ttl = '';


  const SubVen = [
    {
      label: '--No-Select--',
      value: 'No-Data',
    },

  ];

  const DefTitle = [
    {
      label: ttl,
      value: ttl,
    },

  ];

  const SubmitVGPE = userdata => {
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;

    // console.log('From Date is ----', route.params.visitorpayload.visitDateFrom);

    let apiData = {
      UserName: AppUserData ?.data ?.username,
      Type: route.params.visitorpayload.VisType,
      VisitDateFrom: route.params.visitorpayload.visitDateFrom,
      NoOfPerson: '1',
      VehicleIndicator: route.params.visitorpayload.Pvehicle,
      VehicleNumber: route.params.visitorpayload.vehicleNumber,
      Duration: route.params.visitorpayload.duration,
      Reason: route.params.visitorpayload.ReasonToCome,
      InternalVehicleIndicator: route.params.visitorpayload.interVehicle,
      ExpectedArrivalTime:
        route.params.visitorpayload.visitDateFrom +
        ' ' +
        route.params.visitorpayload.exArrTime,
      SearchLevel: route.params.visitorpayload.SearchLevel,
      VisitDateTo: moment(route.params.visitorpayload.visitDateTo).format(
        'MM-DD-YYYY',
      ),
      LocationCode: route.params.visitorpayload.location,
      VglmID: route.params.visitorpayload.buildings,
      MultipleEmployeeID: route.params.visitorpayload.empId,
      InsideBuilding:
        route.params.visitorpayload.mobileNo == undefined
          ? ''
          : route.params.visitorpayload.mobileNo,
      TestTrackName: '',
      VisitReason: '',
      ReasonRemarks: route.params.visitorpayload.ReasonToCome,
      TestTrackReq: '',
      MultipleACCEmployeeID: route.params.visitorpayload.empIdBuild,
      ResponsiblePerson: '',
      MobileNo:
        route.params.visitorpayload.mobileNo == undefined
          ? ''
          : route.params.visitorpayload.mobileNo,
    };
    console.log('apiData===> ----VGPE', apiData);

    // console.log('expiry date ', route.params.visitorpayload.exArrTime);
    // console.log('from date ', route.params.visitorpayload.visitDateFrom);
    // console.log(
    //   'to date ',
    //   moment(route.params.visitorpayload.visitDateTo).format('MM-DD-YYYY'),
    // );
    // console.log('Vglm ID ', route.params.visitorpayload.buildings);
    // console.log('Reson ', route.params.visitorpayload.ReasonToCome);
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTInsertVGPE', apiData, token, authContext)
      .then(result => {
        // console.log('APiresult SubmitVGPE', result);
        if (result.Value != '') {
          SubmitVSDT(result.Value, userdata);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const toggleBuilding = () => {
    setShow(!show);
  };

  const GetVisitorPhoneBygps = (phone, index) => {
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;
    let apiData = { Search: phone };
    setLoader(true);
    ApiService.PostMethode(
      '/GetVisitorByPhoneVGPS',
      apiData,
      token,
      authContext,
    )
      .then(result => {
        // console.log("GetVisitorPhoneBygps ----------",result.Value);
        if (result.Value.length > 0) {
          // console.log("------",result.Value);
          ttl = result.Value[0].TITLE;
          // console.log(fromRef, `actionPlans[${index}].vendor`);
          fromRef.current.setFieldValue(
            `actionPlans[${index}].vendor`,
            result.Value[0].VENDOR,
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].title`,
            result.Value[0].TITLE,
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].name`,
            result.Value[0]['VISITOR NAME'],
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].designation`,
            result.Value[0].DESG,
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].laptop`,
            result.Value[0].LAPTOP,
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].adddress`,
            result.Value[0].ADDR1,
          );
          fromRef.current.setFieldValue(
            `actionPlans[${index}].subvendor`,
            result.Value[0].SUBVENDOR,
          );
          // fromRef.current.setFieldValue(
          //   `actionPlans[${index}].vendor`,
          //   " ",
          // );
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetVendor = () => {
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;
    let apiData = {
      UserName: userId,
    };
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTGetVendorList', apiData, token, authContext)
      .then(result => {
        //console.log("vendor Data",result.Value.Table);

        let responseData = result.Value.Table;

        let responseDataNew = responseData.map(element => {
          return {
            title: element.VENDOR,
            id: element.ID,
          };
        });

        leng = responseDataNew.length;
        // console.log('Length is ---', leng);

        setvendorDetail(responseDataNew);

        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const GetSubVendor = (vendorid) => {
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;
    let apiData = {
      UserName: userId,
      VendorID: vendorid,
    };
    setLoader(true);
    ApiService.PostMethode(
      '/RHTKVSTGetSubVendorList',
      apiData,
      token,
      authContext,
    )
      .then(result => {
        //console.log("vendor Data",result.Value.Table);

        let responseData = result.Value.Table;

        let responseDataNew = responseData.map(element => {
          return {
            label: element.VENDOR_AFF,
            value: element.ID,
          };
        });

        setSubvendorDetail(responseDataNew);
        // console.log(' All Vendor Data----',responseDataNew);

        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        // console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const SubmitVSDT = (controlno, userdata) => {
    let dataarr = [...userdata];
    // console.log('dataarr', dataarr);
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;
    let apiData = dataarr.map(item => {
      let obj = {
        UserName: userId,
        ControlNo: controlno,
        EmplID: userId,
        VisitorName: item.name,
        AddressLine1: item.adddress,
        AddressLine2: '',
        VisitorDesg: item.designation,
        VisitorPhone: item.phone,
        VisitorLaptopID: isLaptop == "NO" ? "NO" : (item.laptop_id == '' ? isLaptop : item.laptop_id),
        VisitorTitle: item.title,
        VisitorUserID: userId,
        VisitorVendor:
          route.params.visitorpayload.visLevel > 1 ? item.vendor : item.vendor,
        VisitorSubVendor:
          route.params.visitorpayload.visLevel > 1 ? selSubVendor : '',
        GatePassLevel: route.params.visitorpayload.visLevel,
        mobileFlag: ""
      };
      return obj;
    });
    console.log('apiData -- VSDT', apiData);
    // route.params.visitorpayload.buildings
    setLoader(true);
    ApiService.PostMethode('/RHTKVSTInsertVSDT', apiData, token, authContext)
      .then(result => {
        // console.log("APiresult SubmitVSDT", result.Result);
        let apiDataResult = result.Result;
        // console.log('APiresult SubmitVSDT', apiData);
        // alert( apiData)
        console.log("inside ",apiDataResult );
        if (apiDataResult.includes('SUCCESS') ) {
          // console.log(apiData );
          if( apiData[0].GatePassLevel == '1'){
            SendEmail(controlno);
          }
         
          Alert.alert('Visitor Detail Submitted successfully');
          //  Toast.show("Visitor Detail Submitted successfully");

          navigation.dispatch(
            CommonActions.navigate({
              name: 'HomeGate',
            }),
          );
          return;
        } else {
          Alert.alert(apiDataResult);
          // Toast.show(apiData);
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const SendEmail = (controlno) => {
   
    let token = AppUserData.token;
    let userId = AppUserData ?.data ?.userId;
    let apiData = {
      CTRL_NO: controlno,
     
    };
   
    console.log('apiData -- Email', apiData);
    console.log('token',token);
    
    // route.params.visitorpayload.buildings
    setLoader(true);
    ApiService.PostMethode('/RHTKsendL1email', apiData, token, authContext)
      .then(result => {
        // console.log("APiresult SubmitVSDT", result.Result);
        let apiData = result.Result;
         console.log('APiresult Email', apiData);
        // alert( apiData)
       
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.log('Error occurred==>', error);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const [ActionPlans, setActionPlans] = useState([
    {
      phone: '',
      vendor: '',
      title: '',
      name: '',
      designation: '',
      laptop: '',
      adddress: '',
      subvendor: '',
      multivendor: '',
    },
  ]);

  const schema = Yup.object().shape({
    actionPlans: Yup.array().of(
      Yup.object().shape({
        // these constraints take precedence
        phone: Yup.string()
          .min(10, 'Fill 10 Digit Number')
          .max(10, 'max 10 char')
          .required('Required'), // these constraints take precedence
        vendor: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence
        title: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence

        name: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence
        designation: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence
        laptop: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence
        adddress: Yup.string().min(1, 'too short').required('Required'), // these constraints take precedence
      }),
    ),
    // .required('Minimum one product required'), // these constraints are shown if and only if inner constraints are satisfied
    //.min(3, 'Minimum of 3 friends'),
  });

  const initialLoading = () => {
    GetVendor();
    // GetSubVendor();
  };

  useEffect(() => {
    initialLoading();
  }, []);

  const findFilm = query => {
    setShow(false);
    let flt = vendorDetail.filter(film =>
      film.title.toLowerCase().includes(query.trim().toLowerCase()),
    );

    // console.log('v----', flt);
    // Method called every time when we change the value of the input
    if (query) {
      // Making a case insensitive regular expression
      //const regex = new RegExp(`${query.trim()}`, 'i');
      // Setting the filtered film array according the query
      setFilteredFilms(
        flt.map(item => item.title + " , " + item.id),
      );

    } else {
      // If the query is null then return blank
      setFilteredFilms([]);
    }
  };

  let visitorData = route.params.visitorData;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: GlobalColor.PrimaryLight }}>
      <Header title="Visitor Details Rohtak" />
      {/* Body */}
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps='handled'
        style={{ paddingHorizontal: 10, }}>
        {loader ? (
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : null}



        <Formik
          innerRef={fromRef}
          validateOnBlur={false}
          enableReinitialize
          initialValues={{
            actionPlans: ActionPlans,
          }}
          validationSchema={schema}
          onSubmit={values => {

            SubmitVGPE(values.actionPlans);
          }}>
          {({
            values,
            handleBlur,
            handleChange,
            handleSubmit,
            errors,
            touched,
            setFieldValue,
          }) => {
            return (
              <FieldArray name="actionPlans">
                {arrayHelpers => {
                  return (
                    <View>
                      {
                        values.actionPlans && values.actionPlans.length > 0
                          ? values.actionPlans.map((actionPlans, index) => {
                            return (
                              <View key={index} style={styles.card}>
                                <TouchableOpacity
                                  style={styles.deleteIcon}
                                  onPress={() => arrayHelpers.remove(index)}>
                                  <Icon
                                    name="trash"
                                    size={22}
                                    style={styles.iconTrash}></Icon>
                                </TouchableOpacity>
                                <Text Bold style={styles.labelHeading}>
                                  Enter Person Details
                                  </Text>

                                <View style={styles.singlerow}>
                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Phone <Text style={{ color: 'red' }}>*</Text>
                                      </Text>

                                    <View style={[styles.inputBox]}>
                                      {/* <Text style={{ fontSize:GlobalFontSize.Small }}>+91</Text> */}

                                      <View>
                                        <TextInput
                                          value={'+91'}
                                          style={{
                                            paddingHorizontal: 0,
                                            fontSize: 13,
                                          }}
                                          editable={false}
                                          selectTextOnFocus={false}
                                        />
                                      </View>
                                      <TextInput
                                        value={
                                          values.actionPlans[index].phone
                                        }
                                        maxLength={10}
                                        key={index.ColourQuentity}
                                        keyboardType="numeric"
                                        // maxLength={5}
                                        style={styles.inputNoborder}
                                        placeholder=" Enter Contact No."
                                        onChangeText={handleChange(
                                          `actionPlans[${index}].phone`,
                                        )}
                                        onBlur={() => {
                                          // console.log("Phone Length ------",values.actionPlans[index].phone.length);
                                          handleBlur(`actionPlans[${index}].phone`);
                                          values.actionPlans[index].phone.length == 10 ? GetVisitorPhoneBygps(values.actionPlans[index].phone, index) : null;
                                        }}
                                      />
                                    </View>
                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {errors.actionPlans[index].phone}
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>
                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Title <Text style={{ color: 'red' }}>*</Text>
                                      </Text>
                                    <SelectDropdown
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem.label;
                                      }}
                                      defaultButtonText={values.actionPlans[index].title}
                                      rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item.label;
                                      }}
                                      // defaultButtonText="Yes"
                                      dropdownBackgroundColor={'transparent'}
                                      data={[
                                        {
                                          label: 'Mr',
                                          value: 'MR',
                                        },
                                        {
                                          label: 'Mrs',
                                          value: 'MRS',
                                        },
                                        {
                                          label: 'Ms',
                                          value: 'MS',
                                        },
                                      ]}
                                      onSelect={selectedItem => {
                                        // console.log(selectedItem, index);
                                        setFieldValue(
                                          `actionPlans[${index}].title`,
                                          selectedItem.value,
                                        );
                                      }}
                                      buttonStyle={styles.dropdown2BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown2BtnTxtStyle
                                      }
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Icon
                                            name={
                                              isOpened
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                            }
                                            color={'#43C6DB'}
                                            size={14}
                                          />
                                        );
                                      }}
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown2DropdownStyle
                                      }
                                      rowStyle={styles.dropdown2RowStyle}
                                      rowTextStyle={
                                        styles.dropdown2RowTxtStyle
                                      }
                                    />

                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {errors.actionPlans[index].title}
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>
                                </View>

                                <View style={styles.singlerow}>
                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Name <Text style={{ color: 'red' }}>*</Text>
                                      </Text>
                                    <TextInput
                                      key={index.ColourQuentity}
                                      // maxLength={5}
                                      style={styles.input}
                                      value={values.actionPlans[index].name}
                                      // placeholder="Enter name"
                                      onChangeText={handleChange(
                                        `actionPlans[${index}].name`,
                                      )}
                                      onBlur={() => {
                                        handleBlur(
                                          `actionPlans[${index}].name`,
                                        );
                                      }}
                                    />
                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {errors.actionPlans[index].name}
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>

                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Designation <Text style={{ color: 'red' }}>*</Text>
                                      </Text>
                                    <TextInput
                                      key={index.ColourQuentity}
                                      // maxLength={5}
                                      style={styles.input}
                                      value={
                                        values.actionPlans[index].designation
                                      }
                                      // placeholder="Enter designation"
                                      onChangeText={handleChange(
                                        `actionPlans[${index}].designation`,
                                      )}
                                      onBlur={() => {
                                        handleBlur(
                                          `actionPlans[${index}].designation`,
                                        );
                                      }}
                                    />
                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {
                                                  errors.actionPlans[index]
                                                    .designation
                                                }
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>
                                </View>

                                <View style={styles.singlerow}>
                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Address <Text style={{ color: 'red' }}>*</Text>
                                      </Text>
                                    <TextInput
                                      key={index.ColourQuentity}
                                      // maxLength={5}
                                      style={styles.input}
                                      value={
                                        values.actionPlans[index].adddress
                                      }
                                      // placeholder="Enter adddress"
                                      onChangeText={handleChange(
                                        `actionPlans[${index}].adddress`,
                                      )}
                                      onBlur={() => {
                                        handleBlur(
                                          `actionPlans[${index}].adddress`,
                                        );
                                      }}
                                    />
                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {
                                                  errors.actionPlans[index]
                                                    .adddress
                                                }
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>

                                  <View style={styles.columnsingle}>
                                    <Text Bold style={styles.label}>
                                      Laptop/ipad/tablet <Text style={{ color: 'red' }}>*</Text>
                                      </Text>


                                    <SelectDropdown
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem.label;
                                      }}
                                      rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item.label;
                                      }}
                                      // defaultButtonText="Yes"
                                      dropdownBackgroundColor={'transparent'}
                                      data={[
                                        {
                                          label: 'YES',
                                          value: 'YES',
                                        },
                                        {
                                          label: 'NO',
                                          value: 'NO',
                                        },

                                      ]}
                                      onSelect={selectedItem => {
                                        // console.log(selectedItem, index);
                                        setisLaptop(selectedItem.value);
                                        console.log(selectedItem.value);
                                        // selectedItem.value == 'NO'?
                                        // setFieldValue(
                                        //   `actionPlans[${index}].laptop_id`,
                                        //   "NO",
                                        // ):null;
                                        setFieldValue(
                                          `actionPlans[${index}].laptop`,
                                          selectedItem.value,
                                        );
                                      }}
                                      buttonStyle={styles.dropdown2BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown2BtnTxtStyle
                                      }
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Icon
                                            name={
                                              isOpened
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                            }
                                            color={'#43C6DB'}
                                            size={14}
                                          />
                                        );
                                      }}
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown2DropdownStyle
                                      }
                                      rowStyle={styles.dropdown2RowStyle}
                                      rowTextStyle={
                                        styles.dropdown2RowTxtStyle
                                      }
                                    />

                                    {errors.actionPlans &&
                                      errors.actionPlans.length >= index ? (
                                        <Text style={styles.errorLabel}>
                                          {errors.actionPlans[index] !=
                                            undefined ? (
                                              <Text style={styles.errorLabel}>
                                                {errors.actionPlans[index].laptop}
                                              </Text>
                                            ) : null}
                                        </Text>
                                      ) : null}
                                  </View>
                                </View>

                                {isLaptop == 'NO' ? null :
                                  <View style={styles.singlerow}>
                                    <View style={styles.columnsingleVen}>
                                      <Text Bold style={styles.label}>
                                        Laptop Id
                                      </Text>
                                      <TextInput
                                        key={index}
                                        // maxLength={5}
                                        style={styles.input}
                                        value={
                                          values.actionPlans[index].laptop_id
                                        }
                                        // placeholder="Enter adddress"
                                        onChangeText={handleChange(
                                          `actionPlans[${index}].laptop_id`,
                                        )}
                                        onBlur={() => {
                                          handleBlur(
                                            `actionPlans[${index}].laptop_id`,
                                          );
                                        }}
                                      />
                                      {errors.actionPlans &&
                                        errors.actionPlans.length >= index ? (
                                          <Text style={styles.errorLabel}>
                                            {errors.actionPlans[index] !=
                                              undefined ? (
                                                <Text style={styles.errorLabel}>
                                                  {
                                                    errors.actionPlans[index]
                                                      .laptop_id
                                                  }
                                                </Text>
                                              ) : null}
                                          </Text>
                                        ) : null}
                                    </View>


                                  </View>
                                }
                                <View style={{ zIndex: 9, width: '49%' }}>

                                </View>

                                <View style={{zIndex:9}} >
                                  {route.params.visitorpayload.visLevel >
                                    1 ? (
                                      <View style={styles.columnsingleVen}>
                                        <Text Bold style={styles.label}>
                                          Vendor <Text style={{ color: 'red' }}>*</Text>
                                        </Text>

                                        <Autocomplete
  autoCapitalize="none"
  autoCorrect={false}
  hideResults={show}
  containerStyle={styles.autocompleteContainer}
  data={filteredFilms}
  defaultValue={values.actionPlans[index].vendor}
  onChangeText={text => findFilm(text)}
  placeholder="Enter First Letter of Vendor"
  flatListProps={{
    keyExtractor: (_, idx) => idx.toString(),
    style: { maxHeight: 120 },  // Limits height to ~4-5 items; scroll appears for more
    renderItem: ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedValue(item.split(',')[0]);
          setSelVendor(item.split(',')[0]);
          GetSubVendor(item.split(',')[1]);
          setFieldValue(`actionPlans[${index}].vendor`, item.split(',')[0]);
          setShow(!show);
        }}
      >
        <Text style={{ fontSize: 13, marginTop: 5 }}>
          {item.split(',')[0]}
        </Text>
      </TouchableOpacity>
    ),
  }}
/>


                                        {errors.actionPlans &&
                                          errors.actionPlans.length >= index ? (
                                            <Text style={styles.errorLabel}>
                                              {errors.actionPlans[index] !=
                                                undefined ? (
                                                  <Text style={styles.errorLabel}>
                                                    {
                                                      errors.actionPlans[index]
                                                        .title
                                                    }
                                                  </Text>
                                                ) : null}
                                            </Text>
                                          ) : null}
                                      </View>
                                    ) : (
                                      <View style={styles.columnsingle}>
                                        <Text Bold style={styles.label}>
                                          Vendor <Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TextInput
                                          key={index.ColourQuentity}
                                          // maxLength={5}
                                          style={styles.input}
                                          value={
                                            values.actionPlans[index].vendor
                                          }
                                          // placeholder="Enter vendor"
                                          onChangeText={handleChange(
                                            `actionPlans[${index}].vendor`,
                                          )}
                                          onBlur={() => {
                                            handleBlur(
                                              `actionPlans[${index}].vendor`,
                                            );
                                          }}
                                        />
                                        {errors.actionPlans &&
                                          errors.actionPlans.length >= index ? (
                                            <Text style={styles.errorLabel}>
                                              {errors.actionPlans[index] !=
                                                undefined ? (
                                                  <Text style={styles.errorLabel}>
                                                    {
                                                      errors.actionPlans[index]
                                                        .vendor
                                                    }
                                                  </Text>
                                                ) : null}
                                            </Text>
                                          ) : null}
                                      </View>
                                    )}
                                </View>

                                <View style={styles.columnsingleVen}>

                                  {route.params.visitorpayload.visLevel >
                                    1 ? (
                                      <View style={styles.columnsingleVen}>
                                        <Text Bold style={styles.label}>
                                          Sub Vendor <Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <SelectDropdown
                                          buttonTextAfterSelection={(
                                            selectedItem,
                                            index,
                                          ) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem.label;
                                          }}
                                          rowTextForSelection={(
                                            item,
                                            index,
                                          ) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item.label;
                                          }}
                                          // defaultButtonText="Yes"
                                          dropdownBackgroundColor={
                                            'transparent'
                                          }
                                          data={subvendorDetail == '' ? SubVen : subvendorDetail}
                                          onSelect={selectedItem => {
                                            // console.log(selectedItem, index);
                                            setFieldValue(
                                              `actionPlans[${index}].subvendor`,
                                              selectedItem.value,
                                            );
                                            setselSubVendor(selectedItem.label);
                                            //setFieldValue(`actionPlans[${index}].title`,selectedItem.value);
                                          }}
                                          buttonStyle={styles.dropdown2BtnStyle}
                                          buttonTextStyle={
                                            styles.dropdown2BtnTxtStyle
                                          }
                                          renderDropdownIcon={isOpened => {
                                            return (
                                              <Icon
                                                name={
                                                  isOpened
                                                    ? 'chevron-up'
                                                    : 'chevron-down'
                                                }
                                                color={'#43C6DB'}
                                                size={14}
                                              />
                                            );
                                          }}
                                          dropdownIconPosition={'right'}
                                          dropdownStyle={
                                            styles.dropdown2DropdownStyle
                                          }
                                          rowStyle={styles.dropdown2RowStyle}
                                          rowTextStyle={
                                            styles.dropdown2RowTxtStyle
                                          }
                                        />

                                        {errors.actionPlans &&
                                          errors.actionPlans.length >= index ? (
                                            <Text style={styles.errorLabel}>
                                              {errors.actionPlans[index] !=
                                                undefined ? (
                                                  <Text style={styles.errorLabel}>
                                                    {
                                                      errors.actionPlans[index]
                                                        .title
                                                    }
                                                  </Text>
                                                ) : null}
                                            </Text>
                                          ) : null}
                                      </View>
                                    ) : null}
                                </View>

                              </View>
                            );

                          })
                          : null

                      }
                      <View
                        style={{ marginBottom: '50%' ,marginTop:50}}>
                        {values.actionPlans.length > 4 ? null : (
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#fff',
                              marginTop: 20,
                              // marginBottom: 50,
                              height: 50,
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              arrayHelpers.push({
                                phone: '',
                                vendor: '',
                                title: '',
                                name: '',
                                designation: '',
                                laptop: '',
                                adddress: '',
                                subvendor: '',
                                multivendor: '',
                              })
                            }>
                            <Text
                              Bold
                              style={{
                                textAlign: 'center',
                                fontSize: 15,
                                fontWeight: '500',
                              }}>
                              Add New
                          </Text>
                          </TouchableOpacity>
                        )}



                        <Button
                          onPress={handleSubmit}
                          title="SUBMIT"
                          textStyle={{ fontSize: 13 }}>
                        </Button>
                      </View>
                    </View>
                  );
                }}
              </FieldArray>
            );
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#fff',
  },
  container: {
    flexDirection: 'row',
  },
  containerS: {
    flex: 1,
  },
  gradient: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 10,
    position: 'relative',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconTrash: {
    color: '#f00',
  },
  deleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    zIndex: 40,
  },
  errorLabel: {
    color: '#f00',
    fontSize:13
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#43C6DB',
    padding: 5,
    borderRadius: 0,
    fontSize: 13,
  },
  inputNoborder: {
    // flex: 1,
    // borderWidth: 1,
    // borderColor:GlobalColor.Secondary,
    paddingLeft: 0,
    // borderRadius: 0,
    // borderWidth:1,
    // height:30,
    fontSize: 13,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#43C6DB',
    paddingLeft: 5,
    borderRadius: 0,
    height: 40,
  },
  singlerow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  columnsingle: {
    width: '49%',
  },

  columnsingleVen: {
    width: '100%',
  },

  label: {
    paddingHorizontal: 0,
    fontSize: 13,
    marginBottom: 3,
  },
  labelHeading: {
    paddingHorizontal: 0,
    fontSize: 15,
    marginBottom: 10,
    color: GlobalColor.Primary,
  },

  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    //shadowColor: '#43C6DB',
    borderColor:"#43C6DB"

    //height:10,
    //shadowColor:'#666'
  },

  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  // Dropdown styles
  dropdown2BtnStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 0,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
    fontSize: 13,
  },
  dropdown2BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 13 },
  dropdown2DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown2RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown2RowTxtStyle: { color: '#444', textAlign: 'left', fontSize: 13 },
});
//make this component available to the app
export default VisitorDetailRohtak;
