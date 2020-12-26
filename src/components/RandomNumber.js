import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const RandomNumber = ({id, number, isDisabled, onPress}) => {
  const handlePress = () => {
    if(!isDisabled) {
      onPress(id);
    }
    // onPress(id);

    
  };
  return (
    <>
      <TouchableOpacity onPress={handlePress} disabled={isDisabled}>
        <Text style={[styles.number, isDisabled && styles.disabled]}>
          {number}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  number: {
    backgroundColor: '#666',
    fontSize: 30,
    width: 60,
    marginVertical: 20,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});

export default RandomNumber;
