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
import ApplyLeave from '../Attendance/ApplyLeave';
import LeaveViewReport from '../Attendance/LeaveViewReport';
import LeaveBalance from '../Attendance/LeaveBalance';
import SalaryDeduct from '../Attendance/SalaryDeduct';

import { Header } from '../../components/reusable/Header';

import {Decrypt} from '../../Service/Helper';
import MyRequest from './MyRequest';
import TaxiBooking from './TaxiBooking';

// create a component
const TaxiReportHome = ({navigation}) => {
 
  const [loader, setLoader] = useState(false);
 
  const [applyLeave, setapplyLeave] = useState(0);
  
  const [checked, setChecked] = useState(null);
  const [validReason, setValidReason] = useState('Select Reason');
  const {authContext, AppUserData} = useContext(AuthContext);
  

  // added for leave page
  const [LeaveTypes, setLeaveTypes] = useState([]);
  const [Leavereason, setLeavereason] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  // const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [FinancialYear, setFinancialYear] = useState([]);
  const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);
  const [applyLeaveAS, setapplyLeaveAS] = useState(0);
  
  const [SelectedYear, setSelectedYear] = useState('');

  let usrAccess = AppUserData?.data?.userFlag;

// $&


  useFocusEffect(
    React.useCallback(() => {
      getleavetypes();
    }, [])
  )

  
  const fromRef = useRef(null);

  
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

  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLeave = index => {
    // // console.log($1);
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
  // const handleLeave = index => {
  //   setapplyLeave(index);
  // };

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
    <SafeAreaView style={{flex: 1}}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
{/* <Header title="Extra Working Consent" back /> */}
      <View showsVerticalScrollIndicator={false} style={styles.container}>
       

  <View
  style={{
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  }}>

    
  <ScrollView horizontal={true}>
    <SegmentedControlTab
      borderRadius={2}
      values={[
        'My Request',
        'Ongoing Request',
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

    

       

      <View style={{flexGrow: 1, paddingHorizontal: 10}}>
      {applyLeave == 0 ? <MyRequest /> : null}
      {applyLeave == 1 ? <TaxiBooking /> : null}
      
    </View>
  
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
    marginTop: 1,
    borderRadius: 0,
    width: '100%',
  },
  tabStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB',
  },
  tabTextStyle: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'Roboto-Bold',
  },
  activeTabStyle: {
    backgroundColor: GlobalColor.PrimaryLight,
    borderBottomWidth: 4,
    borderBottomColor: '#43C6DB',
  },
  activeTabTextStyle: {
    color: '#43C6DB',
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
    borderColor: '#43C6DB',
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
export default TaxiReportHome;
