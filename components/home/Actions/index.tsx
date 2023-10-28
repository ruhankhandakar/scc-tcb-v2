import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Card from './Card';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { ProfileData } from 'types/profile';

interface Props {
  pendingDealerListData: ProfileData[];
  filterPendingDealerListData: (id: number) => void;
}

const Actions = ({
  pendingDealerListData,
  filterPendingDealerListData,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pendingActionsText}>Dealers Pending Approvals: </Text>
      <View style={styles.cardListContainer}>
        {pendingDealerListData.map((dealer) => (
          <View style={styles.cardView} key={dealer.id}>
            <Card
              profileData={dealer}
              filterPendingDealerListData={filterPendingDealerListData}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(Actions);

const styles = StyleSheet.create({
  container: {},
  pendingActionsText: {
    fontFamily: FONT.bold,
    color: COLORS.darkBlue,
    fontSize: SIZES.large,
    textDecorationLine: 'underline',
  },
  cardListContainer: {
    marginTop: SIZES.medium,
  },
  cardView: {
    marginBottom: SIZES.medium,
  },
});
