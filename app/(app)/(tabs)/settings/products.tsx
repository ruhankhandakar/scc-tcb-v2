import { StyleSheet, View } from 'react-native';

import ProductsSettings from 'components/settings/ProductsSettings';
import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import BackToSettings from 'components/settings/BackToSettings';

import { SIZES } from 'constants/theme';

const Products = () => {
  return (
    <ScrollViewWithWaterMark>
      <View style={styles.container}>
        <BackToSettings />
        <ProductsSettings />
      </View>
    </ScrollViewWithWaterMark>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
  },
});
