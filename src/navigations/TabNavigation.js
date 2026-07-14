import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalColor } from '../constants/Colors';
import { GlobalFontSize } from '../constants/FontSize';
import ManagerFlexiShift from '../screens/Attendance/managermode/ManagerFlexiShift';
import ManagerLeave from '../screens/Attendance/managermode/ManagerLeave';
import ManagerTaxi from '../screens/Attendance/managermode/ManagerTaxi';
import ManagerAttandance from '../screens/Attendance/managermode/ManagerAttandance';
import ManagerRHTKGatePass from '../screens/Attendance/managermode/ManagerRHTKGatePass';
import Home from '../screens/Home';
import HomeM from '../screens/HomeM';
import AttendanceAdminNav from './AttendanceAdminNav';
import GatePassNavigator from './GatePassNavigator';
import AuthContext from '../context/AuthContext';
import HospitalNavs from './HospitalNavigator';
import EmployeeNavs from './EmployeeNavs';
import CompensationBenifitsNav from './CompensationBenifitsNav';
import CanteeNavigator from './CanteeNavigator';
import BusinessNavigator from './BusinessNavigator';
import OtherApps from '../screens/OtherApps';
import FoodCount from '../screens/Canteen/FoodCount';
import { useNavigation } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import ManagerAttandancePercentage from '../screens/Attendance/managermode/ManagerAttandancePercentage';
import ManagerTaxiApproval from '../screens/Attendance/managermode/ManagerTaxiApproval';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { useCallback } from 'react';
import * as ApiService from '../Utils/Utils';
import ExtraHoursApproval from '../screens/Attendance/managermode/ExtraHoursApproval';
import OtherMobilityNavigator from './OtherMobilityNavigator';
import AIChat from '../screens/AIChat';
import HospitalApproval from '../screens/Attendance/managermode/HospitalApproval';


const { width, height } = Dimensions.get('window');


const Tab = createBottomTabNavigator();

const TOOLTIP_SHOWN_KEY = '@ai_tooltip_shown';


function Tabs() {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);


  const lastEmployeeRoute = useRef(null);
  const lastManagerRoute = useRef(null);


  const { AppUserData } = useContext(AuthContext);


  const [isManagerMode, setIsManagerMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAIButton, setShowAIButton] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);


  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const tooltipAnim = useRef(new Animated.Value(0)).current;
  const arrowBounceAnim = useRef(new Animated.Value(0)).current;


  const initialLoading = async () => {
    await checkAIAccess();
  };


  useFocusEffect(
    useCallback(() => {
      let isActive = true;


      const loadData = async () => {
        if (isActive) {
          await initialLoading();
        }
      };


      loadData();


      return () => {
        isActive = false;
      };
    }, [])
  );


  useEffect(() => {
    const checkTooltipStatus = async () => {
      if (showAIButton && !isChatOpen) {
        try {
          const tooltipShown = await AsyncStorage.getItem(TOOLTIP_SHOWN_KEY);
         
          if (!tooltipShown) {
            // Tooltip has never been shown, show it now
            setTimeout(() => {
              setShowTooltip(true);
              Animated.spring(tooltipAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              }).start();


              Animated.loop(
                Animated.sequence([
                  Animated.timing(arrowBounceAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                  }),
                  Animated.timing(arrowBounceAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                  }),
                ])
              ).start();
            }, 1000);
          }
        } catch (error) {
          console.log('Error checking tooltip status:', error);
        }
      }
    };

    checkTooltipStatus();
  }, [showAIButton, isChatOpen]);


  const checkAIAccess = async () => {
    let userId = AppUserData?.data?.userId;
    let token = AppUserData?.token;


    let apiData = {
      EmplID: userId,
      ConsentID: "777",
    };


    try {
      setIsCheckingAccess(true);
      const result = await ApiService.PostMethode(
        '/CheckAIAccess',
        apiData,
        token,
        AuthContext
      );
     
      const hasAccess = !result?.Value || result?.Value === "";
      setShowAIButton(hasAccess);
      setIsCheckingAccess(false);
    } catch (error) {
      setIsCheckingAccess(false);
      setShowAIButton(false);
      ApiService.showErrorMessage(error, AuthContext);
    }
  };


  const flipToggle = () => {
    const currentRoute = navigationState.routes[navigationState.index];


    if (isManagerMode) {
      lastManagerRoute.current = currentRoute;
    } else {
      lastEmployeeRoute.current = currentRoute;
    }


    const nextValue = !isManagerMode;
    setIsManagerMode(nextValue);


    Animated.timing(rotateAnim, {
      toValue: nextValue ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();


    setTimeout(() => {
      const targetRoute = nextValue ? lastManagerRoute.current : lastEmployeeRoute.current;


      if (targetRoute) {
        navigation.reset({
          index: 0,
          routes: [{ name: targetRoute.name, params: targetRoute.params }],
        });
      } else {
        navigation.navigate('Home');
      }
    }, 500);
  };


  const handleChatPress = async () => {
    setShowTooltip(false);
   
    // Mark tooltip as shown when user opens the chat
    try {
      await AsyncStorage.setItem(TOOLTIP_SHOWN_KEY, 'true');
    } catch (error) {
      console.log('Error saving tooltip status:', error);
    }
   
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();


    setIsChatOpen(true);
  };


  const handleCloseChat = () => {
    setIsChatOpen(false);
  };


  const handleDismissTooltip = async () => {
    // Mark tooltip as shown when user dismisses it
    try {
      await AsyncStorage.setItem(TOOLTIP_SHOWN_KEY, 'true');
    } catch (error) {
      console.log('Error saving tooltip status:', error);
    }
   
    Animated.timing(tooltipAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowTooltip(false);
    });
  };


  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });


  const arrowTranslateY = arrowBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });


  let usrAccess = AppUserData?.data?.userFlag;


  const ToggleButton = () => (
    <View style={styles.managerButtonWrapper}>
      <Animated.View style={{ transform: [{ rotateY }] }}>
        <TouchableOpacity
          style={[
            styles.managerButton,
            { backgroundColor: isManagerMode ? '#FF6347' : '#43C6DB' },
          ]}
          onPress={flipToggle}
          activeOpacity={0.9}
        >
          <MaterialCommunityIcons
            name={isManagerMode ? 'account-tie' : 'account'}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.managerText}>
        {isManagerMode ? 'Employee' : 'Manager'}
      </Text>
    </View>
  );


  const AIWorldTabButton = ({ color, size }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={styles.aiTabButton}>
        <Image
          source={require('../assets/Images/chatbot_header.gif')}
          style={styles.aiTabGif}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );


  const AITooltip = () => {
    if (!showTooltip || !showAIButton) return null;


    return (
      <Animated.View
        style={[
          styles.tooltipContainer,
          {
            opacity: tooltipAnim,
            transform: [
              {
                translateY: tooltipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: tooltipAnim,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={1} onPress={handleDismissTooltip}>
          <View style={styles.tooltipBubble}>
            <LinearGradient
              colors={['#E0F7FF', '#B3E5FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tooltipGradient}
            >
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
             
              <Text style={styles.tooltipTitle}>New AI Era! 🚀</Text>
              <View style={styles.tooltipDivider} />
              <Text style={styles.tooltipSubtitle}>AI Chatbot</Text>
              <View style={styles.tooltipDivider} />
              <Text style={styles.tooltipDescription}>
                Tap here to enter the AI world.{'\n'}
                Get instant help, answers, and{'\n'}
                smart assistance powered by AI! ✨
              </Text>
            </LinearGradient>
          </View>


          {/* Arrow pointing to button */}
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                transform: [{ translateY: arrowTranslateY }],
              },
            ]}
          >
            <View style={styles.arrowBorder}>
              <MaterialCommunityIcons
                name="arrow-down"
                size={40}
                color="#29B6F6"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };


  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isManagerMode ? '#FF6347' : '#43C6DB',
          tabBarLabelStyle: {
            fontSize: GlobalFontSize.Error,
            color: GlobalColor.Primary,
          },
          tabBarInactiveTintColor: GlobalColor.Primary,
          tabBarStyle: {
            height: 70,
            backgroundColor: 'transparent',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingBottom: 10,
            position: 'absolute',
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={['#fff', '#fff']}
              style={{
                height: 80,
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
              }}
            />
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={isManagerMode ? HomeM : Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          }}
        />


        <Tab.Screen
          name="ToggleMode"
          component={() => null}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => null,
            tabBarButton: () => <ToggleButton />,
          }}
        />


        {!isCheckingAccess && (
          showAIButton ? (
            <Tab.Screen
              name="AI Chatbot"
              component={() => null}
              options={{
                tabBarLabel: 'AI Chatbot',
                tabBarIcon: AIWorldTabButton,
              }}
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();
                  handleChatPress();
                },
              }}
            />
          ) : (
            <Tab.Screen
              name="Quick Dials"
              component={HospitalNavs}
              options={{
                unmountOnBlur: true,
                tabBarLabel: 'Quick Dials',
                tabBarIcon: ({ color, size }) => (
                  <Material name="perm-contact-cal" color={color} size={size} />
                ),
              }}
            />
          )
        )}


        {/* Hidden Screens */}
        <Tab.Screen name="ManagerLeave" component={ManagerLeave} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerFlexiShift" component={ManagerFlexiShift} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerTaxi" component={ManagerTaxi} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerAttandance" component={ManagerAttandance} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerAttandancePercentage" component={ManagerAttandancePercentage} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerRHTKGatePass" component={ManagerRHTKGatePass} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="EmployeeNavs" component={EmployeeNavs} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="CompensationBenifitsNav" component={CompensationBenifitsNav} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="HospitalNavs" component={HospitalNavs} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="CanteeNavigator" component={CanteeNavigator} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="FoodCount" component={FoodCount} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="AttendanceAdminNav" component={AttendanceAdminNav} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="OtherApps" component={OtherApps} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="BusinessNavigator" component={BusinessNavigator} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ExtraHoursApproval" component={ExtraHoursApproval} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="GatePassNavigator" component={GatePassNavigator} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="ManagerTaxiApproval" component={ManagerTaxiApproval} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="OtherMobilityNavigator" component={OtherMobilityNavigator} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="HospitalApproval" component={HospitalApproval} options={{ tabBarButton: () => null }} />

      </Tab.Navigator>


      {showAIButton && <AITooltip />}
      <AIChat visible={isChatOpen} onClose={handleCloseChat} />
    </>
  );
}


const styles = StyleSheet.create({
  managerButtonWrapper: {
    position: 'absolute',
    bottom: height * 0.01,
    width: width * 0.22,
    height: width * 0.22,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    left: width * 0.5 - (width * 0.22) / 2,
  },
  managerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  managerText: {
    fontSize: 10,
    color: '#000',
    marginTop: 5,
    fontWeight: '800',
    textAlign: 'center',
  },
  aiTabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  aiTabGif: {
    width: 30,
    height: 30,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    right: width * 0.025,
    zIndex: 9999,
    alignItems: 'flex-end',
  },
  tooltipBubble: {
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#29B6F6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  tooltipGradient: {
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 25,
    width: width * 0.75,
    borderWidth: 2,
    borderColor: '#29B6F6',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 15,
    backgroundColor: '#FF4757',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#FF4757',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  tooltipTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0277BD',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(2, 119, 189, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontStyle: 'italic',
  },
  tooltipDivider: {
    height: 2,
    backgroundColor: 'rgba(2, 119, 189, 0.2)',
    marginVertical: 10,
    borderRadius: 1,
  },
  tooltipSubtitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0288D1',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tooltipDescription: {
    fontSize: 14,
    color: '#01579B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  arrowContainer: {
    alignItems: 'flex-end',
    marginTop: 25,
    marginRight: width * 0.16,
  },
  arrowBorder: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 3,
    elevation: 8,
    shadowColor: '#29B6F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#29B6F6',
  },
});


export default Tabs;
