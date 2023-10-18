import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Entypo } from '@expo/vector-icons';

import { COLORS, SIZES } from 'constants/theme';
import { ItemType } from 'types';

interface Props {
  data: ItemType[];
  handleChange: (item: string[]) => void;
  placeholder: string;
  label: string;
}

const MultiSelectComponent = ({
  data,
  handleChange,
  placeholder,
  label,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item: ItemType) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: COLORS.primary }]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  useEffect(() => {
    handleChange(selected);
  }, [selected, handleChange]);

  return (
    <View style={styles.container}>
      {renderLabel()}
      <MultiSelect
        style={[styles.dropdown, isFocus && { borderColor: COLORS.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        value={selected}
        search
        searchPlaceholder="Search..."
        onChange={(item) => {
          setSelected(item);
        }}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        itemContainerStyle={{
          backgroundColor: 'red',
        }}
        renderLeftIcon={() => (
          <Entypo
            name="list"
            size={20}
            color={isFocus ? COLORS.primary : COLORS.black}
            style={styles.icon}
          />
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color={COLORS.black} name="delete" size={12} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: SIZES.medium,
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

  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: SIZES.xSmall,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: SIZES.small,
    fontSize: SIZES.small,
  },
});
