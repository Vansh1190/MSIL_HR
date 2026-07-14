import React, {useContext, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LinearGradient from 'react-native-linear-gradient';
import { GlobalColor } from '../constants/Colors';
import { GlobalFontSize } from '../constants/FontSize';

import Home from '../screens/Home';
import AttendanceAdminNav from './AttendanceAdminNav';
import GatePassNavigator from './GatePassNavigator';
import OtherApps from '../screens/OtherApps';
import CompensationBenifits from '../screens/CompensationAndBenifits/CompensationBenifits';
import Canteen from '../screens/Canteen/Canteen';

import EmployeeDirect from '../screens/employeLookUp/EmployeeDirect';
import EmployeeNavs from './EmployeeNavs';
import BuisnessTravel from '../screens/Buisness/BuisnessTravel';
import HospitalNavs from './HospitalNavigator';
import BusinessNavigator from './BusinessNavigator';
import CanteeNavigator from './CanteeNavigator';
import CompensationBenifitsNav from './CompensationBenifitsNav';
import AuthContext from '../context/AuthContext';
import HomeM from '../screens/HomeM';


const Tab = createBottomTabNavigator();
function TabsM() {

const {authContext, AppUserData} = useContext(AuthContext);
let usrAccess = AppUserData?.data?.userFlag;

// // console.log($1);
  return (    
    <Tab.Navigator
      initialRouteName="HomeM"
      screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#43C6DB',
      tabBarLabelStyle:{ fontSize:GlobalFontSize.Error, color:GlobalColor.Primary},   
      tabBarInactiveTintColor:GlobalColor.Primary,   
      tabBarStyle:{height:70,backgroundColor:'transparent',borderTopLeftRadius:15,borderTopRightRadius:15,paddingBottom:10,} ,
      tabBarBackground:() =>(
        <LinearGradient    
        colors={['#fff', '#fff']} style={{
          height:80,
          borderTopLeftRadius:22,
          borderTopRightRadius:22
        }}/>
      )
    }}>
         <Tab.Screen name="Home" component={Home}
       options={{
        unmountOnBlur:true,
        tabBarLabel: 'Main Menu',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar-edit" color={color} size={size} />
        ),
        // tabBarStyle: { display: "none" },
      }} 
    />
      <Tab.Screen name="HomeM" component={HomeM} 
        options={{
          unmountOnBlur:true,
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}/>
     
    <Tab.Screen name="OtherApps" component={OtherApps} 
        options={{
        tabBarLabel: 'Attendance',
        tabBarIcon: ({ color, size }) => (
          <Material name="apps" color={color} size={size} />
        ),
      }}/>
    {usrAccess == 'Y'?null:
      <Tab.Screen name="Quick Dials" component={HospitalNavs}
       options={{
        unmountOnBlur:true,
        tabBarLabel: 'Quick Dials',
        tabBarIcon: ({ color, size }) => (
          <Material name="perm-contact-cal" color={color} size={size} />
        ),
      }}
       />
    }
      

      <Tab.Screen name="Canteen" component={CanteeNavigator} 
        options={{
        tabBarLabel: 'Canteen',
        tabBarVisible: false,
        tabBarButton: (props) => null,
        tabBarIcon: ({ color, size }) => (
          <Material name="apps" color={color} size={size} />
        ),
      }}/>

      <Tab.Screen name="EmployeeNavs" component={EmployeeNavs}
       options={{
        unmountOnBlur:true,
        tabBarLabel: 'EmployeLookUp',
         tabBarVisible: false,
        tabBarButton: (props) => null,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar-edit" color={color} size={size} />
        ),
        // tabBarStyle: { display: "none" },
      }} 
    />


    <Tab.Screen name="BuisnessTravel" component={BusinessNavigator} 
        options={{
        tabBarLabel: 'BuisnessTravel',
        
        tabBarVisible: false,
        tabBarButton: (props) => null,
        tabBarIcon: ({ color, size }) => (
          <Material name="apps" color={color} size={size} />
        ),
      }}/>

    <Tab.Screen name="HospitalNavs" component={HospitalNavs} 
        options={{
        tabBarLabel: 'EmergencyContacts',
         unmountOnBlur:true,
        tabBarVisible: false,
        tabBarButton: (props) => null,
        tabBarIcon: ({ color, size }) => (
          <Material name="apps" color={color} size={size} />
        ),
      }}/>
  <Tab.Screen name="CompensationBenifitsNav" component={CompensationBenifitsNav} 
        options={{
        tabBarLabel: 'Payroll',
         unmountOnBlur:true,
        tabBarVisible: false,
        tabBarButton: (props) => null,
        tabBarIcon: ({ color, size }) => (
          <Material name="apps" color={color} size={size} />
        ),
      }}/>

      
    </Tab.Navigator>
  );
}
export default TabsM;