import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';
import CustomCard from './Card';

const Products = () => {
  return (
    <View style={styles.container}>
      <CustomCard
        cardContainerStyle={{
          paddingLeft: SIZES.medium,
          paddingRight: SIZES.medium,
        }}
      >
        <>
          <Text style={styles.headingText}>পণ্য সমূহ</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.item}>তেল</Text>
              <Text style={styles.item}>1 Ltr</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.item}>ডাল</Text>
              <Text style={styles.item}>1 Kg</Text>
            </View>
          </View>
        </>
      </CustomCard>
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
  },
  headingText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.darkBlue,
    fontWeight: '600',
  },
});
