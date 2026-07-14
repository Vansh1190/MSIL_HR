import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompensationBenifits from '../screens/CompensationAndBenifits/CompensationBenifits';
import SalarySlip from '../screens/CompensationAndBenifits/SalarySlip';
import Plencashment from '../screens/CompensationAndBenifits/Plencashment';
import ConveyanceBillsSubmission from '../screens/CompensationAndBenifits/ConveyanceBillsSubmission';
import TaxComputationSlip from '../screens/CompensationAndBenifits/TaxComputationSlip';
import PFBalance from '../screens/CompensationAndBenifits/PFBalance';
import TaxSavings from '../screens/CompensationAndBenifits/TaxSavings';
import DiwaliGift from '../screens/CompensationAndBenifits/DiwaliGift';
import SundayAllowance from '../screens/CompensationAndBenifits/SundayAllowance';
import AlreadySent from '../screens/CompensationAndBenifits/AlreadySent';
import PendingAllowance from '../screens/CompensationAndBenifits/PendingAllowance';
import PendingAlw from '../screens/CompensationAndBenifits/PendingAlw';
import ConsentHome from '../screens/CompensationAndBenifits/ConsentHome';
import IncrementDecrementCounter from '../screens/CompensationAndBenifits/IncrementDecrementCounter';
import Form16 from '../screens/CompensationAndBenifits/Form16';

const Stack = createNativeStackNavigator();

function CompensationBenifitsNav() {
  return (
      <Stack.Navigator initialRouteName='CompensationBenifits' screenOptions={{headerShown:false}}>
        <Stack.Screen name='CompensationBenifits' component={CompensationBenifits}/>
        <Stack.Screen name='SalarySlip' component={SalarySlip}/>
        <Stack.Screen name='Plencashment' component={Plencashment}/>
        <Stack.Screen name='ConveyanceBillsSubmission' component={ConveyanceBillsSubmission}/>
        <Stack.Screen name='TaxComputationSlip' component={TaxComputationSlip} />  
        <Stack.Screen name='PFBalance' component={PFBalance} />  
        <Stack.Screen name='TaxSavings' component={TaxSavings} />  
        <Stack.Screen name='DiwaliGift' component={DiwaliGift} />
        <Stack.Screen name='SundayAllowance' component={SundayAllowance} /> 
        <Stack.Screen name='AlreadySent' component={AlreadySent} /> 
        <Stack.Screen name='PendingAllowance' component={PendingAllowance} /> 
        <Stack.Screen name='PendingAlw' component ={PendingAlw}/>
        <Stack.Screen name='ConsentHome' component ={ConsentHome}/>
        <Stack.Screen name='Form16' component={Form16}/>
        <Stack.Screen name='IncrementDecrementCounter' component={IncrementDecrementCounter}/>
        
      </Stack.Navigator>
  );
}

export default CompensationBenifitsNav;