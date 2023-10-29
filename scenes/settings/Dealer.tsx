import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import DealerCard from './DealerCard';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { ProfileData } from 'types/profile';
import CardSkeleton from 'components/common/CardSkeleton';

const Dealer = () => {
  const {
    actions: { getDealerList },
  } = useBackEndContext();

  const [allDealerList, setAllDealerList] = useState<ProfileData[]>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    getDealerList()
      .then((response) => {
        setAllDealerList(response);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Feather name="users" size={SIZES.large} color={COLORS.tertiary} />
          <Text style={styles.titleText}>ডিলার ব্যাবস্থপনাঃ</Text>
        </View>
      </View>
      {isFetching && <CardSkeleton />}
      {!isFetching && allDealerList && allDealerList.length > 0 && (
        <View style={styles.listContainer}>
          {allDealerList.map((list) => (
            <DealerCard key={list.id} data={list} />
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(Dealer);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleText: {
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    fontFamily: FONT.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tertiary,
  },
  listContainer: {
    marginTop: SIZES.large,
  },
  viewAllBtn: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
});
