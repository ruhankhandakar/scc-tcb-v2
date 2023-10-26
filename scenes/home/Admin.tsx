import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import Stats from 'components/home/Stats';
import DropdownComponent from 'components/common/Dropdown';
import WardDealerList from 'components/home/WardDealerList';

import styles from './styles';
import { useBackEndContext } from 'context/BackEndContext';
import type { DealerConfig, IWards } from 'types';
import SingleDropdown from 'components/common/Dropdown/SingleDropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import AnimatedLottieView from 'lottie-react-native';
import { fetchingDataLottie } from 'constants/lottie_files';
import { Text } from 'react-native-paper';

const Admin = () => {
  const {
    actions: { getWards, getDealerConfig },
  } = useBackEndContext();
  const [wardsList, setWardsList] = useState<IWards[]>([]);
  const [selectedWard, setSelectedWard] = useState<number | string>();
  const [dealerConfigList, setDealerConfigList] = useState<DealerConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDealerIds, setSelectedDealerIds] = useState<number[] | null>(
    null
  );

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
      const wardsData = await getWards();
      setWardsList(wardsData!);
      const dealerConfigData = await getDealerConfig(0);
      setDealerConfigList(dealerConfigData);
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
      </View>
    </>
  );
};

export default React.memo(Admin);
