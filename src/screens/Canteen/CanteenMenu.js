import React, { useState, useEffect, useContext } from 'react';

import {

  View,

  StyleSheet,

} from 'react-native';

import * as ApiService from '../../Utils/Utils';

import AuthContext from '../../context/AuthContext';

import Spinner from 'react-native-loading-spinner-overlay/lib';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

 

import { GlobalFontSize } from '../../constants/FontSize';

import { GlobalColor } from '../../constants/Colors';

import { Header } from '../../components/reusable/Header';

import { Location } from './Locations/Location';

import LinearGradient from 'react-native-linear-gradient';

 

const Tab = createMaterialTopTabNavigator();

 

const CanteenMenu = ({ navigation }) => {

  const { authContext, AppUserData } = useContext(AuthContext);

 

  const vertcode = AppUserData?.data?.emplvertcode?.trim()?.toUpperCase();

  const isDE = vertcode === 'DE';

  const userId = AppUserData?.data?.userId?.toString() || '';

 

  const [showDETab, setShowDETab] = useState(false);

  const [lovmLoading, setLovmLoading] = useState(true);

 

  useEffect(() => {

    const token = AppUserData.token;

 

    const lovmData = {

      SystemName: 'HR-ASSIST',

      ReportName: 'DE_CANTEEN',

      LOVName: 'CUTOFF_FLAG',

      LOVCode: 'CUTOFF_FLAG',

      UserName: userId,

    };

 

    ApiService.PostMethode('/GetLOVM', lovmData, token, authContext)

      .then(lovmResult => {

        const lovmValueDesc =

          lovmResult?.Value?.[0]?.LOVM_VALUE_DESC?.toString().trim().toUpperCase() || '';

        setShowDETab(lovmValueDesc === 'Y' && isDE);

     })

      .catch(() => {

        setShowDETab(false);

      })

      .finally(() => {

        setLovmLoading(false);

      });

  }, []);

 

  if (lovmLoading) {

    return (

      <View style={{ flex: 1 }}>

        <Header title="Canteen Menu" />

        <Spinner visible={true} />

      </View>

    );

  }

 

  return (

    <View style={{ flex: 1, width: '100%', height: '100%' }}>

      <Header title="Canteen Menu" />

      <LinearGradient

        colors={['#43C6DB', '#43C6DB', '#43C6DB']}

        start={{ x: 0, y: 0 }}

        end={{ x: 1, y: 0 }}

        style={styles.mystyl}

      >

        <View style={{ flex: 1, flexDirection: 'row' }}>

          <Tab.Navigator

            swipeEnabled={false}

            screenOptions={{

              tabBarScrollEnabled: true,

              tabBarItemStyle: { paddingHorizontal: 15, width: 'auto' },

              tabBarLabelStyle: { fontSize: GlobalFontSize.TabTitle, fontWeight: '700' },

              tabBarActiveTintColor: GlobalColor.White,

              tabBarIndicatorStyle: {

                borderBottomWidth: 5,

                borderBottomColor: GlobalColor.White,

              },

              tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },

            }}

          >

            <Tab.Screen

              name="Gurgaon"

              component={Location}

              initialParams={{ MenuLocation: '002', MenuType: 'Canteen' }}

            />

            <Tab.Screen

              name="Manesar"

              component={Location}

              initialParams={{ MenuLocation: '010', MenuType: 'Canteen' }}

            />

            <Tab.Screen

              name="MPT"

              component={Location}

              initialParams={{ MenuLocation: '011', MenuType: 'Canteen' }}

            />

            <Tab.Screen

              name="Rohtak"

              component={Location}

              initialParams={{ MenuLocation: '041', MenuType: 'Canteen' }}

            />

            <Tab.Screen

              name="Kharkhoda"

              component={Location}

              initialParams={{ MenuLocation: '080', MenuType: 'Canteen' }}

            />

            {showDETab && (

              <Tab.Screen

                name="DE"

                component={Location}

                initialParams={{ MenuLocation: '002', MenuType: 'DE' }}

              />

            )}

          </Tab.Navigator>

        </View>

      </LinearGradient>

    </View>

  );

};

 

const styles = StyleSheet.create({

  mystyl: {

    backgroundColor: 'transparent',

    height: '100%',

    flexDirection: 'row',

  },

});

 

export default CanteenMenu;

 

