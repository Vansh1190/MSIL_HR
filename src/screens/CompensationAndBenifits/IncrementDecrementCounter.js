import React, { useState } from 'react';

import { View, Button, Text, StyleSheet } from 'react-native';
 
const IncrementDecrementCounter = () => {

  const [count, setCount] = useState(0); // Initialize state with 0
 
  const incrementCount = () => {

    setCount(count + 1); // Increment the count by 1

  };
 
  const decrementCount = () => {

    setCount(count - 1); // Decrement the count by 1

  };
 
  return (
<View style={styles.container}>
<Text style={styles.countText}>{count}</Text>
<View style={styles.buttonContainer}>
<Button title="Increment" onPress={incrementCount} />
<Button title="Decrement" onPress={decrementCount} />
</View>
</View>

  );

};
 
const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

  },

  countText: {

    fontSize: 32,

    marginBottom: 20,

  },

  buttonContainer: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    width: '60%',

  },

});
 
export default IncrementDecrementCounter;

 