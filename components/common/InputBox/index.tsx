import React from 'react';
import { TextInput, View } from 'react-native';

import styles from './style';
import { COLORS } from 'constants/theme';

const InputBox = ({ editable = true, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      {/* @ts-ignore */}
      <View style={styles.inputWrapper(editable)}>
        <TextInput
          style={{
            ...styles.inputText,
          }}
          editable={editable}
          {...props}
        />
      </View>
    </View>
  );
};

export default InputBox;
