import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GlobalColor } from '../../../constants/Colors';
import { GlobalFontSize } from '../../../constants/FontSize';
import Text from '../../../components/reusable/Text';
import AuthContext from '../../../context/AuthContext';
import HospitalApprovalScreens from './HospitalApprovalScreens';
import HospitalReportScreens from './HospitalReportScreens';

const Tab = createMaterialTopTabNavigator();

const HospitalApproval = ({ navigation }) => {
  const [route, setroute] = useState('Approval');
  const { authContext, AppUserData } = useContext(AuthContext);

  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => {
      setroute(route.name);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', position: 'relative' }}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6347', '#FF6347', '#FF6347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{
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
          <Text Bold style={{
            color: '#fff',
            fontSize: GlobalFontSize.H4,
            marginLeft: 15,
          }}>
            Hospital Approval
          </Text>
        </View>
      </LinearGradient>

      {/* Main Tab Navigator */}
      <LinearGradient
        colors={['#FF6347', '#FF6347', '#FF6347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.mystyl}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Tab.Navigator
            swipeEnabled={false}
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarLabelStyle: { fontSize: 13, fontWeight: '700' },
              tabBarActiveTintColor: '#fff',
              tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
              tabBarItemStyle: { paddingHorizontal: 15, width: 'auto' },
              tabBarIndicatorStyle: { borderBottomWidth: 5, borderBottomColor: '#fff' },
              tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
            }}>
            <Tab.Screen
              name="Approval"
              component={HospitalApprovalScreens}
              listeners={tabBarListeners}
            />
            <Tab.Screen
              name="Report"
              component={HospitalReportScreens}
              listeners={tabBarListeners}
            />
          </Tab.Navigator>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    padding: 10,
  },
  mystyl: {
    backgroundColor: 'transparent',
    height: '83%',
    flexDirection: 'row',
  },
});

export default HospitalApproval;
