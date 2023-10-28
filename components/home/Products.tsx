import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';

import CustomCard from './Card';
import ProductList from './ProductList';

import { useBackEndContext } from 'context/BackEndContext';

const Products = () => {
  const {
    state: { products, profile },
  } = useBackEndContext();

  const router = useRouter();

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
                    router.push('/settings/products');
                  }}
                >
                  <AntDesign name="edit" size={24} color={COLORS.primary} />
                </Pressable>
              )}
            </View>
            <GestureScrollView style={styles.scrollContainer}>
              <View style={styles.listContainer}>
                {!products?.length && (
                  <Text style={styles.emptyText}>কোন পণ্য এড করা হয়নি</Text>
                )}

                {!!products?.length &&
                  products.map((product) => (
                    <ProductList key={product.id} product={product} />
                  ))}
              </View>
            </GestureScrollView>
          </>
        </CustomCard>
      </View>
    </>
  );
};

export default React.memo(Products);

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
  },
  headingText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    maxHeight: 200, // Set your maximum height here
  },
  listContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
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
});
