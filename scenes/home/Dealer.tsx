import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import HomePieChart from 'components/common/Chart/HomePieChart';
import Products from 'components/home/Products';

import styles from './styles';
import { useBackEndContext } from 'context/BackEndContext';
import WelcomeText from 'components/home/WelcomeText';

const Dealer = () => {
  const {
    state: { refetch, profile },
    actions: { getDealerConfig },
  } = useBackEndContext();

  const [customerNumber, setCustomerNumber] = useState({
    privilegedCustomer: 0,
    registeredCustomer: 0,
  });

  const refetchText = refetch || 'dealer_config';

  useEffect(() => {
    if (refetchText.includes('dealer_config')) {
      getDealerConfig().then((response) => {
        if (response.length) {
          setCustomerNumber({
            privilegedCustomer: response[0].privileged_customer,
            registeredCustomer: response[0].registered_customer,
          });
        }
      });
    }
  }, [refetchText]);

  return (
    <>
      <View style={styles.parentContainer}>
        {!!profile && (
          <WelcomeText
            firstName={profile.first_name}
            lastName={profile.last_name}
          />
        )}
        <Stats
          styles={styles}
          privilegedCustomer={customerNumber.privilegedCustomer}
          registeredCustomer={customerNumber.registeredCustomer}
        />
        <HomePieChart
          privilegedCustomer={customerNumber.privilegedCustomer || 1}
          registeredCustomer={customerNumber.registeredCustomer || 1}
        />
        <Products />
      </View>
    </>
  );
};

export default Dealer;
