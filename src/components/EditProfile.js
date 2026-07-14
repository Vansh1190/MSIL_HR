import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';

import {

  View, StyleSheet, Image, FlatList, SafeAreaView, TouchableOpacity,

  Linking, ScrollView, Switch, ActivityIndicator, Alert, Dimensions, ImageBackground

} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthContext from '../context/AuthContext';

import * as ApiService from '../Utils/Utils';

import Toast from 'react-native-simple-toast';

import Spinner from 'react-native-loading-spinner-overlay';

import { Header } from './reusable/Header';

import { LoadingScreen } from './reusable/LoadingScreen';

import ListEmptyComponent from './reusable/ListEmptyComponent';

import Button from './reusable/Button';

import Text from './reusable/Text';

import { GlobalColor } from '../constants/Colors';

import { Decrypt, encrypyDecrypt } from '../Service/Helper';

import { BUSINESSCARD_URL } from '../API/Api';

import { QrReader } from 'react-native-qrcode-scanner';

import { Contacts } from 'react-native-contacts';

import Modal from 'react-native-modal';

import ViewShot from "react-native-view-shot";

import Share from 'react-native-share';

import RadioGroup from 'react-native-radio-buttons-group';

import PagerView from 'react-native-pager-view';

// import QRCode from 'react-native-qrcode-svg';   // ← uncomment when enabling QR code

 

// ────────────────────────────────────────────────

// Utility: title-case

// ────────────────────────────────────────────────

const toTitleCase = (str) => {

  if (!str || typeof str !== 'string') return '';

  return str.trim().toLowerCase().split(' ')

    .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

};

 

// ────────────────────────────────────────────────

// Helper extractors (same logic as BusinessCard.jsx)

// ────────────────────────────────────────────────

const getPhoneNumber = (d) => {

  if (!d) return '';

  const arr = Array.isArray(d) ? d : [d];

  const chosen = arr.find(p => p.phoneType === '3287') || arr.find(p => p.phoneType === '3288') || arr[0];

  return chosen?.phoneNumber ? `+91 ${chosen.phoneNumber}` : '';

};

 

const getEmail = (d) => {

  if (!d) return '';

  const arr = Array.isArray(d) ? d : [d];

  const emailAddr = (arr.find(e => e.emailType === '3294') || arr[0])?.emailAddress || '';

  return emailAddr.toLowerCase();

};

 

const getSocialMedia = (d) => {

  if (!d) return { linkedin: '', instagram: '', facebook: '', twitter: '' };

  const arr = Array.isArray(d) ? d : [d];

  return {

   linkedin:  arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'LinkedIn')?.url  || '',

    instagram: arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Instagram')?.url || '',

    facebook:  arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Facebook')?.url  || '',

    twitter:   arr.find(a => a?.domainNav?.PicklistOption?.localeLabel === 'Twitter/X')?.url || '',

  };

};

 

// ────────────────────────────────────────────────

// Main Component

// ────────────────────────────────────────────────

const EditProfile = ({ navigation, route }) => {

  const [loader, setLoader] = useState(false);

  const { authContext, AppUserData } = useContext(AuthContext);

 

  // ── old EditProfile state (preserved) ──

  const [employeeData, setEmployeeData] = useState([]);

  const [empPhone, setEmpPhone] = useState('');

  const [isEnabled, setIsEnabled] = useState(false);

  const [nominiData, setNominiData] = useState('');

  const [refresh, setrefresh] = useState(false);

  const [ReportModal, setReportModal] = useState(false);

  const [isShare, setIsShare] = useState(true);

  const [selectedId, setSelectedId] = useState('1');

  const [bgr1, setBgr1] = useState('');

  const [bgr2, setBgr2] = useState('');

  const [bgr3, setBgr3] = useState('');

  const [bgr4, setBgr4] = useState('');

 

  // ── ID Card state (moved from Home) ──

  const [pageIndex, setPageIndex] = useState(0);

  const [Nem, setNem] = useState('');

  const [staffId, setStaffId] = useState('');

  const [Dept, setDept] = useState('');

  const [Loc, setLoc] = useState('');

 

  const ref = useRef();

 

  const radioButtons = useMemo(() => [

    { id: '1', label: 'Theme 1', value: 'https://marutistoragenew.blob.core.windows.net/ag3mobileapp/visiting_bg1.png', size: 17 },

    { id: '2', label: 'Theme 2', value: 'https://marutistoragenew.blob.core.windows.net/ag3mobileapp/visiting_bg2.png', size: 17 },

    { id: '3', label: 'Theme 3', value: 'https://marutistoragenew.blob.core.windows.net/ag3mobileapp/visiting_bg3.png', size: 17 },

    { id: '4', label: 'Theme 4', value: 'https://marutistoragenew.blob.core.windows.net/ag3mobileapp/visiting_bg4.png', size: 17 },

  ], []);

 

  let usrAccess = AppUserData?.data?.userFlag;

 

  // ────────────────────────────────────────────────

  // OLD: employeProfile (preserved — feeds the FlatList)

  // ────────────────────────────────────────────────

  const employeProfile = () => {

    let token   = AppUserData.token;

    let userId  = AppUserData?.data?.userId;

    let apiData = { UserName: AppUserData?.data?.username };

    setLoader(true);

    ApiService.PostMethode('/GetEmployeeProfile', apiData, token, authContext)

      .then(result => {

        stopLoader(false);

        let responseData    = result.Value.Table1;

        let NominationData  = result.Value.Table2;

        let Phone = Decrypt(result.Value.Table1[0].EXTN);

 

        setEmpPhone(Decrypt(result.Value.Table1[0].EXTN));

        setNominiData(NominationData);

        setEmployeeData(responseData);

        setIsEnabled(Decrypt(responseData[0].PRIVATE_FLAG) !== 'Y' ? true : false);

 

        // ── Populate ID Card fields from the same API ──

        setNem(Decrypt(responseData[0].EMPL_NAME));

        setStaffId(Decrypt(responseData[0].EMPL_ID));

        setDept(Decrypt(responseData[0].EMPL_DEPT_CODE));

        setLoc(Decrypt(result.Value.Table1[0].LOCN_DESC));

      })

      .catch(error => {

        stopLoader(false);

        ApiService.showErrorMessage(error, authContext);

      });

  };

 

  // ────────────────────────────────────────────────

  // OLD: showBaground (preserved)

  // ────────────────────────────────────────────────

  const showBaground = () => {

    let token   = AppUserData.token;

    let userId  = AppUserData?.data?.userId;

    let apiData = { UserName: userId };

    ApiService.PostMethode('/GetFileFromSFTP', apiData, token, authContext)

      .then(result => {

        setBgr1('data:image/jpeg;base64,' + result.Result[3]);

        setBgr2('data:image/jpeg;base64,' + result.Result[4]);

        setBgr3('data:image/jpeg;base64,' + result.Result[5]);

        setBgr4('data:image/jpeg;base64,' + result.Result[6]);

      })

      .catch(error => {

        ApiService.showErrorMessage(error, authContext);

      });

  };

 

  // ────────────────────────────────────────────────

  // OLD: handleSwitchChange + UpdateEmpProf (preserved)

  // ────────────────────────────────────────────────

  const handleSwitchChange = (value) => {

    setIsEnabled(value);

    Alert.alert(

      'Update Number',

      `Your number is ${value ? 'Public' : 'Private'}. Please press OK to save!!`,

      [

        { text: 'Cancel', onPress: () => setIsEnabled(!value), style: 'cancel' },

        { text: 'OK', onPress: () => UpdateEmpProf(value) },

      ]

    );

  };

 

  const UpdateEmpProf = (value) => {

    let token  = AppUserData.token;

    let userId = AppUserData?.data?.userId;

    let apiData = {

      StaffNo:      userId,

      PresonalNo:   '',

      ExtensionNo:  empPhone,

      EmergencyNo:  '',

      Flag:         value ? 'N' : 'Y',

    };

    ApiService.PostMethode('/UpdateEmpProf', apiData, token, authContext)

      .then(result => {

        stopLoader(false);

        Toast.show(result.Result ? 'Profile updated successfully' : 'Update Failed');

      })

      .catch(error => {

        stopLoader(false);

        ApiService.showErrorMessage(error, authContext);

      });

  };

 

  useEffect(() => {

    showBaground();

    employeProfile();

  }, []);

 

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

 

  const stopLoader = () => {

    try {

      setLoader(false);

      setrefresh(false);

    } catch (error) { }

  };

 

  return (

    <SafeAreaView style={styles.container}>

      <Header back title='Profile' />

      <View style={{

        flex: 1, marginTop: 40, backgroundColor: '#fff', width: '95%',

        alignSelf: 'center', shadowColor: '#000',

        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25,

        shadowRadius: 3.84, elevation: 5, borderRadius: 8,

      }}>

        <View style={{

          borderWidth: 5, borderColor: '#fff', shadowColor: '#000',

          shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.5,

          shadowRadius: 3.84, elevation: 5, justifyContent: 'center',

          alignSelf: 'center', borderRadius: 100, marginTop: -20,

        }}>

          {AppUserData.data && AppUserData.data.profile_photo ? (

            <Image source={{ uri: AppUserData.data.profile_photo }}

              style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 100, alignSelf: 'center' }} />

          ) : (

            <Image source={require('../assets/Images/Avtar.png')}

              style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 100, alignSelf: 'center' }} />

          )}

        </View>

 

        <View style={{ flex: 1, marginTop: 10 }}>

          <FlatList

            data={employeeData}

            contentContainerStyle={{ flexGrow: 1 }}

           showsVerticalScrollIndicator={false}

            ListEmptyComponent={() => (

              <View style={{ flex: 1 }}>

                {!loader

                  ? <ListEmptyComponent enableRefresh={true} onRefreshCallback={() => employeProfile(true)} refreshing={refresh} />

                  : <LoadingScreen />}

              </View>

            )}

            keyExtractor={(item) => item.EMPL_ID.toString()}

            renderItem={({ item, index }) => (

              <View key={item.EMPL_ID}>

               <Text style={{ color: 'gray', fontSize: 20, textAlign: 'center', padding: 5, letterSpacing: 1 }}>

                  {Decrypt(item.EMPL_NAME)}

                </Text>

 

                <TouchableOpacity onPress={() => setReportModal(!ReportModal)}>

                  <Text style={{ color: '#43C6DB', fontSize: 15, textAlign: 'center', padding: 5, letterSpacing: 1, fontWeight: '700' }}>

                    My ID Card

                  </Text>

                </TouchableOpacity>

 

                <View style={styles.box}>

                  <Text style={styles.header}>Vertical / Div ./Department</Text>

                  <Text style={styles.editProfFont}>

                    {Decrypt(item.DIVN_DIRC_CODE)} / {Decrypt(item.EMPL_DIVN_CODE)} / {Decrypt(item.EMPL_DEPT_CODE)}

                  </Text>

                </View>

 

                <View style={styles.box}>

                  <Text style={styles.headerphn}>Personal Phone Number</Text>

                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${Decrypt(item.PRESENT_PHONE)}`)}>

                      <Text style={{ color: '#43C6DB', fontWeight: '700', fontSize: 14, marginTop: 5 }}>

                        {Decrypt(item.PRESENT_PHONE)}

                      </Text>

                    </TouchableOpacity>

                    <Switch

                      trackColor={{ false: '#767577', true: '#43C6DB' }}

                      thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}

                      ios_backgroundColor="#3e3e3e"

                      onValueChange={handleSwitchChange}

                      style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}

                      value={isEnabled}

                    />

                  </View>

                </View>

 

                <TouchableOpacity onPress={() => Linking.openURL(`tel:${Decrypt(item.EXTN)}`)}>

                  <View style={styles.box}>

                    <Text style={styles.header}>Offical Phone Number</Text>

                    <Text style={{ color: '#43C6DB', fontWeight: '700', fontSize: 14, marginTop: 5 }}>{Decrypt(item.EXTN)}</Text>

                  </View>

                </TouchableOpacity>

 

                <View style={styles.box}>

                  <Text style={styles.header}>Email Id</Text>

                  <Text style={styles.editProfFont}>

                    {Decrypt(item.EMPL_EMAIL_ID) ? Decrypt(item.EMPL_EMAIL_ID) + '@maruti.co.in' : 'N.A'}

                  </Text>

                </View>

 

                <View style={styles.box}>

                  <Text style={styles.header}>HRBP</Text>

                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Text style={styles.editProfFont}>{Decrypt(item.HRBP)}</Text>

                    <Ionicons name="md-call-sharp" size={25} color={'#43C6DB'}

                      onPress={() => Linking.openURL(`tel:${Decrypt(item.HRBP_PHONE)}`)} />

                  </View>

                </View>



                <View style={styles.box}>

                  <Text style={styles.header}>HRSS</Text>

                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Text style={styles.editProfFont}>{Decrypt(item.HRSS)}</Text>

                    <Ionicons name="md-call-sharp" size={25} color={'#43C6DB'}

                      onPress={() => Linking.openURL(`tel:${Decrypt(item.HRSS_PHONE)}`)} />

                  </View>

                </View>



                <View style={styles.box}>

                  <Text style={styles.header}>Permanent Address</Text>

                  <Text style={styles.editProfFont}>

                    {Decrypt(item.PERMANENT_ADDRESS_LINE1)}, {Decrypt(item.PERMANENT_ADDRESS_LINE2)}, {Decrypt(item.PERMANENT_ADDRESS_LINE3)}, {Decrypt(item.PERMANENT_CITY)}, {Decrypt(item.PERMANENT_ADDRESS)}, {Decrypt(item.PERMANENT_PINCODE)}

                  </Text>

                </View>

 

                <View style={styles.box}>

                  <Text style={styles.header}>Present Address</Text>

                  <Text style={styles.editProfFont}>

                    {Decrypt(item.PRESENT_ADDRESS_LINE1)}, {Decrypt(item.PRESENT_ADDRESS_LINE2)}, {Decrypt(item.PRESENT_ADDRESS_LINE3)}, {Decrypt(item.PRESENT_CITY)}, {Decrypt(item.PRESENT_ADDRESS)}, {Decrypt(item.PRESENT_PINCODE)}

                  </Text>

                </View>

 

                <View style={styles.box}>

                  <Text style={styles.header}>Nominations</Text>

                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }}

                    onPress={() => navigation.navigate('Nomination', { data: nominiData })}>

                    <Text style={{ color: '#43C6DB' }}>Check in Details</Text>

                    <Ionicons name="arrow-forward-outline" size={25} color={'#43C6DB'} />

                  </TouchableOpacity>

                </View>

              </View>

            )}

          />

        </View>

      </View>

 

      {employeeData.length > 0 ? (

        <View style={{ backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10 }} />

      ) : null}

 

      {/* ─────────────────────────────────────────────────────

          ID CARD MODAL (moved from Home)

         ───────────────────────────────────────────────────── */}

      <Modal visible={ReportModal} animationType="slide" transparent={true}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <View

            style={{

              position: 'absolute',

              width: Dimensions.get('screen').width,

              height: Dimensions.get('screen').height,

              backgroundColor: 'rgba(0, 0, 0, 0.4)',

            }}

          />

 

          <View

            style={{

              padding: 22,

              borderRadius: 0,

              backgroundColor: '#fff',

              marginHorizontal: 20,

              elevation: 5,

              shadowColor: '#000',

              shadowOffset: { width: 0, height: 2 },

              shadowOpacity: 0.3,

              shadowRadius: 4,

            }}>

            <View

              style={{

                padding: 22,

                borderRadius: 0,

                width: Dimensions.get('screen').width,

                backgroundColor: '#fff',

                height: 'auto',

              }}>

              <View

                style={{

                  flexDirection: 'row',

                  alignItems: 'center',

                  justifyContent: 'space-between',

                  paddingBottom: 5,

                  paddingVertical: 5,

                  borderBottomWidth: 0.5,

                }}>

                <Text

                  Bold

                  style={{

                    fontSize: 15,

                    color: GlobalColor.Primary,

                  }}>

                  {pageIndex === 0 ? 'ID Card' : 'QR Code For Gate In/Out'}

                </Text>

 

                <TouchableOpacity onPress={() => setReportModal(!ReportModal)}>

                  <Ionicons

                    name="close-circle-outline"

                    size={25}

                    color={GlobalColor.Danger}

                  />

                </TouchableOpacity>

              </View>

 

              <PagerView

                style={{ height: 300, marginTop: 10 }}

                initialPage={0}

                onPageSelected={e => {

                  const index = e.nativeEvent.position;

                  setPageIndex(index);

                  setSelectedId(index === 0 ? '1' : '2');

                }}>

                <View key="1" style={{ alignItems: 'center' }}>

                  <View

                    style={{

                      borderWidth: 1,

                      borderColor: '#000',

                      padding: 10,

                      backgroundColor: '#fff',

                      width: 260,

                    }}>

                    <View

                      style={{

                        flexDirection: 'row',

                        justifyContent: 'center',

                        alignItems: 'center',

                      }}>

                      <Text

                        style={{

                          fontWeight: 'bold',

                          fontSize: 18,

                          color: 'red',

                        }}>

                        MARUTI{' '}

                      </Text>

                      <Image

                        source={require('../assets/Images/mslogo.png')}

                        style={{ width: 38, height: 18 }}

                      />

                      <Text

                        style={{

                          fontWeight: 'bold',

                          fontSize: 18,

                          color: 'blue',

                        }}>

                        {' '}

                        SUZUKI

                      </Text>

                    </View>

                    <Text

                      style={{

                        fontWeight: 'bold',

                        fontSize: 13,

                        color: '#1b1464',

                        textAlign: 'center',

                      }}>

                      MARUTI SUZUKI INDIA LIMITED

                    </Text>

 

                    <View style={{ flexDirection: 'row', marginBottom: 6 }}>

                      <View style={{ height: 3, backgroundColor: 'red', flex: 1 }} />

                      <View style={{ height: 3, backgroundColor: '#1b1464', flex: 3 }} />

                    </View>

 

                    <Image

                      source={

                        AppUserData?.data?.profile_photo

                          ? { uri: AppUserData.data.profile_photo }

                          : require('../assets/Images/Avtar.png')

                      }

                      style={{

                        width: 90,

                        height: 90,

                        borderRadius: 4,

                        borderWidth: 1,

                        borderColor: '#000',

                        alignSelf: 'center',

                        marginBottom: 10,

                      }}

                    />

                    <Text

                      style={{

                        fontWeight: 'bold',

                        fontSize: 13,

                        textAlign: 'center',

                        marginBottom: 6,

                      }}>

                      {Nem || 'No-Data'}

                    </Text>

 

                    <View style={{ paddingHorizontal: 10 }}>

                      <View style={{ flexDirection: 'row', marginVertical: 2 }}>

                        <Text style={{ fontSize: 11, fontWeight: 'bold', width: 80 }}>

                          Staff No

                        </Text>

                        <Text style={{ fontSize: 11 }}>: {staffId || 'No-Data'}</Text>

                      </View>

 

                      <View style={{ flexDirection: 'row', marginVertical: 2 }}>

                        <Text style={{ fontSize: 11, fontWeight: 'bold', width: 80 }}>

                          Department

                        </Text>

                        <Text style={{ fontSize: 11 }}>: {Dept || 'No-Data'}</Text>

                      </View>

                      <View style={{ flexDirection: 'row', marginVertical: 2 }}>

                        <Text style={{ fontSize: 11, fontWeight: 'bold', width: 80 }}>

                          Location

                        </Text>

                        <Text style={{ fontSize: 11 }}>: {Loc || 'No-Data'}</Text>

                      </View>

                    </View>

                  </View>

                </View>

              </PagerView>

            </View>

          </View>

        </View>

      </Modal>

 

    </SafeAreaView>

  );

};

 

// ────────────────────────────────────────────────

// Styles (preserved exactly)

// ────────────────────────────────────────────────

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: GlobalColor.PrimaryLight,

  },

  box: {

    width: '100%', paddingVertical: 10, paddingHorizontal: 20,

    marginVertical: 5, borderBotttomWidth: 1, backgroundColor: '#fff',

    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderRadius: 5,

  },

  header: {

    fontSize: 14, color: GlobalColor.LightDark, paddingVertical: 5,

  },

  RevtinyLogo: {

    width: 130, height: 30, resizeMode: 'contain', marginTop: 7,

  },

  headerphn: {

    fontSize: 14, color: GlobalColor.LightDark, paddingVertical: 5, marginTop: 10,

  },

  editProfFont: {

    fontSize: 13,

  },

});

 

export default EditProfile;

 