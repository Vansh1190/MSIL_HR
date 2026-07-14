import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Accordion from './Accordion';
import Calender from './Calender';

const TabComponent = ({lunch, snacks, dinner}) => {
    const [isOpen, setIsOpen] = useState('');
    return (
      <View >
        {/* <Calander /> */}
        <Accordion data={lunch} name={'Lunch'} handleDropDown={() => setIsOpen(isOpen === 'lunch' ? '' : 'lunch')} isOpen={isOpen === 'lunch'} style={{fontSize:13}}  />
        <Accordion data={snacks} name={'Snacks'} handleDropDown={() => setIsOpen(isOpen === 'snacks' ? '' : 'snacks')} isOpen={isOpen === 'snacks'} style={{fontSize:13}} />
        <Accordion data={dinner} name={'Dinner'} handleDropDown={() => setIsOpen(isOpen === 'dinner' ? '' : 'dinner')} isOpen={isOpen === 'dinner'}style={{fontSize:13}} />
      </View>
    );
}

export default TabComponent