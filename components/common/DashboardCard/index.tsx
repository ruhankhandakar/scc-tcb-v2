import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Image } from 'expo-image';
import 'dayjs/locale/bn-bd';

import styles from './style';
import { placeholderUser } from 'constants/icons';
import { Customer } from 'types';
import dayjs from 'dayjs';

interface Props {
  item: Customer;
  handleNavigate: () => void;
}

const index: React.FC<Props> = ({ item, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <View style={styles.leftContainer}>
        <Image
          source={item.profile_pic || placeholderUser}
          contentFit="cover"
          style={styles.logoImage}
          cachePolicy="none"
        />

        <View style={styles.textViewsContainer}>
          <View style={styles.textView}>
            <Text style={styles.labelText}>পরিবার প্রধানের নাম: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>পিতা/স্বামীর নাম: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.gurdian_name}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>পরিবার কার্ড নাম্বার: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.customer_id}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.textView}>
            <Text style={styles.labelText}>মোবাইল নম্বর: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.phone_number}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>{item.document_proof_name}: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.document_proof_number}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>ঠিকানা: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.wards.name} - {item.address}
            </Text>
          </View>
          {!!item.scanned_date && (
            <>
              <View style={styles.divider} />
              <View style={styles.textView}>
                <Text style={styles.labelText}>
                  সর্বশেষ পণ্য নেওয়ার তারিখ:{' '}
                </Text>
                <Text style={styles.valueText} numberOfLines={2}>
                  {dayjs(item.scanned_date)
                    .locale('bn-bd')
                    .format('DD  MMMM YY, A h:m')}
                </Text>
              </View>
              <View style={styles.textView}>
                <Text style={styles.labelText}>নেওয়া পণ্য: </Text>
                <Text style={styles.valueText} numberOfLines={3}>
                  {item.other_data?.product_lists
                    .map(
                      (list) =>
                        `${list.name} (${list.quantity} ${list.unit || ''})`
                    )
                    .join(', ')}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(index);
