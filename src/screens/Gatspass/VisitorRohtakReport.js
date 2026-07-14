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
import { DataTable } from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';


const VisitorRohtakReport = ({navigation}) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setmodalVisibleSecond] = useState(false);
  const [empLoc, setEmpLoc] = useState([]);
  const [empLocCode, setEmpLocCode] = useState([]);
  const [searchLevel] = useState();
  const [searchLevelData, setSearchLevelData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [shiftData, setShiftData] = useState([]);

  const [ReportModal, setReportModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);

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
  const [selectBuilding, setSelectBuilding] = useState([]);
  const [ReportData, setReportData] = useState([]);
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

  const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [selectDate, setSelectDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [second, setSecond] = useState(false);
    const [textinputDate, setTextinputDate] = useState('');
    const [textinputSecondDate, setTextinputSecondDate] = useState('');
    const [refresh, setrefresh] = useState(false);
    const [FinancialYear, setFinancialYear] = useState([]);
    const [SelectedYear, setSelectedYear] = useState('');

  const [Locations, setLocations] = useState([]);
  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  };





  const GetReportApi = () => {
    let userId = AppUserData?.data?.userId;
    let fromDateReport = moment(fromDate).format('DD-MMM-YYYY');
    let toDateReport =  moment(toDate).format('DD-MMM-YYYY');
// $&
// $&
    // let newLoc = empLocCode.split(",")[0]
    let apiData = {
      StaffNo:userId,
      FromDate:fromDateReport,
      ToDate:toDateReport
    };
// $&
// $&
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/RHTKEMPLGetReport', apiData, token, authContext)
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
        setReportData(responseDataNew);
        // // console.log($1);
      
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  // useEffect(() => {
  //   GetReportApi(); 
  // }, []);


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

  const ItemRenderReport = ({item}) => (
    <TouchableOpacity
      key={item['Request ID']}
      style={styles.item}
      onPress={() => {
        setModalData(item);
        setReportModal(true);
      }}>
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text style={styles.itemText}>{item['From Date']}</Text>
        <Text style={styles.itemText}>{item['To Date']}</Text>
      </View>

      <View style={[styles.itemColumn, {flex: 0.2}]}>
        <Text style={styles.itemText}>
        {item['Request ID']}
        </Text>
      </View>

      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text style={styles.itemText}>{item.Purpose}</Text>
      </View>

      <View style={[styles.itemColumn]}>
        {item.Remarks === 'APPROVED' ? (
          <Text style={[styles.itemText, {color: 'green'}]}>{item.Remarks}</Text>
        ) : (
          <Text style={[styles.itemText, {color: 'red'}]}>{item.Remarks}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const FlatList_Header_Leave = () => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: GlobalColor.White,
          flexDirection: 'row',
        }}>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
          Date
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.2}]}>
          Type
        </Text>
        <Text Bold style={[styles.HeaderColumn, {flex: 0.4}]}>
          Period
        </Text>
        <Text Bold style={styles.HeaderColumn}>
          Status
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
         
                   
                <ScrollView
                    style={{ paddingHorizontal: 10 }}
                    contentContainerStyle={{ flex: 1 }}>
                    <Text style={{ paddingVertical: 10, paddingHorizontal: 0, fontSize: 13, fontWeight: '700' }}>
                        Select Date
                    </Text>
                    <View
                        style={styles.inlineDatepicker}>
                        <DatePicker
                            modal
                            open={open}
                            date={fromDate}
                            mode="date"
                            theme='light'
                            onConfirm={fromDate => {
                              setOpen(false);
                              setFromDate(fromDate);
                              let format = moment(fromDate).format('MMM Do YYYY');
                              setTextinputDate(format);
// $&
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '49%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <TextInput2
                                placeholder="From"
                                style={{ color: '#000' ,fontSize:13}}
                                editable={false}
                                value={textinputDate}
                            />
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Ionicons name="calendar-outline" size={25} color={'#43C6DB'} />
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
                              let formatSecond = moment(toDate).format('MMM Do YYYY');
                              setTextinputSecondDate(formatSecond);
// $&
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
                                style={{ color: '#000' ,fontSize:13}}
                                placeholder="To"
                                editable={false}
                                value={textinputSecondDate}
                            />


                            <TouchableOpacity onPress={() => setSecond(true)}>
                                <Ionicons name="calendar-outline" size={25} color={'#43C6DB'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, width: "100%", alignSelf: 'center' }}>
                        <Button
                        style={{fontSize:13}}
                            onPress={() => {
                              GetReportApi()
                            }}
                            title={"Submit"}
                        ></Button>
                    </View>





                    {/* Show Data */}
                    <View showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={{flex: 1, paddingHorizontal: 0, marginTop: 5}}>
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={ReportData} //EmpLeaveDetail
                renderItem={ItemRenderReport}
                keyExtractor={item => item.id}
                ListHeaderComponent={FlatList_Header_Leave}
                ListHeaderComponentStyle={{
                  borderBottomColor: '#43C6DB',
                  borderBottomWidth: 1,
                }}
                ListEmptyComponent={
                  <ListEmptyComponent
                    title="No Data Found"
                    enableRefresh={true}
                    onRefreshCallback={() =>
                      getEmpLeaveDetail(SelectedYear, true)
                    }
                    refreshing={refresh}></ListEmptyComponent>
                }
              />

              
              <Modal
                isVisible={ReportModal}
                // animationType="slide"
                transparent={true}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 5,
                      paddingVertical: 5,
                    }}>
                    <Text
                      Bold
                      style={{
                        fontSize: 15,
                        color: GlobalColor.Primary,
                      }}>
                      Employee Gatepass Report
                    </Text>

                    <TouchableOpacity
                      onPress={() => setReportModal(!ReportModal)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={25}
                        color={GlobalColor.Danger}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '90%'}}>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                        Request ID : {modalData['Request ID']}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                        Gatepass From : {modalData['From Date']}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                        Gatepass To : {modalData['To Date']}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                        Purpose : {modalData.Purpose}
                      </Text>
                      {/* <Text style={{fontWeight: '700', marginVertical: 8}}>
                        Planned/Unplanned : {modalData['Planned/Unplanned']}
                      </Text> */}
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                       Employee Id : {modalData.Period}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Employee Name : {modalData.Reason}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Designation : {modalData.Designation}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Department : {modalData.Department}
                      </Text>
                      
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      License No : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Reg. No. : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      DQR : {modalData.DQR}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Approver : {modalData.Approver}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      DPM Approval : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Admin Approver : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Admin Approval : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Entry On : {modalData.EntryOn}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Exit On : {modalData.Comments}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Requestor : {modalData.Requestor}
                      </Text>

                     

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Status : {modalData.Status}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      Remarks : {modalData.Remarks}
                      </Text>

                      

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      DIVISION : {modalData.DIVISION}
                      </Text>

                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 5}}>
                      VERTICAL : {modalData.VERTICAL}
                      </Text>

                      

                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        {modalData.Status &&
                        modalData.Status.toLowerCase() == 'pending' ? (
                          <TouchableOpacity
                            style={{
                              padding: 12,
                              borderRadius: 5,
                              backgroundColor: GlobalColor.Secondary,
                              minWidth: 100,
                              marginRight: 25,
                            }}
                            onPress={() => {
                              setReportModal(!ReportModal);
                              DeleteLeavePending(modalData);
                            }}>
                            <Text
                              style={{color: '#fff', alignSelf: 'center',fontSize:13}}
                              Bold>
                              Delete
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          style={{
                            padding: 12,
                            borderRadius: 5,
                            backgroundColor: GlobalColor.Secondary,
                            minWidth: 100,
                          }}
                          onPress={() => {
                            setReportModal(!ReportModal);
                          }}>
                          <Text
                            style={{color: '#fff', alignSelf: 'center',fontSize:13}}
                            Bold>
                            Okay
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
                </ScrollView>                
        </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  gradient: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: GlobalColor.PrimaryLight
},
item: {
  flexDirection: 'row',
  backgroundColor: GlobalColor.White,
  paddingHorizontal: 10,
  marginTop: 5,
  justifyContent: 'space-between',
  paddingVertical: 5,
  borderBottomWidth: 0.5,
  borderBottomColor: GlobalColor.Secondary,
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
  itemText: {
    fontSize: 13,
  },
  inlineDatepicker: {
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
export default VisitorRohtakReport;
