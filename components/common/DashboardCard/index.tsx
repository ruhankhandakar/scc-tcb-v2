import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Image } from 'expo-image';

import styles from './style';
import { placeholderUser } from 'constants/icons';

interface Props {
  item: {
    id: number;
    headFamilyName: string;
    fatherOrHusbandName: string;
    mobileNumber: string;
    nidNumber: string;
    address: string;
  };
  handleNavigate: () => void;
}

const index: React.FC<Props> = ({ item, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <View style={styles.leftContainer}>
        <Image
          source={placeholderUser}
          contentFit="cover"
          style={styles.logoImage}
        />

        <View style={styles.textViewsContainer}>
          <View style={styles.textView}>
            <Text style={styles.labelText}>পরিবার প্রধানের নাম: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.headFamilyName}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>পিতা/স্বামীর নাম: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.fatherOrHusbandName}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.textView}>
            <Text style={styles.labelText}>মোবাইল নম্বর: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.mobileNumber}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>জাতীয় পরিচয়পত্র নম্বর: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.nidNumber}
            </Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.labelText}>ঠিকানা: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default index;
