import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

import DashboardCard from 'components/common/DashboardCard';
import styles from './customerlist.style';
import { users as usersData } from 'constants/data';
import { COLORS } from 'constants/theme';
import SearchBox from 'components/common/Search';

const CustomerList = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(() => usersData);

  const fetchMore = () => {
    setLoading(true);
    setPagination((prevData) => ({
      ...prevData,
      page: prevData.page + 1,
    }));
    setLoading(false);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setUsers(usersData);
      return;
    }
    const filteredData = [...users].filter(
      (user) =>
        user.mobileNumber.includes(searchTerm) ||
        user.nidNumber.includes(searchTerm)
    );
    setUsers(filteredData);
  };

  return (
    <View style={styles.container}>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClick={handleSearch}
      />
      <FlatList
        data={users.slice(0, pagination.page * pagination.pageSize)}
        keyExtractor={(item) => `user-${item.id}`}
        renderItem={({ item }) => (
          <DashboardCard
            item={item}
            handleNavigate={() => {
              // @ts-ignore
              router.push(`/profile/details/${item.id}`);
            }}
          />
        )}
        ListFooterComponent={() => {
          if (pagination.page * pagination.pageSize >= users.length)
            return null;
          return (
            <View style={styles.footerContainer}>
              <ActivityIndicator animating={true} color={COLORS.primary} />
            </View>
          );
        }}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default CustomerList;
