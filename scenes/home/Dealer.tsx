import React from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';

import styles from './styles';
import CustomPieChart from 'components/common/Chart/CustomPieChart';

const Dealer = () => {
  const privilegedCustomer = 1500;
  const registeredCustomer = 2100;

  return (
    <>
      <View style={styles.parentContainer}>
        <Stats
          styles={styles}
          privilegedCustomer={privilegedCustomer}
          registeredCustomer={registeredCustomer}
        />
        <CustomPieChart
          privilegedCustomer={privilegedCustomer}
          registeredCustomer={registeredCustomer}
        />
      </View>
    </>
  );
};

export default Dealer;
