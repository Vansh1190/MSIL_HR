//import libraries
import React, {useState, useEffect, useContext} from 'react';
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
import Intimation from '../OtherMobility/Intimation';
import Advance from './Advance';
import Report from './Report';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { GlobalColor } from '../../constants/Colors';
import { GlobalFontSize } from '../../constants/FontSize';
import {Header} from './../../components/reusable/Header';
import Text from '../../components/reusable/Text';
import AuthContext from '../../context/AuthContext';

const Tab = createMaterialTopTabNavigator();

const HospitalizationSystem = ({navigation}) => {
  const [route, setroute] = useState("Intimation");
  const [horizental, setHorizental] = useState(false);

  const {authContext, AppUserData} = useContext(AuthContext);
  let usrAccess = AppUserData?.data?.userFlag;

  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => {
      setHorizental(false);
      setroute(route.name);
    },
  });

  return (
    <SafeAreaView style={{flex: 1, width: '100%', position:'relative'}}>
      <LinearGradient
       colors={['#43C6DB','#43C6DB','#43C6DB']}
       start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.container}>
            <View style={{ flex:1, flexDirection:'row' }}>            
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
                Hospitalization System
                </Text>
            </View>     
        </LinearGradient>
          
        <LinearGradient colors={['#43C6DB','#43C6DB','#43C6DB']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.mystyl}>
          <View style={{flex:1, flexDirection:'row'}}>
            <Tab.Navigator 
              swipeEnabled={false}
              screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 13, fontWeight:'700'},
                tabBarActiveTintColor: '#fff',
                tabBarItemStyle: { paddingHorizontal:15, width:'auto' },
                tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: '#fff'},
                tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
              }}>
              <Tab.Screen name="Intimation" component={Intimation} listeners={tabBarListeners} />
              <Tab.Screen name="Advance" component={Advance} listeners={tabBarListeners}/>
              <Tab.Screen name="Report" component={Report} listeners={tabBarListeners}/>
            </Tab.Navigator>
          </View>
        </LinearGradient>

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
    zIndex:55555555
  },
  mystyl: {
    backgroundColor: 'transparent',
    height:'83%',
    flexDirection: 'row',
  },
});

export default HospitalizationSystem;