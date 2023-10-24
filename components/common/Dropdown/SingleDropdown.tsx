import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from 'constants/theme';

import { ItemType } from 'types';

interface Props {
  data: ItemType[];
  handleChange: (item: number | string) => void;
  placeholder: string;
  selectedValue?: string | null;
}

const SingleDropdown = ({
  data,
  handleChange,
  placeholder,
  selectedValue,
}: Props) => {
  const [value, setValue] = useState<string | null>(
    () => selectedValue || null
  );
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: COLORS.darkBlue }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? `ওয়ার্ড ${value}` || placeholder : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          // @ts-ignore
          setValue(item.value);
          setIsFocus(false);
          handleChange(item.value);
        }}
        renderLeftIcon={() => (
          <Entypo
            name="list"
            size={20}
            color={COLORS.darkBlue}
            style={styles.icon}
          />
        )}
      />
    </View>
  );
};

export default SingleDropdown;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 0,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.darkBlue,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.darkBlue,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
