import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import * as ApiService from '../../Utils/Utils';
import AuthContext from '../../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from '../../components/reusable/Text';
import {Header} from '../../components/reusable/Header';
import {GlobalColor} from '../../constants/Colors';
import Button from '../../components/reusable/Button';
import {LoadingScreen} from '../../components/reusable/LoadingScreen';
import {showErrorMessage} from '../../Utils/Utils';
import ListEmptyComponent from '../../components/reusable/ListEmptyComponent';
import moment from 'moment';
import {Decrypt} from '../../Service/Helper';

const Plencashment = ({navigation, route}) => {
  let pageName = route.params.pageName;
  const {authContext, AppUserData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [encashment, setEncashment] = useState([]);
  const [lta, setLta] = useState([]);
  const [ltaReport, setLtaReport] = useState([]);
  const [Plreport, setPlreport] = useState([]);
  const [encashDays, setEncashDays] = useState('');
  const [refresh, setrefresh] = useState(false);
  const [FinancialYear, setFinancialYear] = useState([]);
  const [YearFrom, setYearFrom] = useState('');
  const [YearTo, setYearTo] = useState('');

  const InitPLEncashmenApi = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    //set Loader
    setLoader(true);
    ApiService.PostMethode('/initPLEncashment', apiData, token, authContext)
      .then(result => {
        // Stop Loader
        stopLoader();

        let ApiValue = result.Value;
// $&
        {
          ApiValue.map(item => {
            return setEncashment(item);
          });
        }
        // setEncashment(ApiValue)
      })
      .catch(error => {
        // Stop Loader
        stopLoader();

        // // console.log($1);

        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const SubmitPLEncashmentApi = () => {
    let token = AppUserData.token;
  
    let apiData = {
      UserName: AppUserData?.data?.username,
      Encashdays: encashDays,
    };
  
    // Validation: encashDays should not be negative
    if (encashDays < 0) {
      Alert.alert('Error', 'Encashment days cannot be negative.');
      return;
    }
  
    // Validation: encashDays should be in increments of 0.5
    if (encashDays % 0.5 !== 0) {
      Alert.alert(
        'Error',
        'Encashment days must be in increments of 0.5 (e.g., 0.5, 1.0, 1.5, etc.).'
      );
      return;
    }
  
    // ✅ Validation: encashDays should have at most two decimal digits
    const decimalCheck = encashDays.toString().split('.');
    if (decimalCheck[1] && decimalCheck[1].length > 2) {
      Alert.alert('Error', 'Encashment days can have at most two decimal places.');
      return;
    }
  
    setLoader(true);
  
    ApiService.PostMethode('/SubmitPLEncashment', apiData, token, authContext)
      .then(result => {
        stopLoader();
        Alert.alert('Payroll', result.Result);
        InitPLEncashmenApi();
        ReportPL();
      })
      .catch(error => {
        stopLoader();
        ApiService.showErrorMessage(error, authContext);
      });
  };
  
   

  //   LTA ENCASHMENT API
  const InitMEDEncashment = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      UserName: AppUserData?.data?.username,
    };
    //Set Loader
    setLoader(true);
    ApiService.PostMethode('/InitMEDEncashment', apiData, token, authContext)
      .then(result => {
        // Stop Loader
        stopLoader();
        let ApiValue = result.Value;
// $&
        setLta(ApiValue);
      })
      .catch(error => {
        // Stop Loader
        stopLoader();
        // // console.log($1);
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };

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
// $&

          setFinancialYear(result.Value.Table1);
          if (result.Value && result.Value.Table1[0].FNYR_YEAR) {
            // setSelectedYear(result.Value.Table1[0].FNYR_YEAR);
            // getEmpLeaveDetail(result.Value.Table1[0].FNYR_YEAR);

            var curryear = new Date().getFullYear().toString().substring(0, 2);
            var from;
            if (
              parseInt(
                Decrypt(result.Value.Table1[0].FNYR_YEAR)
                  .toString()
                  .substring(0, 2),
              ) == 99
            ) {
              from =
                '01-apr-' +
                (parseInt(curryear) - 10) +
                Decrypt(result.Value.Table1[0].FNYR_YEAR)
                  .toString()
                  .substring(0, 2);
            } else {
              from =
                '01-apr-' +
                curryear +
                Decrypt(result.Value.Table1[0].FNYR_YEAR)
                  .toString()
                  .substring(0, 2);
            }
            var to =
              '31-mar-' +
              curryear +
              Decrypt(result.Value.Table1[0].FNYR_YEAR)
                .toString()
                .substring(2, 4);

// $&
// $&
            setYearFrom(from);
            setYearTo(to);
          }
        } else {
          Toast.show('Financial year not found');
        }
      })
      .catch(error => {
        setLoader(false);
        // // console.log($1);
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const ReportLTC = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      StaffNo: userId,
    };
    //set error
    setLoader(true);

    ApiService.PostMethode('/ReportLTC', apiData, token, authContext)
      .then(result => {
        // // console.log($1);
        // Stop Loader
        stopLoader();
        let ApiValue = result.Value;
        setLtaReport(ApiValue);
      })
      .catch(error => {
        // Stop Loader
        stopLoader();

        // // console.log($1);

        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const ReportPL = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      StaffNo: userId,
    };
    //set error
    setLoader(true);
    ApiService.PostMethode('/ReportPL', apiData, token, authContext)
      .then(result => {
// $&
        // Stop Loader
        stopLoader();
        let ApiValue = result.Value;
// $&
        setPlreport(ApiValue);
      })
      .catch(error => {
        // Stop Loader
        stopLoader();
        // // console.log($1);
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const createTwoButtonAlert = () =>
    Alert.alert('Payroll', 'Are you sure to Encash?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          SubmitMEDEncashmentApi();
        },
      },
    ]);

  const AlertOccurred = (title, body, btnTxt) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
// $&
        },
      },
    ]);
  };

  const SubmitMEDEncashmentApi = () => {
    let token = AppUserData.token;
    let userId = AppUserData?.data?.userId;
    let apiData = {
      StaffNo: userId,
    };
    //set Loader
    // setLoader(false);
    // createTwoButtonAlert();
    ApiService.PostMethode('/SubmitLtcEnch', apiData, token, authContext)
      .then(result => {
        // // console.log($1);
        // Stop Loader
        stopLoader();
        let ApiValue = result.Result;
        // alert(ApiValue)
        Alert.alert('Payroll', ApiValue);
        ReportLTC();
        // createTwoButtonAlert(ApiValue)
      })
      .catch(error => {
        // Stop Loader
        stopLoader();
// $&
        //Show Error Massage
        ApiService.showErrorMessage(error, authContext);
      });
  };
  const encashmentData = () => {
    if(parseInt(encashDays) > parseInt(Decrypt(encashment.PL_ENCASHABLE)) ){
      AlertOccurred('Payroll', 'Please enter equal/lesser than encashable limit', 'Ok');
      return;
    }

    if (encashDays == '') {
      AlertOccurred('Payroll', 'Please enter days', 'ok');
      return;
    }
    if (encashDays == 0) {
      AlertOccurred('Payroll', 'Please enter greater then zero', 'ok');
    } else {
      SubmitPLEncashmentApi();
      setEncashDays('');
    }
  };

  useEffect(() => {
    if (route.params.pageName == 'PL Encashment') {
      InitPLEncashmenApi();
      ReportPL();
      // InitMEDEncashment()
    } else {
      ReportLTC();
      getfinancialyear();
    }
  }, []);

  if (loader) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={pageName} />
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  const stopLoader = () => {
    setLoader(false);
    setrefresh(false);
  };

  return (
    <SafeAreaView>
      {loader == true ? (
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      ) : null}

      <ScrollView style={styles.container}>
        <Header title={pageName} />
        <View style={{paddingHorizontal: 10}}>
          {pageName == 'PL Encashment' ? (
            <View>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                  paddingVertical: 10,
                  backgroundColor: GlobalColor.White,
                  shadowColor: GlobalColor.Black,
                  shadowOffset: {
                    width: -0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 5,
                  borderRadius: 5,
                  marginBottom: 10,
                }}>
                <View style={styles.box}>
                  <Text style={{fontSize:15}}>Current balance</Text>
                  <Text style={{fontSize:15}} Bold>
                    {Decrypt(encashment.PL_BAL) && Decrypt(encashment.PL_BAL)}
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text style={{fontSize:15}}>Current year opening balance</Text>
                  <Text  style={{fontSize:15}} Bold>
                    {Decrypt(encashment.PL_CR_FWD) &&
                      Decrypt(encashment.PL_CR_FWD)}
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text style={{fontSize:15}}>PL encashable</Text>
                  <Text style={{fontSize:15}} Bold>
                    {Decrypt(encashment.PL_ENCASHABLE) &&
                      Decrypt(encashment.PL_ENCASHABLE)}
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text style={{fontSize:15}}>Encash</Text>
                  <TextInput
                    style={{
                      width: 50,
                      borderBottomWidth: 1,
                      fontWeight: 'bold',
                      textAlign: 'right',
                      fontSize:15,
                    }}
                    keyboardType={'numeric'}
                    onChangeText={text => {
                      setEncashDays(text);
                    }}
                    value={encashDays}
                  />
                </View>
              </View>
              <View style={{flex: 1, marginTop: 10}}>
                <Button
                  onPress={() => {
                    encashmentData();
                  }}
                  textStyle={{fontSize:15}}
                  title="CLAIM"></Button>
                <Text style={{textAlign: 'center'}}>Report</Text>
                <View style={styles.reportHeader}>
                  <Text Bold style={{ fontSize: 15}}>Process Date</Text>
                  <Text Bold style={{ fontSize: 15}}>Process Desc</Text>
                      <Text Bold style={{ fontSize: 15}}>Days</Text>
                </View>

                {Plreport.length > 0 ? (
                  <View style={{ marginBottom:"35%"}}>
                    {Plreport &&
                      Plreport.map(item => {
                        console.log(
                          ' Formated Date',
                          Decrypt(item.PROCESSDATE),
                        );
                        console.log(
                          ' Process Description',
                          Decrypt(item.PROCESS_DESCRIPTION),
                        );
                        return (
                          <ScrollView >
                            <TouchableOpacity
                              style={[
                                styles.reportHeader,
                                {
                                  paddingVertical: 15,
                                  paddingHorizontal: 10,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  backgroundColor: '#fff',
                                  marginBottom: 3,
                                  borderWidth: 0.5,
                                  borderColor: GlobalColor.LightDark,
                                },
                              ]}>
                              {item.PROCESSDATE ==
                              'WqRbyBS9EWc/IkwRmHW68g==' ? (
                                <Text style={{fontSize:15}}></Text>
                              ) : (
                                <Text style={{ fontSize: 15}}>
                                  {item.PROCESSDATE
                                    ? moment(Decrypt(item.PROCESSDATE)).format(
                                        'MM/DD/YYYY',
                                      )
                                    : ''}
                                </Text>
                              )}
                              {item.PROCESS_DESCRIPTION ==
                              'WqRbyBS9EWc/IkwRmHW68g==' ? (
                                <Text style={{ fontSize: 13}}></Text>
                              ) : (
                                <Text style={{ fontSize: 13}}>{Decrypt(item.PROCESS_DESCRIPTION)}</Text>
                              )}
                              <Text style={{ fontSize: 13}}>{Decrypt(item.ENTRY_EARN_VALUE)}</Text>
                            </TouchableOpacity>
                          </ScrollView>
                        );
                      })}
                  </View>
                ) : (
                  <ListEmptyComponent title="No Data Found"></ListEmptyComponent>
                )}
              </View>
            </View>
          ) : (
            <View>
              <View style={{}}>
                {lta.length > 0 ? (
                  <View>
                    {lta &&
                      lta.map(item => {
// $&
                        return (
                          <>
                            <View
                              style={[styles.reportHeader, {marginTop: 15}]}>
                              <Text style={{ fontSize: 13}}>Financial Year</Text>
                              <Text Bold style={{ fontSize: 13}}> {Decrypt(item.MENT_FNYR_YEAR)}</Text>
                            </View>
                            <View style={[styles.reportHeader, {marginTop: 5}]}>
                              <Text style={{ fontSize: 13}}>Staff No</Text>
                              <Text Bold style={{ fontSize: 13}}>{Decrypt(item.MENT_EMPL_ID)}</Text>
                            </View>
                          </>
                        );
                      })}
                  </View>
                ) : (
                  <View>
                    <View style={styles.box}>
                      <Text style={{ fontSize: 13}}>Financial Year</Text>
                      {/* <Text>
                        {moment(YearFrom).format('YYYY')}-
                        {moment(YearTo).format('YYYY')}
                      </Text> */}
                      <Text style={{ fontSize: 13}}>
                        {YearFrom.split('-')[2]}-{YearTo.split('-')[2]}
                      </Text>
                    </View>
                    <View style={styles.box}>
                      <Text style={{ fontSize: 13}}>Staff No</Text>
                      <Text style={{ fontSize: 13}}>{AppUserData?.data?.userId}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={{height: 100, marginTop: 10}}>
                <Button
                  onPress={() => {
                    // SubmitMEDEncashmentApi();
                    createTwoButtonAlert();
                  }}
                  style={{ fontSize: 13}}
                  title="ENCASH"></Button>
                <Text style={{textAlign: 'center',fontSize:13}}>Report</Text>
              </View>
              <View style={styles.reportHeader}>
                <Text style={{ flex:0.5 ,fontSize:13}} Bold>Name</Text>
                <Text style={{ flex:0.2,fontSize:13 }} Bold>Year</Text>
                <Text style={{ flex:0.3,fontSize:13, textAlign:'right'}} Bold>Desc</Text>
              </View>

              {ltaReport.length > 0 ? (
                <View>
                  {ltaReport &&
                    ltaReport.map(item => {
                      return (
                        <TouchableOpacity
                          style={[
                            styles.reportHeader,
                            {
                              paddingVertical: 15,
                              paddingHorizontal: 10,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#fff',
                              marginBottom: 3,
                              borderWidth: 0.5,
                              borderColor: GlobalColor.LightDark,
                            },
                          ]}>
                          <Text style={{ flex:0.5 , fontSize:13}}>{Decrypt(item.LTCF_FAML_NAME)}</Text>
                          <Text style={{ flex:0.2 ,fontSize:13}}>{Decrypt(item.LTCF_YEARS)}</Text>
                          <Text style={{ flex:0.3, fontSize:13, textAlign:'right'}}>{Decrypt(item.RLTY_DESC)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              ) : (
                <ListEmptyComponent title="No Data Found"></ListEmptyComponent>
                // <View style={{ width: '90%', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                //   <Text>Not Data Found</Text>
                // </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: GlobalColor.PrimaryLight,
   
  },
  box: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 0,
    borderColor: GlobalColor.PrimaryGradient,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  reportHeader: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 7,
    backgroundColor: GlobalColor.White,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: GlobalColor.LightDark,
  },

  reportData: {},
});
export default Plencashment;
