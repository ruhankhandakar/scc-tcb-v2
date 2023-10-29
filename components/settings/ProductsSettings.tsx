import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import EditProduct from 'components/home/Actions/EditProduct';
import { useRef, useState } from 'react';

import ProductList from 'components/home/ProductList';

import { useBackEndContext } from 'context/BackEndContext';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { Products } from 'types';

const ProductsSettings = () => {
  const {
    state: { products },
  } = useBackEndContext();

  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleEdit = (product: Products | null) => {
    setSelectedProduct(product);
    bottomSheetModalRef?.current?.present();
  };

  return (
    <>
      <View style={styles.listContainer}>
        <Text style={styles.headingText}>পণ্য সমূহ</Text>
        <View style={styles.createNewBtnContainer}>
          <Pressable
            style={styles.createNewBtn}
            android_ripple={{
              color: COLORS.primary,
              borderless: false,
              radius: 20,
              foreground: false,
            }}
            onPress={() => {
              bottomSheetModalRef?.current?.present();
            }}
          >
            <Text style={styles.createNewBtnText}>নতুন পণ্য যুক্ত করুন</Text>
          </Pressable>
        </View>
        {!products?.length && (
          <Text style={styles.emptyText}>কোন পণ্য এড করা হয়নি</Text>
        )}

        {!!products?.length &&
          products.map((product) => (
            <ProductList
              key={product.id}
              product={product}
              handleEdit={handleEdit}
              isFromSetting
            />
          ))}
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
          <EditProduct
            selectedProduct={selectedProduct}
            handleEdit={handleEdit}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default ProductsSettings;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  listContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: SIZES.medium,
    borderRadius: 5,
  },
  emptyText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.inversePrimary,
    textAlign: 'center',
  },
  headingText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  createNewBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  createNewBtn: {
    fontSize: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  createNewBtnText: {
    borderColor: COLORS.primary,
    fontFamily: FONT.medium,
  },
});
