import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Card from './Card';

import type { IWards } from 'types';
import styles from './styles';
import { COLORS } from 'constants/theme';

interface Props {
  data: IWards[];
}

const WardDealerList = ({ data }: Props) => {
  return (
    <View>
      <Card
        cardContainerStyle={styles.wardDealerListContainer}
        cardBackgroundColor="#fff"
      >
        {/* @ts-ignore */}
        {data.map((item) => (
          <View key={item.id} style={styles.wardDealerListCardContainer}>
            <View style={styles.headingView}>
              <EvilIcons name="location" size={20} color="black" />
              <Text style={styles.headingViewText}>{item.name}</Text>
            </View>
            {item.profiles.length ? (
              item.profiles.map((profile) => (
                <TouchableOpacity style={styles.dealerView} key={profile.id}>
                  <View style={styles.dealerLeftView}>
                    <AntDesign name="user" size={12} color={COLORS.gray} />
                    <Text style={styles.dealerViewText}>
                      {profile.first_name} {profile.last_name}
                    </Text>
                  </View>
                  <AntDesign
                    name="arrowright"
                    size={16}
                    color={COLORS.primary}
                    style={styles.arrowRight}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.dealerView}>
                <Text style={styles.dealerViewEmptyText}>
                  এই ওয়ার্ড এর জন্য কোন ডিলার যুক্ত নেই
                </Text>
              </View>
            )}
          </View>
        ))}
      </Card>
    </View>
  );
};

export default WardDealerList;
