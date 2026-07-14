// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttendanceAdmin from '../screens/Attendance/Attendance&Admin';
import ManagerMode from '../screens/Attendance/ManagerMode';
import AttendancePer from '../screens/Attendance/AttendancePer';
import CompayShiftDe from '../screens/Attendance/CompayShiftDe';
import LeaveBalance from '../screens/Attendance/LeaveBalance';
import SalaryDeduct from '../screens/Attendance/SalaryDeduct';
import ManagerTaxiApproval from '../screens/Attendance/managermode/ManagerTaxiApproval';
import ManagerAttandancePercentage from '../screens/Attendance/managermode/ManagerAttandancePercentage';
import ApplyLeave from '../screens/Attendance/ApplyLeave';
import LeaveViewReport from '../screens/Attendance/LeaveViewReport';
import MarkAttendence from '../screens/Attendance/MarkAttendence';
import ApplyLeaveDu from '../screens/Attendance/ApplyLeaveDu';
import ManagerRHTKGatePass from '../screens/Attendance/managermode/ManagerRHTKGatePass';
import AccumulatedHours from '../screens/Attendance/AccumulatedHours';
import ApplyLeaveHome from '../screens/Attendance/ApplyLeaveHome';
import ShortfallLeave from '../screens/Attendance/ShortfallLeave';
import ViewReportHome from '../screens/Attendance/ViewReportHome';
import SalaryDeductHome from '../screens/Attendance/SalaryDeductHome';
import ShortfallDeduction from '../screens/Attendance/ShortfallDeduction';
import ApplyLeaveDuShort from '../screens/Attendance/ApplyLeaveDuShort';
import ManagerLeaveHome from '../screens/Attendance/managermode/ManagerLeaveHome';
import ManagerShortfallLeave from '../screens/Attendance/managermode/ManagerShortfallLeave';
import LeaveHome from '../screens/Attendance/LeaveHome';
import LeaveReportHome from '../screens/Attendance/LeaveReportHome';
import ExtraWorkLeaveReport from '../screens/Attendance/ExtraWorkLeaveReport';
import ExtraHoursApproval from '../screens/Attendance/managermode/ExtraHoursApproval';
// import ManagerTaxiOld from '../screens/Attendance/managermode/ManagerTaxiOld';

const Stack = createNativeStackNavigator();

function AttendanceAdminNav() {
  return (
    <Stack.Navigator initialRouteName='AttendanceAdmin' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='AttendanceAdmin' component={AttendanceAdmin} />
      <Stack.Screen name='ManagerMode' component={ManagerMode} />
      <Stack.Screen name='AttendancePer' component={AttendancePer} />
      <Stack.Screen name='CompayShiftDe' component={CompayShiftDe} />
      <Stack.Screen name='LeaveBalance' component={LeaveBalance} />
      <Stack.Screen name='SalaryDeduct' component={SalaryDeduct} />
      <Stack.Screen name='ManagerTaxiApproval' component={ManagerTaxiApproval}/>
      <Stack.Screen name='ManagerAttandancePercentage' component={ManagerAttandancePercentage}/>  
      <Stack.Screen name='ApplyLeave' component={ApplyLeave}/> 
      <Stack.Screen name='LeaveViewReport' component={LeaveViewReport}/> 
      <Stack.Screen name='MarkAttendence' component={MarkAttendence}/> 
      <Stack.Screen name='ApplyLeaveDu' component={ApplyLeaveDu}/> 
      <Stack.Screen name='ManagerRHTKGatePass' component={ManagerRHTKGatePass}/>
      <Stack.Screen name='AccumulatedHours' component={AccumulatedHours}/>
      <Stack.Screen name='ApplyLeaveHome' component={ApplyLeaveHome}/>
      <Stack.Screen name='ShortfallLeave' component={ShortfallLeave}/>
      <Stack.Screen name='ViewReportHome' component={ViewReportHome}/>
      <Stack.Screen name='SalaryDeductHome' component={SalaryDeductHome}/>
      <Stack.Screen name='ShortfallDeduction' component={ShortfallDeduction}/>
      <Stack.Screen name='ApplyLeaveDuShort' component={ApplyLeaveDuShort}/>
      <Stack.Screen name='ManagerLeaveHome' component={ManagerLeaveHome}/>
      <Stack.Screen name='ManagerShortfallLeave' component={ManagerShortfallLeave}/>
      <Stack.Screen name='LeaveHome' component={LeaveHome}/>
      <Stack.Screen name='LeaveReportHome' component={LeaveReportHome}/>
      <Stack.Screen name='ExtraWorkLeaveReport' component={ExtraWorkLeaveReport}/>
      <Stack.Screen name='ExtraHoursApproval' component={ExtraHoursApproval}/>  
      {/* <Stack.Screen name='ManagerTaxiOld' component={ManagerTaxiOld}/>   */}


      
      




      {/* <Stack.Screen name='AccumulatedHours' component={AccumulatedHours}/>
      <Stack.Screen name='ApplyLeaveHome' component={ApplyLeaveHome}/>
      <Stack.Screen name='ShortfallLeave' component={ShortfallLeave}/>
      <Stack.Screen name='ViewReportHome' component={ViewReportHome}/>
      <Stack.Screen name='SalaryDeductHome' component={SalaryDeductHome}/>
      <Stack.Screen name='ShortfallDeduction' component={ShortfallDeduction}/>
      <Stack.Screen name='ManagerLeaveHome' component={ManagerLeaveHome}/>
      <Stack.Screen name='ManagerShortfallLeave' component={ManagerShortfallLeave}/>
      <Stack.Screen name='ApplyLeaveDuShort' component={ApplyLeaveDuShort}/> */}

       

    </Stack.Navigator>
  );
}

export default AttendanceAdminNav;