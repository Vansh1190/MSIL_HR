// In App.js in a new project
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Othermobility from '../screens/OtherMobility/Othermobility';
import UniformMgmt from '../screens/OtherMobility/UniformMgmt';
import HospitalizationSystem from '../screens/OtherMobility/HospitalizationSystem';
import Intimation from '../screens/OtherMobility/Intimation';
import Advance from '../screens/OtherMobility/Advance';

const Stack = createNativeStackNavigator();

function OtherMobilityNavigator() {
  return (
      <Stack.Navigator initialRouteName='Othermobility' screenOptions={{headerShown:false}}>

        <Stack.Screen name="Othermobility" component={Othermobility} />
        <Stack.Screen name="UniformMgmt" component={UniformMgmt} />
        <Stack.Screen name="HospitalizationSystem" component={HospitalizationSystem} />
        <Stack.Screen name="Intimation" component={Intimation} />
        <Stack.Screen name="Advance" component={Advance} />

      </Stack.Navigator>
  );
}

export default OtherMobilityNavigator;