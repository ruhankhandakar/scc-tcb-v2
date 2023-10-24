import React from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import HomePieChart from 'components/common/Chart/HomePieChart';
import Products from 'components/home/Products';

import styles from './styles';

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
        <HomePieChart
          privilegedCustomer={privilegedCustomer}
          registeredCustomer={registeredCustomer}
        />
        <Products />
      </View>
    </>
  );
};

export default Dealer;
