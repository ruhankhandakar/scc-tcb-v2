import { StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from 'constants/theme';

const BackToSettings = () => {
  const router = useRouter();
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        router.replace('/settings/');
      }}
    >
      <AntDesign name="back" size={24} color={COLORS.secondary} />
      <Text style={styles.text}>Back to setting</Text>
    </Pressable>
  );
};

export default BackToSettings;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SIZES.medium,
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  text: {
    color: COLORS.secondary,
    fontFamily: FONT.medium,
    textDecorationLine: 'underline',
  },
});
