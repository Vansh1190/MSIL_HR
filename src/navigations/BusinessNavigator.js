// In App.js in a new project
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShuttleBooking from '../screens/Buisness/ShuttleBooking';
import BuisnessTravel from '../screens/Buisness/BuisnessTravel';
import Gst from '../screens/Buisness/GST';
import SeatBook from '../screens/Buisness/SeatBook';
import Guidelines from '../screens/Buisness/Guidelines';
import Feedback from '../screens/Buisness/Feedback';
import TaxiBooking from '../screens/Buisness/TaxiBooking';
import MyRequest from '../screens/Buisness/MyRequest';
import MergeTripReq from '../screens/Buisness/MergeTripReq';
import BusinessTravelMain from '../screens/Buisness/BusinessTravelMain';
import InitTaxiReq from '../screens/Buisness/InitTaxiReq';
import BusinessTravelHome from '../screens/Buisness/BusinessTravelHome';
import TaxiReportHome from '../screens/Buisness/TaxiReportHome';

const Stack = createNativeStackNavigator();

function BusinessNavigator() {
  return (
      <Stack.Navigator initialRouteName='BuisnessTravel' screenOptions={{headerShown:false}}>
        <Stack.Screen name="BuisnessTravel" component={BuisnessTravel} />
        <Stack.Screen name="Gst" component={Gst} />
        <Stack.Screen name="ShuttleBooking" component={ShuttleBooking} />
        <Stack.Screen name="SeatBook" component={SeatBook} />
        <Stack.Screen name="Guidelines" component={Guidelines} />
        <Stack.Screen name='Feedback' component={Feedback} options={{unmountOnBlur:true}}/> 
        <Stack.Screen name="TaxiBooking" component={TaxiBooking} />
        <Stack.Screen name="MyRequest" component={MyRequest} />
        <Stack.Screen name="MergeTripReq" component={MergeTripReq} />
        <Stack.Screen name="BusinessTravelMain" component={BusinessTravelMain} />
        <Stack.Screen name="BusinessTravelHome" component={BusinessTravelHome} /> 
        <Stack.Screen name="InitTaxiReq" component={InitTaxiReq} />
        <Stack.Screen name="TaxiReportHome" component={TaxiReportHome} />

          

        
      </Stack.Navigator>
  );
}

export default BusinessNavigator;