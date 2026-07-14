//import liraries
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, SafeAreaView, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Payroll from './Payroll';
import Benifits from './Benifits';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Header } from '../../components/reusable/Header';
import { GlobalColor } from '../../constants/Colors';
import EmergencyContacts from '../EmergencyAndHospital/EmergencyContact';
import Hospital from '../EmergencyAndHospital/Hospital';
import NearByHospital from '../EmergencyAndHospital/NearByHospital';
import Text from '../../components/reusable/Text';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LocalAuthentication from 'rn-local-authentication';
import AuthorisedComp from '../../components/reusable/AuthorisedComp';
import Button from "../../components/reusable/Button";
import { GlobalFontSize } from '../../constants/FontSize';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const CompensationBenifits = ({ navigation }) => {
  const [isAuth, setIsAuth] = useState('');
  const [Loading, setLoading] = useState(true);
  const hasAuthenticated = useRef(false);

  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  // Handle authentication when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Only authenticate if user hasn't authenticated in this session
      if (!hasAuthenticated.current) {
        setIsAuth('');
        setLoading(true);
        handelBiometric();
      }
    }, [])
  );

  // Reset authentication flag when component unmounts (user leaves screen completely)
  useEffect(() => {
    return () => {
      hasAuthenticated.current = false;
    };
  }, []);

  const handelBiometric = () => {
    LocalAuthentication.authenticateAsync({
      reason: "Please, authenticate!",
      fallbackEnabled: true,
      fallbackTitle: "Unlock using passcode",
      fallbackToPinCodeAction: true
    }).then(response => {
      if (response.success) {
        setIsAuth(true);
        setLoading(false);
        hasAuthenticated.current = true; // Mark as authenticated
      }
      else if (response.error) {
        if (response.error == 'UserCancel') {
          setIsAuth(false);
          setLoading(true);
          hasAuthenticated.current = false;
        }
        else if (response.error == 'SystemCancel') {
          setIsAuth(false);
          setLoading(true);
          hasAuthenticated.current = false;
        }
        else {
          setIsAuth(true);
          setLoading(false);
          hasAuthenticated.current = true; // Mark as authenticated
        }
      }
      else {
        setIsAuth(false);
        setLoading(true);
        hasAuthenticated.current = false;
      }
    })

    return;
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        // Success code
        if (biometryType === 'FaceID') {
        } else {
          TouchID.authenticate('', optionalConfigObject)
            .then(success => {
              setIsAuth(true);
            })
            .catch(error => {
              // navigation.goBack();
            });
        }
      })
      .catch(error => {
        // navigation.goBack();
        // Failure code
      });
  };

  if (Loading) {
    return (
      <SafeAreaView style={{ flexGrow: 1 }}>
        <Header title="Compensation and Benefits" />
        <AuthorisedComp title="Authorise" subtitle="Please authorize your device to access compensation & benefits" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        {isAuth == true ? (
          <View style={{ flex: 1 }}>
            <Header title="Compensation and Benefits" />
            <LinearGradient colors={['#43C6DB', '#43C6DB', '#43C6DB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.mystyl}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Tab.Navigator
                  screenOptions={{
                    tabBarLabelStyle: { fontSize: GlobalFontSize.TabTitle, fontWeight: '700' },
                    tabBarActiveTintColor: GlobalColor.White,
                    tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: GlobalColor.White },
                    tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
                    tabBarItemStyle: { paddingHorizontal: 0 }
                  }}>
                  <Tab.Screen name="Payroll" component={Payroll} />
                  <Tab.Screen name="Benefits" component={Benifits} />
                </Tab.Navigator>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <Header title="Compensation and Benefits" />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <View style={styles.innerContainer}>
                <Image
                  style={styles.tinyLogo}
                  source={require('./../../assets/Images/accessfailed.png')}
                />
                <Text style={styles.title} Bold>Unauthorised</Text>
              </View>

              <Button
                onPress={() => {
                  navigation.goBack()
                }}
                title="GO BACK" btnStyle={{ width: "50%", alignSelf: 'center', marginTop: 20, borderRadius: 0 }} />
            </View>
          </View>
        )
        }

      </View>
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
  mystyl: {
    backgroundColor: 'transparent',
    height: '100%',
    flexDirection: 'row',
  },
  searchSection: {
    top: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 7,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    width: '77%',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: GlobalColor.White,
    color: '#424242',
  },
  title: {
    fontSize: GlobalFontSize.H4,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10
  },
  subtitle: {
    textAlign: 'center',
  },
  innerContainer: {
    maxWidth: 250
  },
  tinyLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
});
export default CompensationBenifits;