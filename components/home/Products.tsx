import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import CustomCard from './Card';

import { useBackEndContext } from 'context/BackEndContext';
import { multiplyNumbersInBangla } from 'utils';

const Products = () => {
  const {
    state: { products, profile },
  } = useBackEndContext();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const userRole = profile?.user_role || 'DEALER';

  return (
    <>
      <View style={styles.container}>
        <CustomCard
          cardContainerStyle={{
            paddingLeft: SIZES.medium,
            paddingRight: SIZES.medium,
          }}
        >
          <>
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>পণ্য সমূহ</Text>
              {userRole === 'ADMIN' && (
                <Pressable
                  android_ripple={{
                    color: COLORS.primary,
                    borderless: true,
                    radius: 25,
                    foreground: true,
                  }}
                  onPress={() => {
                    bottomSheetModalRef?.current?.present();
                  }}
                >
                  <AntDesign name="edit" size={24} color={COLORS.primary} />
                </Pressable>
              )}
            </View>
            <View style={styles.listContainer}>
              {!products?.length && (
                <Text style={styles.emptyText}>কোন পণ্য এড করা হয়নি</Text>
              )}

              {!!products?.length &&
                products.map((product) => (
                  <View style={styles.listItem} key={product.id}>
                    <View style={{ justifyContent: 'center' }}>
                      <Text
                        style={[
                          styles.item,
                          !product.is_active && styles.inactiveStyle,
                        ]}
                      >
                        {product.product_name} {product.quantity} {product.unit}{' '}
                      </Text>
                      <Text
                        style={[
                          {
                            color: COLORS.gray,
                            fontSize: SIZES.medium - 3,
                          },
                          !product.is_active && styles.inactiveStyle,
                        ]}
                      >
                        (প্রতি {product.unit} {product.per_unit_price} টাকা)
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.item,
                        !product.is_active && styles.inactiveStyle,
                      ]}
                    >
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['40%']}
        backgroundStyle={{
          borderRadius: SIZES.medium,
          backgroundColor: COLORS.white,
        }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View>
            <Text
              style={{
                color: COLORS.darkBlue,
                textAlign: 'center',
              }}
            >
              Coming Soon
            </Text>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default React.memo(Products);

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
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
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inactiveStyle: {
    textDecorationLine: 'line-through',
  },
});
