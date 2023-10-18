import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import type { User } from '@supabase/supabase-js';
import { Button } from 'react-native-paper';

import { COLORS, FONT, SIZES } from 'constants/theme';

const deviceHeight = Dimensions.get('window').height;

type Props = {
  signOut: () => void;
  user: User | null;
};

const Customer = ({ user, signOut }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        আপনার ইমেইল {'\n'}
        {user?.email} {'\n'}
        আমাদের database এ যুক্ত নেই {'\n'} সিলেট সিটি কর্পোরেশনে যোগাযোগ করুন
      </Text>
      <Button mode="contained" style={styles.btn} onPress={signOut}>
        Log out
      </Button>
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight - 100,
  },
  textStyle: {
    paddingHorizontal: SIZES.xLarge,
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  btn: {
    marginTop: SIZES.xLarge,
  },
});
