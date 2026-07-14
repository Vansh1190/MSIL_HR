//import liraries
import React, {useEffect, useState, useContext, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Image,

  // TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  NativeModules,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';
import AuthService, {AuthPost, showErrorMessage} from '../Service/AuthService';
import * as ApiService from './../Utils/Utils';
import AuthContext from '../context/AuthContext';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from '../components/reusable/Text';
import {GlobalColor} from '../constants/Colors';
import {GlobalFontSize} from '../constants/FontSize';
import TextInput from '../components/reusable/TextInput';
import Button from '../components/reusable/Button';
import {LoadingScreen} from '../components/reusable/LoadingScreen';
// import { btoa, atob } from 'react-native-quick-base64';
import CryptoJS from 'react-native-crypto-js';
import {Decrypt, encrypyDecrypt} from '../Service/Helper';
import LoginButton from '../components/reusable/LoginButton';

import {setuid} from 'process';
import SegmentedControlTab from 'react-native-segmented-control-tab';

// var Aes = NativeModules.Aes

const SignIn = ({navigation}) => {
  const {authContext, AppUserData} = useContext(AuthContext);
  const [showPass, setShowPass] = useState(true);
  const [Loader, setLoader] = useState(false);
  const [isSelectedAD, setSelectionAD] = useState(false);
  const [isSelectedOTP, setSelectionoOTP] = useState(false);
  const [isFieldOTP, setisFieldOTP] = useState(false);
  const [isFieldUser, setisFieldUser] = useState(true);
  const [Btn_GenOTP, setBtn_GenOTP] = useState(true);
  const [MarkAttandance, setMarkAttandance] = useState(0);
  const [countNum, setCountNum] = useState(1);
  const [isStarted, setIsStarted] = useState(false);
  const [hitCount, setHitCount] = useState(0);

  const [otp, setOtp] = useState('');
  const [minutes, setMinutes] = useState(4);
  const [seconds, setSeconds] = useState(59);
  const [otpExp, setOTPEXP] = useState('');
  const [otpMob, setOTPMob] = useState('');

  let timer = () => {};


  

  const [selectedId, setSelectedId] = useState('1');
  const [Usr_id, setUsr_ID] = useState('');

  // const encryptData = (text, key) => {
  //   return Aes.sha1(text).then(iv => {
  //     // console.log($1);
  //       return iv;
  //   })
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);  
        }
      }
    }, 1000);

          // // console.log($1);
          // // console.log($1);

          if(minutes < 1 && seconds < 1)
          {
            setBtn_GenOTP(true);
            setisFieldUser(true);
            setisFieldOTP(false);
            setMinutes(4);
            setSeconds(59);
            
          }

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);


  const resendOTP = () => {
    setMinutes(4);
    setSeconds(59);
  };



  const handle_OTP = values => {
    let data = {
      UserName: encrypyDecrypt(values),
      // Password: encrypyDecrypt(values.Password),
    };
// $&
// $&
    setUsr_ID(values);

    if (values == '') {
      Toast.show('Please enter User Id');
      setisFieldOTP(false);
    } else {
      // return;
      setLoader(true);
      AuthPost('GenOTP', data)
        .then(res => {
// $&
// $&
// $&
         
          setHitCount(res.Result[0].OTP_HIT_COUNT);
          setOTPEXP(res.Result[0].OTP_VALID_FOR);
          setOTPMob(res.Result[0].OTP_MOB_NUM);
          setCountNum(1);
          if (res.Result != '') {
           
            setIsStarted(true);
            setLoader(false);
            setisFieldUser(false);
            setBtn_GenOTP(false);
            setisFieldOTP(true);
            setMinutes(res.Result[0].OTP_VALID_FOR - 1);
            setSeconds(59);
           
          }

          // let contextData = {
          //   token: res.token,
          //   user: values.UserName,
          // };
          // GetUserDetails(contextData);
        })
        .catch(error => {
// $&

          setLoader(false);
          showErrorMessage(error);
        });
    }
  };

  function add(count) {
    setCountNum(count + 1); //try count+1 ,not count=count+1
  }

  const loginAgain = () => {
    setBtn_GenOTP(true);
    setisFieldUser(true);
    setisFieldOTP(false);
  };

  const validate_OTP = values => {
// $&

    let data = {
      UserName: encrypyDecrypt(Usr_id),
      Password: encrypyDecrypt(values.UserOTP),
    };
// $&
// $&
// $&
// $&
// $&

    if (countNum > hitCount-1) {
      
      setisFieldUser(true);
      setisFieldOTP(false);
      setBtn_GenOTP(true);
     
     // setHitCount(0);
    }

    if (values.UserOTP == '') {
      Toast.show('Please enter OTP');
    } else {
      // return;
      setLoader(true);
      AuthPost('ValidateOTP', data)
        .then(res => {
// $&
// $&
          setLoader(false);

          let contextData = {
            token: res.token,
            user: Usr_id,
          };
// $&
          GetUserDetails(contextData);
        })
        .catch(error => {
// $&
          setLoader(false);
          showErrorMessage(error);

          add(countNum);
        });
    }
  };

//   const handleLogin = values => {
//     let data = {
//       UserName: encrypyDecrypt(values.UserName),
//       Password: encrypyDecrypt(values.Password),
//     };
// // $&
//     // return;
//     setLoader(true);
//     AuthPost('Login', data)
//       .then(res => {
// // $&
//         let contextData = {
//           token: res.token,
//           user: values.UserName,
//         };
//         GetUserDetails(contextData);
//       })
//       .catch(error => {
// // $&
//         setLoader(false);
//         showErrorMessage(error);
//         /*
// // $&
//         // return;
// // $&
//         Toast.show(JSON.stringify(error))
//         if (error.response) {
//           // client received an error response (5xx, 4xx)
// // $&
//           Toast.show(error.response.data.error.message)
//         } else if (error.request) {
//           // client never received a response, or request never left
//           Toast.show('Network Error')
//           // // console.log($1);
//         } else {
//           // anything else
//          Toast.show('Something Went Wrong');
//         }

//         */
//       });
//   };

const handleLogin = values => {
  console.log(values.UserName);
   console.log(values.Password);

 
  let data = {
    AppName:"HR-ASSIST",
    UserName: encrypyDecrypt(values.UserName),
    Password: encrypyDecrypt(values.Password),
    StatusFlag: "Y",
    EligFlag : "Y"
  };

 
  // // console.log($1);
  // return;
  setLoader(true);
  AuthPost('authenticate', data)
    .then(res => {
       console.log(data);
      let contextData = {
        token: res.token,
        user: values.UserName,
      };

      GetUserDetails(contextData);
    })
    .catch(error => {
      // // console.log($1);
      setLoader(false);
      showErrorMessage(error);
      /*
      // console.log($1);
      // return;
      // console.log($1);
      Toast.show(JSON.stringify(error))
      if (error.response) {
        // client received an error response (5xx, 4xx)
        // console.log($1);
        Toast.show(error.response.data.error.message)
      } else if (error.request) {
        // client never received a response, or request never left
        Toast.show('Network Error')
        // // console.log($1);
      } else {
        // anything else
       Toast.show('Something Went Wrong');
      }

      */
    });
};


  const GetUserDetails = ({token, user}) => {
    let data = {UserName: user};
// $&
// $&
     console.log(data);
     console.log(token);
    setLoader(true);
    // return;
    ApiService.PostMethode('/GetEmployeeProfile', data, token)
      .then(res => {
        //ACCS_FLAG
        let response = res.Value;
// $&
// $&
// $&
        setLoader(false);
        if (response.Table1) {
          let userData = {
            EMPL_NAME: Decrypt(response.Table1[0].EMPL_NAME),
            profile_photo: response.Table1[0].profile_photo,
            // profile_photo:null,
            userId: Decrypt(response.Table1[0].EMPL_ID),
            userNT:Decrypt(response.Table1[0].EMPL_NT_USER),
            username: user,
            EMPL_DESG_CODE: Decrypt(response.Table1[0].EMPL_DESG_CODE),
            userFlag: Decrypt(response.Table1[0].ACCS_FLAG),
            userDept:Decrypt(response.Table1[0].EMPL_DEPT_CODE),
            personalPhone:Decrypt(response.Table1[0].PERSONAL_PHONE),
            officialPhone:Decrypt(response.Table1[0].EXTN),
            empllocn:Decrypt(response.Table1[0].EMPL_LOCN_CODE),
            empldivncode:Decrypt(response.Table1[0].EMPL_DIVN_CODE),
            emplvertcode:Decrypt(response.Table1[0].DIVN_DIRC_CODE),
            emplcompcode:Decrypt(response.Table1[0].EMPL_COMP_CODE),
            emplusername :Decrypt(response.Table1[0].EMPL_NAME),
 
          };
          let contextData = {
            token: token,
            user: userData,
          };
          authContext.signIn({
            payload: contextData,
          });
        } else {
          Toast.show('Please Retry');
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        // return;
// $&
        ApiService.showErrorMessage(error, authContext);
      });
  };

  const handleMarkAttandance = index => {
    setMarkAttandance(index);
// $&
  };

  const loginValidationSchema = yup.object().shape({
    UserName: yup.string().required('Username is required'),
    // .min(6, 'min 6 digit is required')
    // .max(6, 'max 6 digit allowed'),
    Password: yup
      .string()
      // .min(8, 'Password must be atleast 8 character')
      .required('Password is required'),

    // UserOTP: yup
    // .string()
    // .required('OTP is Required'),
  });

  if (Loader) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <KeyboardAwareScrollView
        style={styles.container}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.container}>
            <View style={styles.gradient}>
              <View>
                <View
                  style={{
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../assets/Images/maruti_logo.png')}
                    style={{width: '90%', height: 100, resizeMode: 'contain'}}
                  />
                  <Image
                    source={require('../assets/Images/hrass.png')}
                    style={{
                      width: '60%',
                      height: 100,
                      resizeMode: 'contain',
                      marginBottom: 60,
                    }}
                  />

                   {/* <Image
                   style={{
                    width: '60%',
                    height: 80,
                    resizeMode: 'contain',
                    marginTop:-60
                   
                  }}
                  source={require('./../assets/Images/revv.png')}
                />  */}
                </View>
                {/* <Text style={{ fontSize: 35, color: GlobalColor.Primary, textAlign:'center', marginBottom:60 }} Bold>HR Assist</Text> */}
              </View>
            </View>

            <Formik
              validationSchema={loginValidationSchema}
              // initialValues={{ UserName: 'IT_KPMG', Password: 'Maruti@123' }}
              initialValues={{
                UserName: '',
                Password: '',
                UserId: '',
                UserOTP: '',
              }}
              onSubmit={values => {
                handleLogin(values);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View style={styles.login}>
                  {/* <Text style={{ fontSize: 30, color: GlobalColor.Primary, textAlign:'center', marginBottom:25, marginTop:25 }} Bold>Login</Text> */}
                  <View
                    style={{
                      paddingVertical: 10,
                      width: '100%',
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        paddingVertical: 10,
                        width: '100%',
                        alignSelf: 'center',
                        marginRight: 5,
                      }}>
                      <View style={styles.checkboxContainerH}>
                        <ScrollView horizontal={true}>
                          <View
                            style={{
                              paddingVertical: 10,
                              width: '100%',
                              alignSelf: 'center',
                            }}>
                            <SegmentedControlTab
                              borderRadius={2}
                              values={['Windows Login', 'OTP Login']}
                              selectedIndex={MarkAttandance}
                              onTabPress={index => {
                                handleMarkAttandance(index);
                              }}
                              tabsContainerStyle={styles.tabsContainerStyle}
                              tabStyle={styles.tabStyle}
                              tabTextStyle={styles.tabTextStyle}
                              activeTabStyle={styles.activeTabStyle}
                              activeTabTextStyle={styles.activeTabTextStyle}
                            />
                          </View>
                        </ScrollView>
                        {/* <View style={{ paddingVertical: 10,width:"100%",flexDirection:'row', alignSelf:'center'}}>
                          <RadioGroup
                              radioButtons={radioButtons} 
                            onPress={setSelectedId}
                           selectedId={selectedId}
                           layout='row'
                           labelStyle={{fontWeight: '700'}}   
                            />
                       </View> */}
                        {/* <Text Bold style={styles.checkboxTexHeader}>{isSelectedAD == true?'Login With AD':'Login With OTP'}</Text> */}
                      </View>
                    </View>
                  </View>
                  {MarkAttandance == '0' ? (
                    <View style={{paddingTop: 0}}>
                      <View style={{paddingVertical: 10}}>
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            padding: 5,
                            borderWidth: 1,
                            borderColor: GlobalColor.Primary,
                            alignItems: 'center',
                            alignSelf: 'center',
                            margin: 8,
                            borderRadius: 8,
                          }}>
                          <Ionicons
                            name="person-circle"
                            size={25}
                            color={'#43C6DB'}
                          />
                          <TextInput
                            placeholder="Login Id"
                            secureTextEntry={false}
                            maxLength={8}
                            onChangeText={handleChange('UserName')}
                            onBlur={handleBlur('UserName')}
                            value={values.UserName}
                          />
                        </View>
                        {errors.UserName && touched.UserName && (
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingVertical: 2,
                            }}>
                            <Text style={styles.error}>{errors.UserName}</Text>
                          </View>
                        )}
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 5,
                            borderWidth: 1,
                            borderColor: GlobalColor.Primary,
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: 8,
                            margin: 8,
                          }}>
                          <Ionicons
                            name="lock-closed"
                            size={25}
                            color={'#43C6DB'}
                          />

                          <TextInput
                            placeholder="Password"
                            maxLength={20}
                            secureTextEntry={showPass}
                            onChangeText={handleChange('Password')}
                            onBlur={handleBlur('Password')}
                            value={values.Password}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              if (showPass == false) {
                                setShowPass(true);
                              } else {
                                setShowPass(false);
                              }
                            }}>
                            {showPass == true ? (
                              <Ionicons
                                name="eye-off"
                                size={25}
                                color={GlobalColor.LightDark}
                              />
                            ) : (
                              <Ionicons
                                name="eye"
                                size={25}
                                color={GlobalColor.LightDark}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                        {errors.Password && touched.Password && (
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              paddingVertical: 2,
                            }}>
                            <Text style={styles.error}>{errors.Password}</Text>
                          </View>
                        )}
                        <View
                          style={{
                            paddingVertical: 10,
                            width: '90%',
                            alignSelf: 'center',
                          }}>
                          <LoginButton
                            onPress={() => handleSubmit()}
                            title="Sign In"></LoginButton>
                           
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={{paddingVertical: 10}}>
                      {isFieldUser == true ? (
                        <View
                          key="userIDV"
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            padding: 5,
                            borderWidth: 1,
                            borderColor: GlobalColor.Primary,
                            alignItems: 'center',
                            alignSelf: 'center',
                            margin: 8,
                            borderRadius: 8,
                          }}>
                          <Ionicons
                            name="person-circle"
                            size={25}
                            color={'#43C6DB'}
                          />
                          <TextInput
                            placeholder="Staff Id"
                            secureTextEntry={false}
                            maxLength={7}
                            keyboardType="numeric"
                            onChangeText={handleChange('UserId')}
                            onBlur={handleBlur('UserId')}
                            value={values.UserId}
                          />
                        </View>
                      ) : null}
                      {errors.User && touched.UserName && (
                        <View
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            paddingVertical: 2,
                          }}>
                          <Text style={styles.error}>{errors.UserName}</Text>
                        </View>
                      )}
                      {isFieldOTP == true ? (
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 5,
                            borderWidth: 1,
                            borderColor: GlobalColor.Primary,
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: 8,
                            margin: 8,
                          }}>
                          <Ionicons
                            name="lock-closed"
                            size={25}
                            color={'#43C6DB'}
                          />

                          <TextInput
                            placeholder="OTP"
                            maxLength={4}
                            keyboardType="numeric"
                            secureTextEntry={showPass}
                            onChangeText={handleChange('UserOTP')}
                            onBlur={handleBlur('UserOTP')}
                            value={values.UserOTP}
                          />

                          <TouchableOpacity
                            onPress={() => {
                              if (showPass == false) {
                                setShowPass(true);
                              } else {
                                setShowPass(false);
                              }
                            }}>
                            {showPass == true ? (
                              <Ionicons
                                name="eye-off"
                                size={25}
                                color={GlobalColor.LightDark}
                              />
                            ) : (
                              <Ionicons
                                name="eye"
                                size={25}
                                color={GlobalColor.LightDark}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {errors.UserOTP && touched.UserOTP && (
                        <View
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            paddingVertical: 2,
                          }}>
                          <Text style={styles.error}>{errors.UserOTP}</Text>
                        </View>
                      )}
                  {isFieldOTP == true ? (   
                     <View
                        style={{
                          width: '90%',
                          borderRadius: 8,
                          paddingLeft: 20,
                          alignItems: 'center',
                          alignContent:'center'
                        }}>
                      <Text style={{marginRight: 10,fontSize:13, }}>{'OTP has been Sent to your registered  Mobile  Number +91-'}{otpMob == null?'':otpMob.slice(0, 2)+ "*".repeat(otpMob.length - 6) + otpMob.slice(-4)}{". OTP Will be Valid For "}{'0'}{minutes}{':'}{seconds < 10 ?'0'+seconds:seconds}</Text>
                      </View>
                        ) : null}
                     

                      <View
                        style={{
                          paddingVertical: 10,
                          width: '90%',
                          flexDirection: 'row',
                          alignSelf: 'center',
                        }}>
                        {Btn_GenOTP == true ? (
                          <View
                            style={{
                              paddingVertical: 10,
                              width: '90%',
                              alignSelf: 'center',
                              marginLeft: 15,
                            }}>
                            <LoginButton
                              onPress={() => handle_OTP(values.UserId)}
                              title={
                                countNum > 2 ? 'Resend OTP' : 'Send OTP'
                              }>
                              </LoginButton>

                              

                              
                          </View>
                        ) : null}
                        {Btn_GenOTP == false ? (
                         <View
                         style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between', // or 'space-around' / 'center' based on spacing preference
                           paddingVertical: 10,
                           width: '45%',
                           alignSelf: 'center',
                           marginLeft: 15,
                         }}>
                            <LoginButton
                              onPress={() => loginAgain()}
                              title="Resend OTP"></LoginButton>
                            <LoginButton
                              onPress={() => validate_OTP(values)}
                              title="Sign In"></LoginButton>
                              
                          </View>
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </Formik>
          </View>
          <Text style={styles.copyRight}>
            Copyright {'\u00A9'} 2018 Maruti Suzuki India Ltd.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 0.5,
    width: '100%',
    paddingVertical: 10,
    marginBottom: -50,
    backgroundColor: '#43C6DB',
  },
  spinnerTextStyle: {
    color: GlobalColor.White,
  },
  login: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    // alignSelf: 'center',
    borderWidth: 1,
    borderColor: GlobalColor.White,
    // justifyContent:'center'
  },
  error: {
    color: GlobalColor.Danger,
    fontSize: GlobalFontSize.Error,
  },
  copyRight: {
    backgroundColor: GlobalColor.White,
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: GlobalFontSize.Small - 3,
  },
  checkboxContainer: {
    width: '55%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  group: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
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
  tabStyle: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#43C6DB',
  },
  checkboxContainerH: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 2,
    fontSize: 13,
  },
  tabsContainerStyle: {
    marginTop: 10,
    borderRadius: 0,
    width: '100%',
  },
  checkboxTexHeader: {
    marginLeft: 2,
    fontSize: 15,
    alignContent: 'center',
  },
});

//make this component available to the app
export default SignIn;
