import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Card from './Card';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { ProfileData } from 'types/profile';

const numbers = Array.from({ length: 70 }, (_, index) => index + 1);

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
      <Text style={styles.pendingActionsText}>Pending Actions</Text>
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
  container: {
    marginTop: SIZES.xLarge,
    borderWidth: 2,
    borderColor: COLORS.gray2,
    borderRadius: 3,
    padding: SIZES.small,
  },
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
