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
import { Header } from '../../components/reusable/Header';

import {Decrypt} from '../../Service/Helper';
import AlreadySent from './AlreadySent';
import PendingAllowance from './PendingAllowance';

// create a component
const SundayAllowance = ({navigation}) => {
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

  
  const fromRef = useRef(null);

 

  
 

  const handleLeave = index => {
    alert("Test");
    setapplyLeave(index);
   
  };

  



  return (
    <SafeAreaView style={{flex: 1}}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
  <Header title="Extra Working Consent" back />
      <View showsVerticalScrollIndicator={false} style={styles.container}>
      

  <View
  style={{
    width: '100%',
    alignSelf: 'center',
    marginTop: -5,
    paddingHorizontal: 10,
  }}>

    
  <ScrollView horizontal={true}>
    <SegmentedControlTab
      borderRadius={2}
      
      values={[
        "Pending Consent's",
        "Old/Unapproved Consent's",
        
        
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
      
      {applyLeave == 1 ? <AlreadySent /> : null}
      {applyLeave == 0 ? <PendingAllowance /> : null}
      
     
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
    marginTop: 10,
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
export default SundayAllowance;
