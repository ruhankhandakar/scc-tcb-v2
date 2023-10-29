import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Button, Text, Checkbox } from 'react-native-paper';
import { useBottomSheet } from '@gorhom/bottom-sheet';

import { COLORS, FONT, SIZES } from 'constants/theme';
import { useBackEndContext } from 'context/BackEndContext';
import { convertNumberToBangla, isBanglaNumber } from 'utils';
import { Products } from 'types';
import { CreateProductPayload } from 'utils/types';

interface Props {
  selectedProduct?: Products | null;
  handleEdit?: (product: Products | null) => void;
}

const EditProducts = ({ selectedProduct, handleEdit }: Props) => {
  const {
    actions: { createProduct, refetch, updateProduct },
  } = useBackEndContext();
  const { close } = useBottomSheet();

  const [products, setProducts] = useState<Partial<Products>>(() => ({
    product_name: selectedProduct?.product_name || '',
    quantity: selectedProduct?.quantity || '',
    unit: selectedProduct?.unit || 'কেজি',
    per_unit_price: selectedProduct?.per_unit_price || '',
    is_active: selectedProduct ? selectedProduct.is_active : true,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onTextChange = (type: string, value: string) => {
    setProducts((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  const handleSubmit = async () => {
    const { per_unit_price, quantity, unit, product_name, is_active } =
      products;

    let perUnitPrice = per_unit_price;
    let _quantity = quantity;

    // * If number is already in bangla then don't convert otherwise convert
    if (!isBanglaNumber(per_unit_price!)) {
      perUnitPrice = convertNumberToBangla(+per_unit_price!);
    }
    if (!isBanglaNumber(quantity!)) {
      _quantity = convertNumberToBangla(+quantity!);
    }

    const payload = {
      unit,
      quantity: _quantity,
      per_unit_price: perUnitPrice,
      product_name,
      is_active,
    } as CreateProductPayload;

    setIsSubmitting(true);
    let response;
    if (selectedProduct) {
      response = await updateProduct(selectedProduct.id, payload);
    } else {
      response = await createProduct(payload);
    }
    if (response?.success) {
      await refetch('products');
      setProducts({
        product_name: '',
        quantity: '',
        unit: 'কেজি',
        per_unit_price: '',
      });
      if (handleEdit) {
        handleEdit(null);
      }
      close();
    }
    setIsSubmitting(false);
  };

  const isDisabled =
    !products.product_name ||
    !products.quantity ||
    !products.per_unit_price ||
    isSubmitting;

  return (
    <View>
      <View style={styles.flexRowView}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => onTextChange('product_name', text)}
            value={products.product_name}
            placeholder="পণ্যের নাম"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => onTextChange('quantity', text)}
            value={products.quantity}
            placeholder="পরিমাণ"
            placeholderTextColor={COLORS.gray}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.flexRowView}>
        <View style={[styles.inputContainer]}>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) =>
              onTextChange('per_unit_price', text)
            }
            value={products.per_unit_price}
            placeholder={`প্রতি ${products.unit} এ দাম`}
            placeholderTextColor={COLORS.gray}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.radioContainer}>
          <Pressable
            style={[
              styles.radioBtn,
              styles.firstBtn,
              products.unit === 'কেজি' && styles.activeBtn,
            ]}
            onPress={() => {
              onTextChange('unit', 'কেজি');
            }}
          >
            <Text
              style={[
                styles.text,
                products.unit === 'কেজি' && styles.activeText,
              ]}
            >
              কেজি
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.radioBtn,
              styles.secondBtn,
              products.unit === 'লিটার' && styles.activeBtn,
            ]}
            onPress={() => {
              onTextChange('unit', 'লিটার');
            }}
          >
            <Text
              style={[
                styles.text,
                products.unit === 'লিটার' && styles.activeText,
              ]}
            >
              লিটার
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Checkbox
          status={products?.is_active ? 'checked' : 'unchecked'}
          onPress={() => {
            setProducts((prevState) => ({
              ...prevState,
              is_active: !prevState.is_active,
            }));
          }}
        />
        <Text style={styles.statusText}>
          {products?.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'} আছে
        </Text>
      </View>
      <View style={styles.submitBtnContainer}>
        <Button
          mode="contained"
          style={styles.submitBtn}
          disabled={isDisabled}
          onPress={() => {
            handleSubmit();
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </View>
    </View>
  );
};

export default EditProducts;

const styles = StyleSheet.create({
  flexRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.small,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    paddingLeft: 4,
  },
  statusText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.darkBlue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 16,
    height: 50,
    flex: 1,
  },
  input: {
    color: COLORS.darkBlue,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 14,
  },
  radioContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 14,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 16,
  },
  radioBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    alignSelf: 'stretch',
  },
  activeBtn: {
    borderColor: COLORS.primary,
  },
  firstBtn: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  secondBtn: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 1,
    color: COLORS.gray,
  },
  activeText: {
    color: COLORS.primary,
  },
  submitBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.medium,
  },
  submitBtn: {
    width: 200,
  },
});
