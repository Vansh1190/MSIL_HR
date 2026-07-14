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
  Image,
  Dimensions,
  ImageBackground
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
import {Card , Title ,Paragraph } from 'react-native-paper'; 
import { CommonActions } from '@react-navigation/native';




let isLive = false;
const DiwaliGift = ({navigation}) => {
  
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [searchLevel] = useState();
  const [searchLevelData, setSearchLevelData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ContactNum, setContactNum] = useState('');

  const [modalLoader, setmodalLoader] = useState(false);

  const [DiwaliGFT, setDiwaliGFT] = useState([]);
  const [GFT_OPTION, setGFT_OPTION] = useState([]);

  let persinalphn = AppUserData?.data?.personalPhone;
  let officialPhn = AppUserData?.data?.officialPhone;
 
// $&
// $&
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

  const Purpose = [
    {
      label: 'No-Data',
      value: 'No-Data',
    },
    
  ];

  const DummyData = [
    {
      label: 'No-Data',
      value: 'No-Data',
    },
    
  ];


  const DummyDataGIFT = [
    {
      label: 'Select Gift Type',
      value: 'Select Gift Type',
    },
    
  ];
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
  const [updateData, setupdateData] = useState(false);
  const [DiwaliData, setDiwaliData] = useState('');
  const [GIFT_CODE, setGIFT_CODE] = useState('');
  const [GIFT_FLAG, setGIFT_FLAG] = useState('N');


  const [GiftType, setGiftType] = useState('');
  const [GiftTypeVal, setGiftTypeVal] = useState('');
  const [GIFT_CODE_TYPE, setGIFT_CODE_type] = useState('');
  const [GIFT_FLAG_TYPE, setGIFT_FLAG_TYPE] = useState('N');

  const [Locations, setLocations] = useState([]);

  const [EMP_ID, setEMP_ID] = useState('');
  const [EMP_NAME, setEMP_NAME] = useState('');
  const [EMP_DESG, setEMP_DESG] = useState('');
  const [EMP_DEPT, setEMP_DEPT] = useState('');
  const [EMP_LOC, setEMP_LOC] = useState('');
  const [EMP_GIFT, setEMP_GIFT] = useState('');
  const [EMP_GIFT_OTH, setEMP_GIFT_OTH] = useState('');

  const [EMP_ADDR1, setEMPADDR1] = useState('');
  const [EMP_ADDR2, setEMPADDR2] = useState('');
  const [EMP_STTE, setEMP_STTE] = useState('');
  const [EMP_CTY, setEMP_CTY] = useState('');
  const [EMP_PINCDE, setEMP_PINCDE] = useState('');
  const [GFT_IMAGE, setGFT_IMAGE] = useState('');
  const [isModalVisible1, setModalVisible1] = useState(false);

  let usrNT = AppUserData?.data?.userId;
  let usrnm = AppUserData?.data?.EMPL_NAME;
  let usrdesg = AppUserData?.data?.EMPL_DESG_CODE;
  let usrdept = AppUserData?.data?.userDept;
  let usrloc = AppUserData?.data?.userLocation;


  const GetGiftData = (gift_type) => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
 
// $&
    let apiData = {
      UserName: userId,
      GiftType:gift_type
    };
// $&
    setLoader(true);
    ApiService.PostMethode('/GetGiftOp', apiData, token, authContext)
      .then(result => {

        setLoader(false);
// $&

        let responseData = result.Value
        if(responseData.Table1 == '')
        {
            setDiwaliGFT(DummyData);
        }
        else{
          let responseOpt = responseData.Table1.map(element => {
            return {
              label: Decrypt(element.GIFT),
              value: Decrypt(element.CODE),
              flag:  Decrypt(element.FLAG),
              img: Decrypt(element.GFTIMG),
            };
          });
// $&
          setDiwaliGFT(responseOpt);
        }
      
       // // console.log($1);
       
       
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const reLoadApp = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CompensationBenifits',
      })
    );
  }

  const timeot = () =>
  {
    setTimeout(() =>{
// $&
      //setModalVisible(!isLive)
      isLive = false;
      navigation.dispatch(
        CommonActions.navigate({
          name: 'CompensationBenifits',
        })
        
        
      );
  }, 3000)
  //isLive = false;
  }


  const GetGiftType = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;

    setContactNum(persinalphn == ''?officialPhn:persinalphn);
 
// $&
    let apiData = {UserName: userId};
// $&
    setLoader(true);
    ApiService.PostMethode('/GetGiftType', apiData, token, authContext)
      .then(result => {

        setLoader(false);
// $&
        let responseData = result.Value
        if(responseData.Table1 == '')
        {
          setGFT_OPTION(DummyData);
        }
        else{
          let responseOpt = responseData.Table1.map(element => {
            return {
              label: Decrypt(element.LOVM_LOV_NAME),
              value: Decrypt(element.LOVM_LOV_NAME),
             
            };
          });
// $&
          setGFT_OPTION(responseOpt);
        }
       
      
       // // console.log($1);
       
       
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };


  const GetEmpData = (gifttype) => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
 
// $&
    let apiData = {
      UserName: userId,
      GiftType:gifttype
    };
// $&
    setLoader(true);
    ApiService.PostMethode('/GetDiwaliData', apiData, token, authContext)
      .then(result => {

        setLoader(false);
      

        let responseData = result.Value.Table1;
        let empl_id = responseData[0] == undefined ?'': responseData[0].EMPL_ID;
        let empl_nm = responseData[0] == undefined ?'': responseData[0].EMPL_NAME;
      


        let empl_desg = responseData[0] == undefined ?'': responseData[0].EMPL_DESG_CODE;
        let empl_dept = responseData[0] == undefined ?'': responseData[0].EMPL_DEPT_CODE;

        let empl_loc = responseData[0] == undefined ?'': responseData[0].EMPL_LOCN_CODE;

        let emp_Contact = responseData[0] == undefined ?'': responseData[0].GIFT_MOBILE_NO;

        let emp_gift = responseData[0] == undefined ?'': responseData[0].LOVM_VALUE_DESC;
        let emp_gift_CODE = responseData[0] == undefined ?'': responseData[0].GIFT_LOVM_CODE;
        let emp_gift_oth = responseData[1] == undefined ?'':responseData[1].LOVM_VALUE_DESC;

        let Adr1 = responseData[0] == undefined ?'': responseData[0].GIFT_ADDR_LINE_1;
        let Adr2 = responseData[0] == undefined ?'': responseData[0].GIFT_ADDR_LINE_2;
        let stte = responseData[0] == undefined ?'': responseData[0].GIFT_ADDR_STATE; 
        let cty = responseData[0] == undefined ?'':  responseData[0].GIFT_ADDR_CITY;
        let pincod = responseData[0] == undefined ?'': responseData[0].GIFT_ADDR_PINCODE;

// $&

       

        if(Decrypt(emp_gift) != '')
        {
          setupdateData(true);
        }
        else{
          setupdateData(false);
        }

      



        
        setEMPADDR1(Decrypt(Adr1));
        setEMPADDR2(Decrypt(Adr2));
        setEMP_STTE(Decrypt(stte));
       setEMP_CTY(Decrypt(cty));
       setEMP_PINCDE(Decrypt(pincod));
        setEMP_ID(Decrypt(empl_id));
        setEMP_NAME(Decrypt(empl_nm));
        setEMP_DESG(Decrypt(empl_desg));
        setEMP_DEPT(Decrypt(empl_dept));
        setEMP_LOC(Decrypt(empl_loc));
        setContactNum(Decrypt(emp_Contact));
        setEMP_GIFT(Decrypt(emp_gift));
        //setGIFT_CODE(Decrypt(emp_gift_CODE));
        setEMP_GIFT_OTH(Decrypt(emp_gift_oth))

      
      
// $&
       
       
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const submitGift = () =>
  {

    if(GIFT_FLAG == 'Y' && EMP_ADDR1 == '' && EMP_ADDR2 == '' && EMP_STTE == '' && EMP_CTY == '' && EMP_PINCDE == '')
    {
// $&
        Alert.alert("Address Field is Mandatory!!!!1");
    }
    else if(ContactNum == '')
    {
// $&
      Alert.alert("Please enter valid mobile number !!");
    }
 
    else if(ContactNum.length < 10)
    {
      Alert.alert("Please enter valid mobile number !!");
    }
    else if(GIFT_CODE == '' || GIFT_CODE == 'Select Gift Type')
    {
// $&
      Alert.alert("Please select Mandatory Option !!!!");
    }
    else if(GiftType == '')
    {
// $&
      Alert.alert("Please select Mandatory Option !!!!");
    }
    else{

    Alert.alert('Gift & Rewards', 'Are you sure you want to choose this gift?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () =>
        {
          DWLGIFT();
        }
       
    },
    ]);
  }

  }


  const DWLGIFT = () => {


    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let ntID = AppUserData?.data?.userNT

    //// console.log($1);

    // if(GIFT_FLAG == 'Y' && EMP_ADDR1 == '' && EMP_ADDR2 == '' && EMP_STTE == '' && EMP_CTY == '' && EMP_PINCDE == '')
    // {
    //   // console.log($1);
    //     Alert.alert("Address Field is Mandatory!!!!1");
    // }
    // else if(ContactNum == '' || ContactNum.length < 10)
    // {
    //   // console.log($1);
    //   Alert.alert("Please enter valid mobile number !!");
    // }
    // else if(GIFT_CODE == '' || GIFT_CODE == 'Select Gift Type')
    // {
    //   // console.log($1);
    //   Alert.alert("Please select Mandatory Option !!!!");
    // }
    // else if(GiftType == '')
    // {
    //   // console.log($1);
    //   Alert.alert("Please select Mandatory Option !!!!");
    // }
    // else{

    //  // console.log($1);

      let newdata = {
        "UserName": userId,
        "GiftOption" :GIFT_CODE,
        "MobileNo":ContactNum,
        "EmplId":userId,
        "GiftAddrLine1":EMP_ADDR1,
        "GiftAddrLine2":EMP_ADDR2,
        "GiftAddrState":EMP_STTE,
        "GiftAddrCity":EMP_CTY,
        "GiftAddrPncd":EMP_PINCDE,
        "GiftLovmLovName":GiftType     
    }

// $&

    setLoader(true);
    ApiService.PostMethode('/InsDiwaliGft', newdata, token, authContext)
      .then(result => {
// $&
       
        if(result.Value == ''){
          
          //setModalVisible(!isLive);
          isLive = !isLive;
          timeot();
         // isLive = false;
         // Alert.alert("Data Inserted Successfully");
          // setGFT_OPTION(DummyData);
       
         
          
         // Toast.show("Gate pass Generated Successfully");
         
        }
        else{
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

    //} 

  };

  useEffect(() => {
    //GetGiftData();
   // GetEmpData("");
    GetGiftType();
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

  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
    //reLoadApp();
  };

  // const toggleModal1 = () => {
  //   setModalVisible(!isModalVisible);
  //   reLoadApp();
  // };
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
      <Header title="Gift & Rewards" />
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
          vehicleNumber: '',
          building: '',
          searchEmp: '',
          perName: '',
          Desig: '',
          noOfPerson: '',
          empId: '',
          MOB_NO:''
        }}
        onSubmit={values => {
// $&

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
            visitDate: moment(values.date).format('MMM-DD-YYYY hh:mm:ss a'),
            authorizedPerson: AppUserData?.data?.userId,
            Pvehicle: values.persionalVehical.value,
            VisType: 'O',
            visLevel: '1',
            buildings: buldings.join(','),
            duration: values.duration,
            exArrTime: moment(values.date).format('MMM-DD-YYYY hh:mm:ss a'),
            SearchLevel: values.searchLevel.value,
            interVehicle: values.internalVehical.value,
            ReasonToCome: values.reason,
            perName: values.perName,
            Desig: values.Desig,
            noOfPerson: '5',
            empId: values.empId,
            vehicleNumber: values.vehicleNumber,
            dateDummy: values.date,
            mobileNo:values.MOB_NO,
          };
// $&
          // return;
          navigation.navigate('VisitorDetails', {
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
            style={{marginTop: 5, paddingHorizontal: 15,marginBottom:"12%"}}>
        

            {/* SEARCH BOX */}

            <View>
         
            <Card style={styles.containerCard}> 
            <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,flexDirection:'column'}}>
        <Card.Content> 
            <Title style= {{fontSize:13}}>Emp Id</Title> 
        </Card.Content> 
       
       <Card.Content> 
        <Paragraph style ={{fontSize:12}}>{EMP_ID ==''?usrNT:EMP_ID}</Paragraph> 
        </Card.Content> 
      </View>
      <View style={{flex:1,flexDirection:'column'}}>

        <Card.Content> 
            <Title style= {{fontSize:13}}>Name</Title> 
        </Card.Content> 
       
       <Card.Content> 
        <Paragraph style ={{fontSize:12}}>{EMP_NAME == ''?usrnm:EMP_NAME}</Paragraph> 
        </Card.Content>
        </View>
        </View>

        <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,flexDirection:'column'}}>
        <Card.Content> 
            <Title style= {{fontSize:13}}>Designation</Title> 
        </Card.Content> 
       
       <Card.Content> 
        <Paragraph style ={{fontSize:12,}}>{EMP_DESG == ''?usrdesg:EMP_DESG}</Paragraph> 
        </Card.Content> 
      </View>
      <View style={{flex:1,flexDirection:'column'}}>

        <Card.Content> 
            <Title style= {{fontSize:13}}>Department</Title> 
        </Card.Content> 
       
       <Card.Content> 
        <Paragraph style ={{fontSize:12}}>{EMP_DEPT == ''?usrdept:EMP_DEPT}</Paragraph> 
        </Card.Content>
        </View>
        </View>


        <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,flexDirection:'column'}}>
        <Card.Content> 
            <Title style= {{fontSize:13}}>Location</Title> 
        </Card.Content> 
       
       <Card.Content> 
        <Paragraph style ={{fontSize:12}}>{EMP_LOC == ''?usrloc:EMP_LOC}</Paragraph> 
        </Card.Content> 
      </View>
      
        </View>
      </Card> 
            
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginVertical: 10,
                }}>

                {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Emp id
                </Text> */}
                {/* <TextInput
                  value={userId}
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
                {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Name
                </Text> */}
                {/* <TextInput
                  value={empNem}
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

                {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Designation
                </Text> */}
                {/* <TextInput
                  value={empDesg}
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
                /> */}
              {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Department
                </Text> */}
                {/* <TextInput
                  value={empDept}
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
                 {/* <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Location
                </Text> */}

                {/* <TextInput
                  value={locDesc}
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
                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Mobile {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={ContactNum}
                  maxLength={10}
                  keyboardType='numeric'
                  onChangeText={text => setContactNum(text)}
                  style={{
                    marginVertical: 5,
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

<View style={{width: '100%'}}>
              
              
              <Text
                style={{
                  paddingHorizontal: 0,
                  
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                Choose Gift Type  {<Text style  ={{color :'red'}}>*</Text>}
              </Text>
             
            

                 <SelectDropdown
                 
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem.label;
                  }}
                  defaultValue={DummyData}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item.label;
                  }}
                 
                  defaultButtonText={GiftType}
                  
                  dropdownBackgroundColor={'transparent'}
                  
                  data={GFT_OPTION}
                  onSelect={(selectedItem, index) => {
// $&
// $&
// $&
                  //  // console.log($1);
                    setGIFT_CODE_type(selectedItem.value);

                   
                   // setGIFT_FLAG_TYPE(selectedItem.flag);
                   GetGiftData(selectedItem.value);
                    setGiftType(selectedItem.label);
                    GetEmpData(selectedItem.value);
                    setGiftTypeVal(selectedItem.value);
                    setFieldValue('AuthDrive FLAG', selectedItem);
                  }}
                  buttonStyle={styles.dropdown2BtnStyle}
                  buttonTextStyle={styles.dropdown2BtnTxtStyleType}
                  renderCustomizedRowChild={(item, index) => (
                 
                    <View style={[styles.rowContainerType]}>
                      
                       <Text style ={{fontSize:13}}> {item.label}</Text>
                     
                      
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
                  dropdownStyle={styles.dropdown2DropdownStyle1}
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
            
<View style={{marginVertical: 5}}>
              <View style={{width: '100%'}}>
              
              
                <Text
                  style={{
                    paddingHorizontal: 0,
                    
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  {updateData == true?'Update':'Choose'} Your  Gift Option  {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
               
              

                   <SelectDropdown
                   
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem.label;
                    }}
                   // defaultValue={Purpose}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item.label;
                    }}
                   
                    defaultButtonText={DiwaliData}
                    
                    dropdownBackgroundColor={'transparent'}
                    
                    data={DiwaliGFT == ''?DummyDataGIFT:DiwaliGFT}
                    onSelect={(selectedItem, index) => {
// $&
// $&
// $&
// $&
                      setGIFT_CODE(selectedItem.value);
                      selectedItem.flag == undefined ?setGIFT_FLAG('N') : setGIFT_FLAG(selectedItem.flag);
                      setDiwaliData(selectedItem.label);
                      setGFT_IMAGE(selectedItem.img);
                      setFieldValue('AuthDrive FLAG', selectedItem);
                    }}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    renderCustomizedButtonChild={(item, index) => (
                   
                      <View style={[styles.rowContainer]}>
                        
                        <Text
                  style={{
                    paddingHorizontal: 0,
                    marginVertical: 5,
                    fontSize: 13,
                    
                  }}>
                 {DiwaliData}
                </Text>
                       
                        
                         {/* <Text> {item.value}</Text> */}

                      </View>
                    )}

                    renderCustomizedRowChild={(item, index) => (
                      item.label == 'No-Data'?<Text style ={{fontSize:13}}> Please select Gift Type</Text>:
                      <View style={[styles.rowContainer]}>
                        
                         <Text style ={{fontSize:13}}> {item.label}</Text>
                       
                        
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
                    dropdownStyle={DiwaliGFT.length > 2 ?styles.dropdown2DropdownStyle:styles.dropdown2DropdownStyle1}
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
           {GIFT_FLAG == 'N'?null:
            <View>
            <Text
                  style={{
                    paddingHorizontal: 0,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Address Line 1 {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={EMP_ADDR1}
                  maxLength={100}
                  keyboardType='default'
                  onChangeText={text => setEMPADDR1(text)}
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
                  Address Line 2 {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={EMP_ADDR2}
                  maxLength={100}
                  keyboardType='default'
                  onChangeText={text => setEMPADDR2(text)}
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
                  State {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={EMP_STTE}
                  maxLength={50}
                  keyboardType='default'
                  onChangeText={text => setEMP_STTE(text)}
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
                  City {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={EMP_CTY}
                  maxLength={50}
                  keyboardType='default'
                  onChangeText={text => setEMP_CTY(text)}
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
                  Pin Code {<Text style  ={{color :'red'}}>*</Text>}
                </Text>
                <TextInput
                  value={EMP_PINCDE}
                  maxLength={6}
                  keyboardType='numeric'
                  onChangeText={text => setEMP_PINCDE(text)}
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

</View>}

              </View>

              {GFT_IMAGE == ''?null:
              <TouchableOpacity onPress={
                GFT_IMAGE == ''?null:
                toggleModal1
                }>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    color: '#43c6db',
                    fontSize: 13,
                    fontWeight: 'bold',
                    marginLeft: 45,
                  }}>
                  Click to Show Image of Selected Gift
                </Text>
              </TouchableOpacity>
}

              {/* Next Button */}
              <View style={{paddingVertical: 10}}>
                <Button
                  title= {updateData == true?'Update':'Submit'}
                  onPress={() => {
                    submitGift()
                  
                  }}
                  textStyle={{fontSize:13}}
                />
              </View>
              {EMP_GIFT == ''?null:
              <Text
                  style={{
                    paddingHorizontal: 0,
                    
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Selected {GiftType} 
                </Text>
}
              <Text
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical:10,
                    fontSize: 13,
                   
                  }}>
                 {EMP_GIFT}
                </Text>

{/* 
                {EMP_GIFT_OTH == ''?null:
              <Text
                  style={{
                    paddingHorizontal: 0,
                    
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Selected 30 Millions gift option 
                </Text>
}
              <Text
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical:10,
                    fontSize: 13,
                   
                  }}>
                 {EMP_GIFT_OTH}
                </Text> */}
            </View>

           
           {/* Modal Code Goes here */}
        <Modal
          backdropOpacity={0.7}
          coverScreen={true}
          isVisible={isLive}>
          <View
            style={{
              minHeight: 230,
              borderRadius: 15,
              backgroundColor: GlobalColor.White,
            }}>
            {/* {
            modalLoader ? (
              <LoadingScreen />
            ) : ( */}
              <View style={styles.modal}>
                {/* <TouchableOpacity style={styles.ModalCloseIcon}>
                  <Feather
                    name="x-circle"
                    color={'#43C6DB'}
                    size={25}
                    onPress={toggleModal1}
                    style ={{marginVertical:10,marginHorizontal:10}}
                  />
                </TouchableOpacity> */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: 90,
                    height: 90,
      
                    marginTop: 60,
                  }}>


                    
                
               <Image
                      source={require('../../assets/Images/sbmt.gif')}
                      style={[styles.profileImg, {marginRight: 5}]}
                    />
            
                    
                 
                </View>
              
                {/* <View  style={{
                  paddingVertical: 15,
                  alignSelf: 'center',
                  alignItems: 'center',
                }} >
                <Text 
                style={{
                  paddingHorizontal: 5,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
                >No Data Found</Text>

               
                

                </View> */}
            

                <View
                  style={{
                    // height: '23%',
                    marginTop: 5,
                    // backgroundColor:'yellow',
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-around',
                    width: '50%',
                    alignItems: 'flex-end',
                  }}>
               
                  
                </View>
                {/* <TouchableOpacity 
                 onPress={toggleModal1}
                   style={styles.ModalCloseIcon1}>
                   
                  <Text 
                   style={{
                    paddingHorizontal: 5,
                    fontSize: 15,
                    color:'#43c6db',
                    fontWeight: 'bold',
                  }}
                   >Done</Text>
                </TouchableOpacity> */}
              </View>
            {/* )} */}
          </View>
        </Modal>
            {/* end modal */}


             {/* Show Gift Image Model Start */}
 
             <Modal
              backdropOpacity={0.7}
              coverScreen={true}
              isVisible={isModalVisible1}>
              <View
                style={{
                  // minHeight: 230,
                  height: Dimensions.get('window').height / 1.4,
                  borderRadius: 15,
                  backgroundColor: GlobalColor.White,
                }}>
                <TouchableOpacity style={styles.ModalCloseIcon}>
                  <Feather
                    name="x-circle"
                    color={'#43C6DB'}
                    size={25}
                    onPress={toggleModal1}
                  />
                </TouchableOpacity>
                {modalLoader ? (
                  <LoadingScreen />
                ) : (
                  <View style={styles.modal1}>
                    <ImageBackground
                      source={{uri: GFT_IMAGE}}
                      resizeMode="cover"
                      style={[styles.profileImg1]}
                    />
                  </View>
                )}
              </View>
            </Modal>
 
            {/* Show Gift Image Modal End */}
 
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
  containerCard:{ 
    flex:1,
    alignContent:'center', 
    width:'100%',
    borderColor:'#43c6DB',
    borderWidth:1
} ,
ModalCloseIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 55,
},

ModalCloseIcon: {
  position: 'absolute',
  top: -30,
  right: 0,
  zIndex: 55,
},
profileImg: {
  height: Dimensions.get('window').height/2.2,
  width: Dimensions.get('window').width/1.2,
  borderRadius: 40,
  marginLeft: 10,
  marginBottom:160
},
modal: {
  height: Dimensions.get('window').height/7.1,
  width: '100%',
  alignSelf: 'center',
  backgroundColor: GlobalColor.PrimaryLight,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  borderBottomLeftRadius: 50,
  borderBottomRightRadius: 50,
  position: 'relative',
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
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    marginLeft:10,
    flexWrap: 'wrap',
    flexShrink: 1,
    

  
  },
  rowContainerType: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    marginLeft:10,
    flexWrap: 'wrap',
    flexShrink: 1
    

  
  },
  // Dropdown styles
  dropdown2BtnStyle: {
    width: '100%',
    height: "auto",
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
    flexWrap:'wrap',
    overflow:'scroll',
    
    
    
    
  },

  modal1: {
    height: Dimensions.get('window').height / 1.5,    
    borderRadius: 15,
    flex: 1,
  },
   
  profileImg1: {
    flex: 1,
    // justifyContent: 'center',
    borderRadius: 15,
  },

  dropdown2BtnTxtStyleType: {
    width: '100%',
    height: "auto",
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#FFF',
    borderColor: '#43C6DB',
    flexWrap:'wrap',
    overflow:'scroll',
    
  },

  dropdown2BtnTxtStyle: {textAlign: 'left', fontSize: 12},
  dropdown2BtnTxtStyleType: {textAlign: 'left', fontSize: 12,height:30,paddingVertical:5},
  dropdown2DropdownStyle: {backgroundColor: GlobalColor.White,height:'25%'},
  dropdown2DropdownStyle1: {backgroundColor: GlobalColor.White,height:'auto'},
  dropdown2RowStyle: {
    backgroundColor: GlobalColor.White,
    borderBottomColor: '#43C6DB',
    width:'100%',
    height:'100%',
    paddingVertical:10,
    flex:1,
    borderColor:'#43c6db',
    borderWidth:1,
   
    
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
export default DiwaliGift;
