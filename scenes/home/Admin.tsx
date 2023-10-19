import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import DropdownComponent from 'components/common/Dropdown';
import WardDealerList from 'components/home/WardDealerList';

import styles from './styles';
import { useBackEndContext } from 'context/BackEndContext';
import type { IWards } from 'types';

const Admin = () => {
  const {
    actions: { getWards },
  } = useBackEndContext();
  const [wardsList, setWardsList] = useState<IWards[]>([]);
  const [selectedWards, setSelectedWard] = useState<IWards[]>([]);

  useEffect(() => {
    getWards().then((data) => {
      setWardsList(data!);
    });
  }, []);

  const handleChange = (item: number[]) => {
    const selectedLists = wardsList.filter((list) => item.includes(list.id));
    setSelectedWard(selectedLists);
  };

  return (
    <View style={styles.parentContainer}>
      <DropdownComponent
        data={wardsList.map((ward) => ({
          label: ward.name,
          value: ward.id,
        }))}
        handleChange={handleChange}
        placeholder="ওয়ার্ডস সিলেক্ট করুন"
        label="ওয়ার্ড"
      />
      {!!selectedWards.length && <WardDealerList data={selectedWards} />}
      <Stats styles={styles} />
    </View>
  );
};

export default React.memo(Admin);
