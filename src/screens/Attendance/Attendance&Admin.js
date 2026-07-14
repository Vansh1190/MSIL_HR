//import liraries
import React, {useState, useEffect,useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Alert,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Attendance from './Attendence';
import Leave from './Leave';
import Shift from './Shift';
import HolidayCalendar from './HolidayCalendar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import {Header} from './../../components/reusable/Header';
import Text from '../../components/reusable/Text';
import AuthContext from '../../context/AuthContext';

const Tab = createMaterialTopTabNavigator();


const AttendanceAdmin = ({navigation}) => {
  const [route, setroute] = useState("Attendance");
  const [horizental, setHorizental] = useState(false);

  const {authContext, AppUserData} = useContext(AuthContext);
  let usrAccess = AppUserData?.data?.userFlag;

// $&

  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => {
      setHorizental(false);
      setroute(route.name);
// $&
    },
  });



  return (
    <SafeAreaView style={{flex: 1, width: '100%', position:'relative'}}>
      <LinearGradient
       colors={['#43C6DB','#43C6DB','#43C6DB']}
       start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.container}>
            <View style={{ flex:1,flexDirection:'row' }}>            
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 40,
                        alignItems: 'center',
                    }}>
                        <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: 40,
                                alignItems: 'center',
                            }}>
                            <Ionicons
                                name="chevron-back-outline"
                                size={25}
                                color={'white'}
                                onPress={() => navigation.goBack()}
                            />
                            <Ionicons
                                name="menu-outline"
                                size={20}
                                color={'white'}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                </View>

                <Text
                Bold
                style={{
                    color: '#fff',
                    fontSize: GlobalFontSize.H4,
                    marginLeft: 15,
                }}>
                Attendance & Admin
                </Text>
            </View>     

            {/* {
              route != "Holiday Calendar" ? (
                <TouchableOpacity
                style={styles.addtnlBtn}
                onPress={() => {             
                  horizental == true ? setHorizental(false) : setHorizental(true);
                }}>
                <Ionicons
                  name="ellipsis-vertical-circle"
                  size={30}
                  color={'#fff'}
                />
              </TouchableOpacity>
              ):null
            } */}
        </LinearGradient>
          
          {/* {horizental == true && route != "Holiday Calendar" ? (
            <View
              style={{
                padding: 10,
                paddingVertical:10,
                backgroundColor: GlobalColor.White,
                position: 'absolute',
                // bottom:30,
                right: 40,
                top:50,
                zIndex:1000,
              }}>
              {
                route == "Leave" ? (
                  <View style={{ flex:1}}>
                    <TouchableOpacity
                    style={{ borderBottomWidth: 1, paddingBottom: 5 }} onPress={() => {
                      setHorizental(false)
                      navigation.navigate('LeaveBalance')
                    }}>

                    <Text Bold>Leave Balance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingVertical: 5 }} onPress={() => {
                      setHorizental(false)
                      navigation.navigate('SalaryDeduct')
                    }}>

                    <Text Bold>Salary Deduction</Text>
                  </TouchableOpacity>
                  </View>
                ):null
              }

              {
                route == "Shift" ? (
                  <View style={{ width:"100%" }}>
                    <TouchableOpacity
                    style={{paddingVertical:0}} onPress={() => {
                      setHorizental(false)
                      navigation.navigate("CompayShiftDe")
                    }}>                      
                      <Text Bold>Company Shift Details</Text>
                    </TouchableOpacity>
                  </View>
                ):null
              }

              {
                route == " " || route == "Attendance" ? (
                  <View style={{ width:"100%" }}>
                      <TouchableOpacity onPress={() => {
                        setHorizental(false)
                        navigation.navigate('AttendancePer')
                      }}>                  
                        <Text Bold>Attendance Percentage</Text>
                      </TouchableOpacity>
                  </View>
                ):null
              }
            </View>
          ) : null} */}
        <LinearGradient colors={['#43C6DB','#43C6DB','#43C6DB']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mystyl}>
          <View style={{flex:1,flexDirection:'row'}}>
      <Tab.Navigator 
       swipeEnabled={false}
       screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight:'700'},
        tabBarActiveTintColor: '#fff',
        tabBarItemStyle: { paddingHorizontal:15, width:'auto' },
        tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: '#fff'},
        tabBarStyle: { backgroundColor: 'trasparent', elevation: 0 },
      }}>
        <Tab.Screen name="Attendance" component={Attendance} listeners={tabBarListeners} />
        <Tab.Screen name="Leave" component={Leave} listeners={tabBarListeners}/>
        <Tab.Screen name="Shift" component={Shift} listeners={tabBarListeners}/>
        <Tab.Screen name="Holiday Calendar" component={HolidayCalendar} listeners={tabBarListeners}/>
      </Tab.Navigator>
      </View>
        </LinearGradient>

        {/* {usrAccess != 'Y' ? ( 

      <TouchableOpacity style={styles.fullWidthButton}
        onPress={() => {
          navigation.navigate('ManagerMode');
        }}>
      <Image  source={require("./../../assets/Images/setting.png")} style={{width:25,height:25,tintColor:'#fff'}}/>
        <Text style={styles.fullWidthButtonText}>
          Go to Manager Mode
        </Text>
      </TouchableOpacity>

):null} */}

    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    padding: 10,
  },
  fullWidthButton:{
    backgroundColor:'#43C6DB', 
    paddingVertical:10,
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center'
  },
  fullWidthButtonText:{
    color:GlobalColor.White, 
    marginLeft:8,
    fontSize:13
  },
  addtnlBtn:{
    // position:'absolute',
    // right:10,
    // top:5,
    zIndex:55555555
  },
  mystyl: {
        backgroundColor: 'transparent',
        height:'83%',
        flexDirection: 'row',
      },
});

export default AttendanceAdmin;
