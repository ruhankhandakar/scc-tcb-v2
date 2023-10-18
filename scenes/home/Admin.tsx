import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import DropdownComponent from 'components/common/Dropdown';

import styles from './styles';
import { useBackEndContext } from 'context/BackEndContext';
import type { ItemType } from 'types';

const Admin = () => {
  const {
    actions: { getWards },
  } = useBackEndContext();
  const [lists, setLists] = useState<ItemType[]>([]);

  useEffect(() => {
    getWards().then((data) => {
      const lists = data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setLists(lists as ItemType[]);
    });
  }, []);

  const handleChange = (item: string[]) => {
    console.log('item -->', item);
  };

  return (
    <View style={styles.parentContainer}>
      <DropdownComponent
        data={lists}
        handleChange={handleChange}
        placeholder="ওয়ার্ডস সিলেক্ট করুন"
        label="ওয়ার্ড"
      />
      <Stats styles={styles} />
    </View>
  );
};

export default Admin;
