//import liraries
import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Formik} from 'formik';
import * as yup from 'yup';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import {DataTable} from 'react-native-paper';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Button from './../../components/reusable/Button';
import Text from '../../components/reusable/Text';
import CheckBox from '@react-native-community/checkbox';
import TextInput2 from '../../components/reusable/TextInput';
import ApplyLeave from './ApplyLeave';
import LeaveViewReport from './LeaveViewReport';
import LeaveBalance from './LeaveBalance';
import SalaryDeduct from './SalaryDeduct';
import {Decrypt} from '../../Service/Helper';
import ShortfallLeave from './ShortfallLeave';
import ShortfallLeaveReport from './ShortfallLeaveReport';

// create a component
const ViewReportHome = ({navigation}) => {
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());
  const [loader, setLoader] = useState(false);
  // const [ResponseData, setResponseData] = useState([]);
  // const [textinputSecondDate, setTextinputSecondDate] = useState('');
  // const [open, setOpen] = useState(false);
  //const [second, setSecond] = useState(false);
  const [applyLeave, setapplyLeave] = useState(0);
  // const [isSelected, setSelection] = useState('');
  // const [period, setPeriod] = useState('');
  const [checked, setChecked] = useState(null);
  const [validReason, setValidReason] = useState('Select Reason');
  const {authContext, AppUserData} = useContext(AuthContext);

  const [applyLeaveAS, setapplyLeaveAS] = useState(0);
  // const [comment, setComment] = useState('');

  // added for leave page
  const [LeaveTypes, setLeaveTypes] = useState([]);
  const [Leavereason, setLeavereason] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  // const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [FinancialYear, setFinancialYear] = useState([]);
  const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);
  //const [modalData, setModalData] = useState([]);
  //const [horizental, setHorizental] = useState(false);
  const [SelectedYear, setSelectedYear] = useState('');
  

  let usrAccess = AppUserData?.data?.userFlag;

// $&

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = getleavetypes();
  //     return () => unsubscribe;
  //   }, [])
  // )

  // var radio_props = [
  //   { label: 'Planned', value: "P" },
  //   { label: 'Unplanned', value: "U" },
  // ];
  // var radio_propsSecond = [
  //   { label: 'Full Day', value: 3 },
  //   { label: '1st Half', value: 1 },
  //   { label: '2nd Half', value: 2 },
  // ];

  // const leaveTypeScheema = yup.object().shape({
  //   leave: yup.string().required('Leave type is required'),
  //   planned: yup.string().required('Choose an option'),
  //   period: yup.string().required('Please select period'),
  //   selectDate: yup.string().required('Date  is required'),
  //   reason: yup.string().required('Please select a reason'),
  //   comment: yup.string().required('Comment is required'),
  // });
  const fromRef = useRef(null);

  // const PostSubmitLeave = data => {
  //   // console.log($1);
  //   // let dummydata =
  //   //   {
  //   //     "UserName" : "222852",
  //   //     "StaffNo" :  "222852",
  //   //     "PlannedUnplanned" : "Planned",
  //   //     "LeaveType" :"69#N#N",
  //   //     "Period" : "3",
  //   //     "FromDate" : "20-JUL-2022",
  //   //     "ToDate" : "21-JUL-2022",
  //   //     "Reason" : "skgn sk",
  //   //     "Comments" : ""
  //   // }

  //   let token = AppUserData.token;
  //   setLoader(true);
  //   ApiService.PostMethode('/SubmitLeave', data, token)
  //     .then(result => {
  //       setLoader(false);
  //       // console.log($1);
  //       if(result.Result){
  //         if(result.Result.search("successfully") != -1){
  //           fromRef.current.resetForm();
  //           setChecked(null);
  //           setValidReason("Select Reason");
  //         }
  //       }
  //       Toast.show(result.Result);
  //     })
  //     .catch(error => {
  //       setLoader(false);
  //       // console.log($1);
  //       if (error.response) {
  //         if (error.response.status == 401) {
  //           // console.log($1);
  //         }
  //         // client received an error response (5xx, 4xx)
  //         Toast.show(error.response.data.title);
  //       } else if (error) {
  //         // client never received a response, or request never left
  //         Toast.show('Network Error');
  //         // // console.log($1);
  //       } else {
  //         // anything else
  //         Toast.show('Session expired login again');
  //       }
  //     });
  // };

  const getleavetypes = () => {
    let apiData = {UserName: AppUserData?.data?.username};
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
            updatedArray.push({
              ...element,
              id: index,
              Type: element.SHORT_NAME,
              value: element.ABSENCE_ID.replace(/\D/g, ''),
            });
          });
// $&
          setLeaveTypes(updatedArray);
        } else {
          Toast.show('No Leave type found');
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  // const GetLeaveReason = (type) => {
  //   let apiData = { "LeaveType": type };
  //   // AppUserData?.data?.userId 222852
  //   let token = AppUserData.token;
  //   setLoader(true);
  //   ApiService.PostMethode('/GetLeaveReason', apiData, token, authContext)
  //     .then(result => {
  //       // console.log($1);
  //       setLoader(false);
  //       if (result.Value) {
  //         let reasons = [];
  //         result.Value.forEach((element, index) => {
  //           reasons.push({ ...element, id: index });
  //         });
  //         setLeavereason(reasons);
  //       } else {
  //         Toast.show('No Leave type found');
  //       }
  //     })
  //     .catch(error => {
  //       setLoader(false);
  //       // console.log($1);
  //       if (error.response) {
  //         if (error.response.status == 401) {
  //           // console.log($1);
  //         }
  //         // client received an error response (5xx, 4xx)
  //         Toast.show(error.response.data.title);
  //       } else if (error.request) {
  //         // client never received a response, or request never left
  //         Toast.show('Network Error');
  //         // // console.log($1);
  //       } else {
  //         // anything else
  //         Toast.show('Session expired login again');
  //       }
  //     });
  // }

  const getfinancialyear = () => {
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/LeaveStatus', apiData, token, authContext)
      .then(result => {
// $&
        setLoader(false);
        if (result.Value) {
          let reasons = [];
          setFinancialYear(result.Value.Table1);
          if (result.Value && result.Value.Table1[0].FNYR_YEAR) {
            setSelectedYear(Decrypt(result.Value.Table1[0].FNYR_YEAR));
            getEmpLeaveDetail(Decrypt(result.Value.Table1[0].FNYR_YEAR));
          }
        } else {
          Toast.show('No Leave type found');
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const getEmpLeaveDetail = fnyear => {
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
    let apiData = {
      StaffNo: AppUserData?.data?.userId,
      FromDate: from,
      ToDate: to,
    };

    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/GetEmplLevDetail', apiData, token, authContext)
      .then(result => {
        // // console.log($1);
        setLoader(false);
        let arr = [];
        if (result.Value) {
          arr.push(result.Value);
          // // console.log($1);
          setEmpLeaveDetail(...arr);
        } else {
          Toast.show('No Leave type found');
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  // const DeleteLeavePending = (data) => {

  //   let apiData = {
  //     "UserName": AppUserData?.data?.userId,
  //     "ApplicationID": data['Application ID']
  //   }
  //   // AppUserData?.data?.userId 222852
  //   let token = AppUserData.token;
  //   setLoader(true);
  //   ApiService.PostMethode('/DeleteLeave', apiData, token, authContext)
  //     .then(result => {
  //       // console.log($1);
  //       setLoader(false);
  //       if (result.Result) {
  //         getEmpLeaveDetail(SelectedYear);
  //         Toast.show(result.Result);
  //       } else {
  //         Toast.show('Unable To delete');
  //       }
  //     })
  //     .catch(error => {
  //       setLoader(false);
  //       // console.log($1);
  //       if (error.response) {
  //         if (error.response.status == 401) {
  //           // console.log($1);
  //         }
  //         // client received an error response (5xx, 4xx)
  //         Toast.show(error.response.data.title);
  //       } else if (error.request) {
  //         // client never received a response, or request never left
  //         Toast.show('Network Error');
  //         // // console.log($1);
  //       } else {
  //         // anything else
  //         Toast.show('Session expired login again');
  //       }
  //     });
  // }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // const initialVal = () => {
  //   // console.log($1);
  //   setapplyLeave(0);
  // };


  // useFocusEffect(
  //     React.useCallback(() => {
  //       const unsubscribe =  initialVal();
  //       return () => unsubscribe;
  //     }, [])
  // );
 

  const handleLeave = index => {
// $&
    if (index == 1) {
      // getfinancialyear();
    }
    setapplyLeave(index);
  };

  const handleLeaveAS = index => {
// $&
    if (index == 1) {
      // getfinancialyear();
    }
    setapplyLeaveAS(index);
  };

  // const rederReason = ({ item }) => {
  //   return (
  //     <View
  //       style={{
  //         paddingVertical: 15,
  //         paddingHorizontal: 10,
  //         margin: 2,
  //         borderBottomWidth: 1,
  //         borderBottomColor: GlobalColor.Secondary,
  //         marginVertical: 0,
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           // // console.log($1);
  //           setValidReason(item.REASON);
  //           fromRef.current.setFieldValue('reason', item.LOOKUP_CODE);
  //           setModalVisible(false);
  //         }}>
  //         <Text style={{}}>{item.REASON}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={{flex: 1,marginTop:5}}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}

      <View showsVerticalScrollIndicator={false} style={styles.container}>
        
{
usrAccess == 'Y'?
(
  <View
  style={{
    width: '100%',
    alignSelf: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
  }}>

    
  <ScrollView horizontal={true}>
    <SegmentedControlTab
      borderRadius={2}
      values={[
        'Absence',
        'Flexi Time Adj.',
        'Extra Work'
        
      ]}
      selectedIndex={applyLeaveAS}
      onTabPress={index => {
        handleLeaveAS(index);
      }}
      
      tabsContainerStyle={styles.tabsContainerStyle}
      tabStyle={styles.tabStyle}
      tabTextStyle={styles.tabTextStyle}
      activeTabStyle={styles.activeTabStyle}
      activeTabTextStyle={styles.activeTabTextStyle}
    />
  </ScrollView>
</View>
):
(
  <View
  style={{
    width: '100%',
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
        'Extra Work'
      ]}
      selectedIndex={applyLeave}
      onTabPress={index => {
        handleLeave(index);
      }}
      
      tabsContainerStyle={styles.tabsContainerStyle}
      tabStyle={styles.tabStyle}
      tabTextStyle={styles.tabTextStyle}
      activeTabStyle={styles.activeTabStyle}
      activeTabTextStyle={styles.activeTabTextStyle}
    />
  </ScrollView>
</View>
)
}

   {
    usrAccess == 'Y'?
    (
      <View style={{flexGrow: 1, paddingHorizontal: 10}}>
     
      {applyLeaveAS == 0 ? <LeaveViewReport /> : null}
      {applyLeaveAS == 1 ? <ShortfallLeaveReport /> : null}
      {applyLeaveAS == 2? <ExtraWorkLeaveReport /> : null}
    
    </View>
    ) :
    (
      <View style={{flexGrow: 1, paddingHorizontal: 10}}>
      {applyLeave == 0 ? <LeaveViewReport /> : null}
      {applyLeave == 1 ? <ShortfallLeaveReport /> : null}
      {applyLeave == 2 ? <ExtraWorkLeaveReport /> : null}
      
    </View>
    )
   }
     
       
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: GlobalColor.PrimaryLight,
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
    borderColor: '#0754b1',
  },
  tabTextStyle: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#0754b1',
  },
  activeTabTextStyle: {
    color: '#0754b1',
  },
  circleBox: {
    width: '16.6%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 1,
    borderColor: '#00B4DB',
    width: 40,
    height: 40,
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
    color: '#fff',
  },
  addtnlBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    zIndex: 55555,
  },
  checkboxContainer: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 2,
  },
});

//make this component available to the app
export default ViewReportHome;
