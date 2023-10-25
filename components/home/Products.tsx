import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';

import CustomCard from './Card';

import { useBackEndContext } from 'context/BackEndContext';
import { multiplyNumbersInBangla } from 'utils';

const Products = () => {
  const {
    state: { products },
  } = useBackEndContext();

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
            {!products?.length && (
              <Text style={styles.emptyText}>কোন পণ্য এড করা হয়নি</Text>
            )}

            {!!products?.length &&
              products.map((product) => (
                <View style={styles.listItem} key={product.id}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.item}>
                      {product.product_name} {product.quantity} {product.unit}{' '}
                    </Text>
                    <Text
                      style={{ color: COLORS.gray, fontSize: SIZES.medium - 3 }}
                    >
                      (প্রতি {product.unit} {product.per_unit_price} টাকা)
                    </Text>
                  </View>
                  <Text style={styles.item}>
                    মোট{' '}
                    {multiplyNumbersInBangla(
                      product.quantity,
                      product.per_unit_price
                    )}{' '}
                    টাকা
                  </Text>
                </View>
              ))}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  item: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.darkBlue,
    fontWeight: '600',
  },
  emptyText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.inversePrimary,
    textAlign: 'center',
  },
});
