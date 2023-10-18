import React from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import DropdownComponent from 'components/common/Dropdown';

import styles from './styles';
import { ItemType } from 'types';

const data: ItemType[] = [
  { label: 'Item 1', value: 1 },
  { label: 'Item 2', value: 2 },
  { label: 'Item 3', value: 3 },
  { label: 'Item 4', value: 4 },
  { label: 'Item 5', value: 5 },
  { label: 'Item 6', value: 6 },
  { label: 'Item 7', value: 7 },
  { label: 'Item 8', value: 8 },
];

const Admin = () => {
  const handleChange = (item: string[]) => {
    console.log('item -->', item);
  };
  return (
    <View style={styles.parentContainer}>
      <DropdownComponent
        data={data}
        handleChange={handleChange}
        placeholder="ওয়ার্ডস সিলেক্ট করুন"
        label="ওয়ার্ড"
      />
      <Stats styles={styles} />
    </View>
  );
};

export default Admin;
