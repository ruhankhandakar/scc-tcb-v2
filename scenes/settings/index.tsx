import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, FONT, SIZES } from 'constants/theme';

const settings = [
  {
    router: '/settings/dealer_management',
    text: 'ডিলার ব্যাবস্থপনাঃ',
    icon: (
      <Feather
        name="users"
        size={SIZES.large}
        color={COLORS.tertiary}
        style={{ fontFamily: FONT.bold }}
      />
    ),
  },
  {
    router: '/settings/pending_actions',
    text: 'পেন্ডিং কাজ',
    icon: (
      <MaterialIcons
        name="pending-actions"
        size={SIZES.large}
        color={COLORS.tertiary}
        style={{ fontFamily: FONT.bold }}
      />
    ),
  },
];

const Settings = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* <Dealer /> */}

      {settings.map((setting) => (
        <Pressable
          key={setting.router}
          style={styles.listContainer}
          onPress={() => {
            // @ts-ignore
            router.push(setting.router);
          }}
        >
          <View style={styles.textContainer}>
            {setting.icon}
            <Text style={styles.listItemText}>{setting.text}</Text>
          </View>
          <View>
            <AntDesign name="arrowright" size={24} color={COLORS.primary} />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    paddingLeft: SIZES.xLarge,
    paddingRight: SIZES.xLarge,
    marginBottom: 100,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: 5,
    borderRadius: 5,
    marginBottom: SIZES.medium,
  },
  textContainer: {
    flexDirection: 'row',
    gap: SIZES.small,
    alignItems: 'center',
  },
  listItemText: {
    color: COLORS.tertiary,
    fontFamily: FONT.bold,
  },
});
