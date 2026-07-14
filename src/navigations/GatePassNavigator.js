// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VisitorDetails from '../screens/Gatspass/VisitoDetails';
import Gatepass from '../screens/Gatspass/Gatepass';
import HomeGate from '../screens/Gatspass/GatePassHome';
import EmpGatepassRohtak from '../screens/Gatspass/EmployeeGatePass';
import VstrGatepassRohtak from '../screens/Gatspass/RohtakGatePass';
import CreateRequestRhtk from '../screens/Gatspass/CreateRequestRhtk';
import ViewRequestRhtk from '../screens/Gatspass/ViewRequestRhtk';

import RohtakVisitorHome from '../screens/Gatspass/RohtakVisitorHome';
import RohtakGatePass from '../screens/Gatspass/RohtakGatePass';
import VisitorDetailRohtak from '../screens/Gatspass/VisitorDetailRohtak';
import VisitorRohtakReport from '../screens/Gatspass/VisitorRohtakReport';
import ViewRequestVSDT from '../screens/Gatspass/ViewRequestVSDT';
import BookRoom from '../screens/Gatspass/BookRoom';
import ViewRoom from '../screens/Gatspass/ViewRoom';
import BookRoomModify from '../screens/Gatspass/BookRoomModify';
import ManageBooking from '../screens/Gatspass/ManageBooking';
import ManagerMode from '../screens/Attendance/ManagerMode';

import ManagerTaxiApproval from '../screens/Attendance/managermode/ManagerTaxiApproval';
import ManagerAttandancePercentage from '../screens/Attendance/managermode/ManagerAttandancePercentage';
import ManagerRHTKGatePass from '../screens/Attendance/managermode/ManagerRHTKGatePass';
import LeaveViewReport from '../screens/Attendance/LeaveViewReport';
import RoomBookingHome from '../screens/Gatspass/RoomBookingHome';
import HomePageGatepass from '../screens/Gatspass/HomePageGatepass';


const Stack = createNativeStackNavigator();

function GatePassNavigator() {
  return (
      <Stack.Navigator initialRouteName='HomeGate' screenOptions={{headerShown:false}}>
        <Stack.Screen name='HomeGate' component={HomeGate}/>
        <Stack.Screen name='Gatepass' component={Gatepass}/>
        <Stack.Screen name="VisitorDetails" component={VisitorDetails} />
        <Stack.Screen name="EmpGatepassRohtak" component={EmpGatepassRohtak} />
        <Stack.Screen name="VstrGatepassRohtak" component={VstrGatepassRohtak} />
        <Stack.Screen name="CreateRequestRhtk" component={CreateRequestRhtk} />
        <Stack.Screen name="ViewRequestRhtk" component={ViewRequestRhtk} />

        <Stack.Screen name="RohtakVisitorHome" component={RohtakVisitorHome} />
        <Stack.Screen name="RohtakGatePass" component={RohtakGatePass} />
        <Stack.Screen name="VisitorDetailRohtak" component={VisitorDetailRohtak} />
        <Stack.Screen name="VisitorRohtakReport" component={VisitorRohtakReport} />
        <Stack.Screen name="ViewRequestVSDT" component={ViewRequestVSDT}/>
        <Stack.Screen name='ManagerMode' component={ManagerMode} />
        <Stack.Screen name='ManagerTaxiApproval' component={ManagerTaxiApproval}/>
      <Stack.Screen name='ManagerAttandancePercentage' component={ManagerAttandancePercentage}/>
      <Stack.Screen name='ManagerRHTKGatePass' component={ManagerRHTKGatePass}/> 
      <Stack.Screen name='LeaveViewReport' component={LeaveViewReport}/> 
      <Stack.Screen name='BookRoom' component={BookRoom}/> 
      <Stack.Screen name='ViewRoom' component={ViewRoom}/>
      <Stack.Screen name='ManageBooking' component={ManageBooking}/> 
      <Stack.Screen name='BookRoomModify' component={BookRoomModify}/>
      <Stack.Screen name='RoomBookingHome' component={RoomBookingHome}/>
      <Stack.Screen name='HomePageGatepass' component={HomePageGatepass}/>
      
      </Stack.Navigator>
  );
}

export default GatePassNavigator;