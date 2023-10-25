import React, { useEffect, useState } from 'react';
import { Alert, View, VirtualizedList } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import _ from 'lodash';

import SearchBox from 'components/common/Search';
import DashboardCard from 'components/common/DashboardCard';

import styles from './customerlist.style';
import { COLORS } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { Customer } from 'types';
import { noDataIllustration } from 'constants/icons';
import { CustomerType } from 'utils/types';

const PAGE_SIZE = 10;

type ItemProps = {
  title: string;
};

interface Props {
  customerType: CustomerType;
}

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const CustomerList = ({ customerType }: Props) => {
  const {
    state: { profile },
    actions: { getCustomers, updateState, getTotalCustomersV2 },
  } = useBackEndContext();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Customer[]>([]);
  const [totalNumberOfCustomers, setTotalNumberOfCustomers] = useState(0);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchCustomers = async ({
    wardNum,
    dealerId,
    customerType,
  }: {
    wardNum?: number;
    dealerId?: number;
    customerType: CustomerType;
  }) => {
    const startOffset = (page - 1) * PAGE_SIZE;
    const endOffset = startOffset + PAGE_SIZE;

    try {
      setLoading(true);
      const response = await getCustomers({
        startOffset,
        endOffset,
        customerType,
        wardNum,
        dealerId,
      });
      if (startOffset > 30) {
      } else {
        setUsers((prevState) => {
          let result = [...prevState, ...response];
          result = _.uniqBy(result, 'id');
          console.log('result', result);
          return result;
        });
      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    let column = 'mobile_number';

    if (isNaN(parseInt(searchTerm))) {
      column = 'name';
    }

    setLoading(true);
    const response = await getCustomers({
      column,
      searchTerm,
    });
    setUsers(response);
    setLoading(false);
  };

  const handleCardClick = (item: Customer) => {
    updateState('selectedProfile', item);
    // @ts-ignore
    router.replace('/details');
  };

  useEffect(() => {
    const wardNum = profile?.ward;
    const dealerId = profile?.id;
    console.log(wardNum, dealerId, customerType);
    if (page <= 2) {
      fetchCustomers({
        wardNum,
        dealerId,
        customerType,
      });
    }
  }, [page, profile, customerType]);

  useEffect(() => {
    setUsers([]);
    setPage(1);
  }, [customerType]);

  useEffect(() => {
    setIsFetchingData(true);
    getTotalCustomersV2({
      customerType,
      wardNum: profile?.ward,
      dealerId: profile!.id,
    })
      .then((count) => {
        setTotalNumberOfCustomers(count);
      })
      .finally(() => {
        setIsFetchingData(false);
      });
  }, [customerType, profile?.ward]);

  return (
    <View style={styles.container}>
      {isFetchingData && (
        <ActivityIndicator size="small" color={COLORS.primary} />
      )}
      {totalNumberOfCustomers > 0 && !isFetchingData && (
        <View>
          <Text style={styles.totalNumberText}>
            {customerType === 'registered'
              ? 'মোট নিবন্ধিত উপকারভোগী গ্রাহকের সংখ্যা:'
              : 'এই মাসে সুবিধাপ্রাপ্ত উপকারভোগী গ্রাহকের সংখ্যা:'}{' '}
            {totalNumberOfCustomers}
          </Text>
        </View>
      )}
      {customerType === 'registered' && (
        <SearchBox
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleClick={handleSearch}
          loading={loading}
          handleSearch={handleSearch}
        />
      )}
      {loading && !users.length && (
        <View>
          <ActivityIndicator
            animating={true}
            size="large"
            color={COLORS.primary}
          />
        </View>
      )}
      {!loading && !users.length && (
        <View style={styles.noDataImgContainer}>
          <Image
            source={noDataIllustration}
            contentFit="cover"
            style={styles.noDataImg}
          />
          <Text variant="bodyMedium" style={styles.noDataText}>
            কোন ডাটা খুঁজে পাওয়া যায়নি
          </Text>
        </View>
      )}

      {users.length > 0 && (
        <VirtualizedList
          initialNumToRender={4}
          renderItem={({ item }) => (
            <DashboardCard
              item={item}
              handleNavigate={() => {
                handleCardClick(item);
              }}
            />
          )}
          keyExtractor={(item: Customer) => `customers_${item.id}`}
          getItem={(data, index) => users[index]}
          getItemCount={() => users.length}
          ListFooterComponent={() => {
            if (page > 2 && users.length > 10)
              return (
                <View style={styles.footerContainer}>
                  <Text style={styles.endText}>
                    অনুগ্রহ করে আরও গ্রাহকের বিবরণ পেতে search ব্যবহার করুন
                  </Text>
                </View>
              );
            return loading ? (
              <View style={styles.footerContainer}>
                <ActivityIndicator animating={true} color={COLORS.primary} />
              </View>
            ) : null;
          }}
          onEndReached={page < 3 ? fetchMore : null}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

export default React.memo(CustomerList);
