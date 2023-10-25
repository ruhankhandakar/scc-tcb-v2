import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS, FONT, SIZES } from 'constants/theme';

interface Props {
  selectedTab: string;
  setSelectedTab: (text: 'first' | 'second') => void;
}

const CustomerTab = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.tab,
          selectedTab === 'first' && styles.activeTab,
          styles.firstTab,
        ]}
        onPress={() => {
          setSelectedTab('first');
        }}
      >
        <Text
          style={[styles.text, selectedTab === 'first' && styles.activeText]}
        >
          নিবন্ধিত উপকারভোগী
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tab,
          selectedTab === 'second' && styles.activeTab,
          styles.secondTab,
        ]}
        onPress={() => {
          setSelectedTab('second');
        }}
      >
        <Text
          style={[styles.text, selectedTab === 'second' && styles.activeText]}
        >
          সুবিধাপ্রাপ্ত উপকারভোগী
        </Text>
      </Pressable>
    </View>
  );
};

export default CustomerTab;

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
    width: '100%',
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderColor: COLORS.primary,
  },
  firstTab: {
    borderTopLeftRadius: SIZES.small,
    borderBottomLeftRadius: SIZES.small,
  },
  secondTab: {
    borderTopRightRadius: SIZES.small,
    borderBottomRightRadius: SIZES.small,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 1,
    color: COLORS.gray,
  },
  activeText: {
    color: COLORS.primary,
  },
});
