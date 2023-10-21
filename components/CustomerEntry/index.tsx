import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Button, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { Customer, StatusType } from 'types';
import { placeholderUser } from 'constants/icons';
import { useBackEndContext } from 'context/BackEndContext';
import { COLORS } from 'constants/theme';

import styles from './style';

interface Props {
  customerDetails: Customer;
  handleClearState: (status: StatusType) => void;
}

const CustomerDetailsWithEntry = ({
  customerDetails,
  handleClearState,
}: Props) => {
  const {
    state: { products },
  } = useBackEndContext();
  const router = useRouter();

  const [productLists, setProductLists] = useState(() => {
    if (!products) return [];

    return products.map((product) => ({
      ...product,
      is_selected: true,
    }));
  });

  const toggleProduct = (productId: number) => {
    setProductLists((prevState) => {
      return prevState.map((productList) => {
        if (productList.id === productId) {
          productList.is_selected = !productList.is_selected;
        }
        return productList;
      });
    });
  };

  const handleCancel = () => {
    handleClearState('CANCEL');
    // router.push('/(tabs)/home');
  };
  const handleOk = () => {
    console.log('Submitting');
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.imageParenContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={placeholderUser}
            contentFit="contain"
            style={styles.profilePic}
          />
        </View>
      </View>

      {/* Customer details */}
      <View style={styles.customerDetailsContainer}>
        <View style={styles.textView}>
          <Text style={styles.labelText}>কার্ড নাম্বার: </Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {customerDetails.customer_id}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.labelText}>পরিবার প্রধানের নাম: </Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {customerDetails.name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.labelText}>পিতা/স্বামীর নাম: </Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {customerDetails.gurdian_name}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.labelText}>মোবাইল নম্বর: </Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {customerDetails.mobile_number}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.labelText}>
            {customerDetails.document_proof_name}:{' '}
          </Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {customerDetails.document_proof_number}
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.labelText}>ঠিকানা: </Text>
          <Text style={styles.valueText}>
            {customerDetails.wards.name} - {customerDetails.address}
          </Text>
        </View>
      </View>

      {/* Products Details */}
      <View
        style={[
          styles.customerDetailsContainer,
          styles.productDetailsContainer,
        ]}
      >
        <Text style={styles.productHeading}>পণ্য</Text>
        <View style={styles.productListContainer}>
          {productLists.map((product) => (
            <Checkbox.Item
              key={product.id}
              label={`${product.product_name} (${product.quantity})`}
              status={product.is_selected ? 'checked' : 'unchecked'}
              color={COLORS.primary}
              labelStyle={styles.checkBoxLabel}
              style={styles.checkBoxContainer}
              onPress={() => {
                toggleProduct(product.id);
              }}
            />
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        <Button
          mode="outlined"
          style={[styles.button, styles.cancelText]}
          textColor={COLORS.error}
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button mode="contained" style={styles.button} onPress={handleOk}>
          OK
        </Button>
      </View>
    </View>
  );
};

export default CustomerDetailsWithEntry;
