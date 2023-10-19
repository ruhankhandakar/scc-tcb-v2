import React, { useEffect, useState } from 'react';
import { Alert, View, VirtualizedList } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import _ from 'lodash';

import SearchBox from 'components/common/Search';
import DashboardCard from 'components/common/DashboardCard';

import styles from './customerlist.style';
import { users as usersData } from 'constants/data';
import { COLORS } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { Customer } from 'types';
import { noDataIllustration } from 'constants/icons';

const PAGE_SIZE = 10;

type ItemProps = {
  title: string;
};

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const CustomerList = () => {
  const {
    actions: { getCustomers, getTotalCustomers },
  } = useBackEndContext();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Customer[]>([]);
  const [totalNumberOfCustomers, setTotalNumberOfCustomers] = useState(0);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchCustomers = async () => {
    const startOffset = (page - 1) * PAGE_SIZE;
    const endOffset = startOffset + PAGE_SIZE;

    try {
      setLoading(true);
      const response = await getCustomers({
        startOffset,
        endOffset,
      });
      if (response.length < PAGE_SIZE || startOffset > 20) {
      } else {
        setUsers((prevState) => {
          let result = [...prevState, ...response];
          result = _.uniqBy(result, 'id');
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

  useEffect(() => {
    if (page <= 2) {
      fetchCustomers();
    }
  }, [page]);

  useEffect(() => {
    getTotalCustomers().then((count) => {
      setTotalNumberOfCustomers(count);
    });
  }, []);

  return (
    <View style={styles.container}>
      {totalNumberOfCustomers > 0 && (
        <View>
          <Text style={styles.totalNumberText}>
            মোট গ্রাহক সংখ্যা: {totalNumberOfCustomers}
          </Text>
        </View>
      )}
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClick={handleSearch}
        loading={loading}
        handleSearch={handleSearch}
      />
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
                // @ts-ignore
                router.push(`/profile/details/${item.id}`);
              }}
            />
          )}
          keyExtractor={(item: Customer) => `customers_${item.id}`}
          getItem={(data, index) => users[index]}
          getItemCount={() => users.length}
          ListFooterComponent={() => {
            if (page > 2)
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

export default CustomerList;
