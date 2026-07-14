//import liraries
import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';
import {DataTable} from 'react-native-paper';
import * as ApiService from '../../Utils/Utils';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GlobalColor} from '../../constants/Colors';
import {GlobalFontSize} from '../../constants/FontSize';
import Text from '../../components/reusable/Text';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import {Decrypt} from '../../Service/Helper';

const LeaveViewReport = () => {
  const [loader, setLoader] = useState(false);
  const [applyLeave, setapplyLeave] = useState([0]);
  const [validReason, setValidReason] = useState('Select Reason');
  const {authContext, AppUserData} = useContext(AuthContext);
  // const [comment, setComment] = useState('');

  // added for leave page
  const [LeaveTypes, setLeaveTypes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [LeaveDetailModal, setLeaveDetailModal] = useState(false);
  const [FinancialYear, setFinancialYear] = useState([]);
  const [EmpLeaveDetail, setEmpLeaveDetail] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [SelectedYear, setSelectedYear] = useState('');
  const [refresh, setrefresh] = useState(false);

  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const stopLoader = () => {
    try {
      setLoader(false);
      setrefresh(false);
    } catch (error) {
// $&
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = getfinancialyear();
      return () => unsubscribe;
    }, []),
  );

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
        stopLoader(false);
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
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const getEmpLeaveDetail = (fnyear, isrefresh = false) => {
// $&
    if (!isrefresh) {
      setLoader(true);
    } else {
      setrefresh(true);
    }

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

    // // console.log($1);
    // return;
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    ApiService.PostMethode('/GetEmplLevDetail', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
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
        stopLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const DeleteLeavePending = data => {
    let apiData = {
      UserName: AppUserData?.data?.username,
      ApplicationID: data['Application ID'],
    };
    // AppUserData?.data?.userId 222852
    let token = AppUserData.token;
    setLoader(true);
    ApiService.PostMethode('/DeleteLeave', apiData, token, authContext)
      .then(result => {
// $&
        stopLoader(false);
        if (result.Result) {
          getEmpLeaveDetail(SelectedYear);
          Toast.show(result.Result);
        } else {
          Toast.show('Unable To delete');
        }
      })
      .catch(error => {
        stopLoader(false);
// $&
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const ItemRenderLeave = ({item}) => (
    <TouchableOpacity
      key={item['Application ID']}
      style={styles.item}
      onPress={() => {
        setModalData(item);
        setLeaveDetailModal(true);
      }}>
      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text style={styles.itemText}>{item['From Date']}</Text>
        <Text style={styles.itemText}>{item['To Date']}</Text>
      </View>

      <View style={[styles.itemColumn, {flex: 0.2}]}>
        <Text style={styles.itemText}>
          {item['Leave Type'] == 'ARS'
            ? item['Leave Type']
            : item['Leave Type'].split(' ')[0].substring(0, 1) +
              '. ' +
              item['Leave Type'].split(' ')[1].substring(0, 1) +
              '.'}
        </Text>
      </View>

      <View style={[styles.itemColumn, {flex: 0.4}]}>
        <Text style={styles.itemText}>{item.Period}</Text>
      </View>

      <View style={[styles.itemColumn]}>
        {item.Status === 'Approved' ? (
          <Text style={[styles.itemText, {color: 'green'}]}>{item.Status}</Text>
        ) : (
          <Text style={[styles.itemText, {color: 'red'}]}>{item.Status}</Text>
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
    <SafeAreaView style={{flex: 1}}>
      {loader ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}
      <View style={{flexGrow: 1}}>
        <View style={{flex: 1}}>
          <Text Bold style={{paddingHorizontal: 0, marginTop: 5,fontSize:13}}>
            Select Financial Year
          </Text>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              borderRadius: 0,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 2.0,
              elevation: 2,
              marginVertical: 10,
            }}>
            <SelectDropdown
              defaultButtonText={SelectedYear}
              data={FinancialYear}
              defaultValue={SelectedYear}
              defaultValueByIndex={0}
              buttonStyle={{
                backgroundColor: 'transparent',
                width: '100%',
                height: 50,
                borderRadius: 0,
              }}
              dropdownStyle={{borderRadius: 0}}
              rowTextStyle={{textAlign: 'left', marginLeft: 5,fontSize:14}}
              buttonTextStyle={{textAlign: 'left', marginLeft: 5,fontSize:14}}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={15}
                  />
                );
              }}
              onSelect={(selectedItem, index) => {
                getEmpLeaveDetail(Decrypt(selectedItem.FNYR_YEAR));
                setSelectedYear(Decrypt(selectedItem.FNYR_YEAR));
// $&
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return Decrypt(selectedItem.FNYR_YEAR);
              }}
              rowTextForSelection={(item, index) => {
                return Decrypt(item.FNYR_YEAR);
              }}
            />
          </View>

          <Text style={{textAlign: 'center',fontSize:14}}>
            Tap on Leave To View Details
          </Text>

          {/* Headings */}
          <View showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={{flex: 1, paddingHorizontal: 0, marginTop: 5}}>
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={EmpLeaveDetail} //EmpLeaveDetail
                renderItem={ItemRenderLeave}
                style={{marginBottom:"12%"}}
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

              {/* <DataTable
                      style={{
                        width: '100%',
                        backgroundColor: '#fff',
                        // marginVertical: '%',
                      }}>
                      <DataTable.Header style={{ backgroundColor: GlobalColor.White }}>
                        <DataTable.Title>
                          <Text Bold style={{ color: GlobalColor.Primary, fontSize: GlobalFontSize.Small }}>Date</Text>
                        </DataTable.Title>
                        <DataTable.Title numeric>
                          <Text Bold style={{ color: GlobalColor.Primary, fontSize: GlobalFontSize.Small }}>Type</Text>
                        </DataTable.Title>
                        <DataTable.Title numeric>
                          <Text Bold style={{ color: GlobalColor.Primary, fontSize: GlobalFontSize.Small }}>Period</Text>
                        </DataTable.Title>
                        <DataTable.Title numeric>
                          <Text Bold style={{ color: GlobalColor.Primary, fontSize: GlobalFontSize.Small }}>Status</Text>
                        </DataTable.Title>
                      </DataTable.Header>







  
                      <FlatList
                        data={EmpLeaveDetail}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
  
  
                        (
  
                          <View style={{ flex: 1 }} key={item['Application ID']}>
                            <TouchableOpacity
                              style={{ flex: 1 }}
                              key={item.id}
                              onPress={() => {
                                setModalData(item)
                                setLeaveDetailModal(true)
                              }}>
                              <DataTable.Row
                                style={{ borderBottomWidth: 1, paddingVertical: 5, }}>
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    // marginTop: '2%',
                                  }}>
                                  <DataTable.Cell >
                                                                      
                                     <Text>{item['From Date']}</Text>
                                     <Text>{item['To Date']}</Text>                                       
  
                                  </DataTable.Cell>
                                </View>
  
                                <DataTable.Cell numeric style={{ width:5 }}>{item['Leave Type'] == "ARS" ?
                                item['Leave Type'] : 
                                item['Leave Type'].split(" ")[0].substring(0, 1) + ". " + item['Leave Type'].split(" ")[1].substring(0, 1) + "." }</DataTable.Cell>


                                <DataTable.Cell numeric style={{ flex:1 }}>
                                  {item.Period}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.Status === 'Approved' ? (
                                    <Text style={{ color: 'green' }}>{item.Status}</Text>
                                  ) : (
                                    <Text style={{ color: 'red' }}>{item.Status}</Text>
                                  )}
                                </DataTable.Cell>
                              </DataTable.Row>
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </DataTable> */}
              <Modal
                isVisible={LeaveDetailModal}
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
                      paddingBottom: 15,
                      paddingVertical: 5,
                    }}>
                    <Text
                      Bold
                      style={{
                        fontSize: 14,
                        color: GlobalColor.Primary,
                      }}>
                      Leave Details
                    </Text>

                    <TouchableOpacity
                      onPress={() => setLeaveDetailModal(!LeaveDetailModal)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color={GlobalColor.Danger}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '90%'}}>
                      <Text style={{fontWeight: '600', fontSize:13, marginVertical: 8}}>
                        Leave Type : {modalData['Leave Type']}
                      </Text>
                      <Text style={{fontWeight: '600', fontSize:13, marginVertical: 8}}>
                        Leave From : {modalData['From Date']}
                      </Text>
                      <Text style={{fontWeight: '600', fontSize:13,marginVertical: 8}}>
                        Leave To : {modalData['To Date']}
                      </Text>
                      <Text style={{fontWeight: '600', fontSize:13, marginVertical: 8}}>
                        No of Days : {modalData.Days}
                      </Text>
                      {/* <Text style={{fontWeight: '700', marginVertical: 8}}>
                        Planned/Unplanned : {modalData['Planned/Unplanned']}
                      </Text> */}
                      <Text style={{fontWeight: '600', fontSize:13, marginVertical: 8}}>
                        Period : {modalData.Period}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 8}}>
                        Reason : {modalData.Reason}
                      </Text>
                      <Text style={{fontWeight: '600',fontSize:13, marginVertical: 12}}>
                        Remark : {modalData.Comments}
                      </Text>
                      {
                        modalData.Status == 'Rejected'?
                        <Text style={{fontWeight: '600',fontSize:13, marginVertical: 12}}>
                        Reject Remark : {modalData.REJ_REMARKS}
                       </Text>
                       : null
                      }
                     
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}>
                        {modalData.Status &&
                        modalData.Status.toLowerCase() == 'pending' ? (
                         usrAccess == 'Y'?null:
                          <TouchableOpacity
                            style={{
                              padding: 12,
                              borderRadius: 5,
                              backgroundColor: '#43C6DB',
                              minWidth: 90,
                              marginRight: 25,
                            }}
                            onPress={() => {
                              setLeaveDetailModal(!LeaveDetailModal);
                              DeleteLeavePending(modalData);
                            }}>
                            <Text
                              style={{color: '#fff', fontSize:13,alignSelf: 'center'}}
                              >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          style={{
                            padding: 12,
                            borderRadius: 5,
                            backgroundColor: '#43C6DB',
                            minWidth: 90,
                          }}
                          onPress={() => {
                            setLeaveDetailModal(!LeaveDetailModal);
                          }}>
                          <Text
                            style={{color: '#fff', fontSize:13,alignSelf: 'center'}}
                            >
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
    borderColor: GlobalColor.Secondary,
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
  HeaderColumn: {
    flex: 0.25,
    fontSize:14
  },
  itemColumn: {
    flex: 0.25,
    justifyContent: 'center',
  },
  itemButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GlobalColor.PrimaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemColumnButtons: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 13,
  },
});

export default LeaveViewReport;
