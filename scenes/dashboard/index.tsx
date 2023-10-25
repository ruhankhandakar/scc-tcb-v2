import React, { useState } from 'react';
import { View } from 'react-native';

import { CustomerList } from 'components/dashboard';
import CustomerTab from 'components/dashboard/CustomerTab';

import styles from 'styles/style';
import { CustomerType } from 'utils/types';

const tabCustomerMapping: {
  first: CustomerType;
  second: CustomerType;
} = {
  first: 'registered',
  second: 'privileged',
};

const index = () => {
  const [selectedTab, setSelectedTab] = useState<'first' | 'second'>('first');

  return (
    <View style={styles.sceneContainer}>
      <CustomerTab
        selectedTab={selectedTab}
        setSelectedTab={(text: 'first' | 'second') => {
          setSelectedTab(text);
        }}
      />
      <CustomerList customerType={tabCustomerMapping[selectedTab]} />
    </View>
  );
};

export default index;
