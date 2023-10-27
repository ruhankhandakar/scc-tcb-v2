import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AnimatedLottieView from 'lottie-react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import Stats from 'components/home/Stats';
import SingleDropdown from 'components/common/Dropdown/SingleDropdown';
import Actions from 'components/home/Actions';

import { useBackEndContext } from 'context/BackEndContext';
import type { DealerConfig, IWards } from 'types';
import { fetchingDataLottie } from 'constants/lottie_files';
import { ProfileData } from 'types/profile';

import styles from './styles';
import Products from 'components/home/Products';

const Admin = () => {
  const {
    state: { wardsList },
    actions: { getDealerConfig, getPendingDealerList },
  } = useBackEndContext();
  const [selectedWard, setSelectedWard] = useState<number | string>();
  const [dealerConfigList, setDealerConfigList] = useState<DealerConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDealerIds, setSelectedDealerIds] = useState<number[] | null>(
    null
  );
  const [pendingDealerListData, setPendingDealerListData] = useState<
    ProfileData[]
  >([]);

  const handleChange = (item: number | string) => {
    setSelectedWard(item);
    const selectedWard = wardsList.find((ward) => ward.id === +item);
    if (selectedWard) {
      const dealerIds = selectedWard.profiles.map((profile) => profile.id);
      setSelectedDealerIds(dealerIds);
    } else if (item == '0') {
      setSelectedDealerIds(null);
    }
  };

  const prepareData = async () => {
    setLoading(true);

    try {
      const dealerConfigData = await getDealerConfig(0);
      setDealerConfigList(dealerConfigData);

      const pendingDealerData = await getPendingDealerList();
      setPendingDealerListData(pendingDealerData);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const getTotalCustomerNumbers = useMemo(() => {
    const result = {
      privilegedCustomer: 0,
      registeredCustomer: 0,
    };
    let configList = [];

    if (dealerConfigList.length) {
      if (selectedDealerIds) {
        configList = [...dealerConfigList].filter((config) =>
          selectedDealerIds.includes(+config.dealer_id)
        );
      } else {
        configList = [...dealerConfigList];
      }
      configList.forEach((config) => {
        result.privilegedCustomer += config.privileged_customer;
        result.registeredCustomer += config.registered_customer;
      });
    }
    return result;
  }, [dealerConfigList, selectedDealerIds]);

  const filterPendingDealerListData = (id: number) => {
    const filteredData = pendingDealerListData.filter((item) => item.id !== id);
    setPendingDealerListData(filteredData);
  };

  useEffect(() => {
    prepareData();
  }, []);

  return (
    <>
      <Spinner visible={loading} overlayColor="rgba(0,0,0,0.5)">
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatedLottieView
            source={fetchingDataLottie}
            autoPlay
            loop
            style={{
              height: 300,
              width: 300,
            }}
          />
          <Text style={styles.adminFetchingDataText}>
            Fetching some data... Please wait.
          </Text>
        </View>
      </Spinner>
      <View style={styles.parentContainer}>
        <SingleDropdown
          data={[
            {
              name: 'সব',
              id: 0,
              created_at: '',
              is_active: true,
              profiles: [],
            },
            ...wardsList,
          ].map((ward) => ({
            label: ward.name,
            value: ward.id,
          }))}
          handleChange={handleChange}
          placeholder="ওয়ার্ড সিলেক্ট করুন"
        />
        <Stats styles={styles} {...getTotalCustomerNumbers} />
        {pendingDealerListData.length > 0 && (
          <Actions
            pendingDealerListData={pendingDealerListData}
            filterPendingDealerListData={filterPendingDealerListData}
          />
        )}
        <Products />
      </View>
    </>
  );
};

export default React.memo(Admin);
