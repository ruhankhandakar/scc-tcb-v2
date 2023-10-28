import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { multiplyNumbersInBangla } from 'utils';
import { Products } from 'types';

interface Props {
  product: Products;
}

const ProductList = ({ product }: Props) => {
  return (
    <View style={styles.listItem} key={product.id}>
      <View style={{ justifyContent: 'center' }}>
        <Text style={[styles.item, !product.is_active && styles.inactiveStyle]}>
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
      <Text style={[styles.item, !product.is_active && styles.inactiveStyle]}>
        মোট {multiplyNumbersInBangla(product.quantity, product.per_unit_price)}{' '}
        টাকা
      </Text>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
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
  inactiveStyle: {
    textDecorationLine: 'line-through',
  },
});
