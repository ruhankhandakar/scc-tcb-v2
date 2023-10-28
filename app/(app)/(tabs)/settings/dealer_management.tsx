import { StyleSheet, View } from 'react-native';

import Dealer from 'scenes/settings/Dealer';
import WaterMarkBackground from 'components/common/WaterMarkBackground';
import BackToSettings from 'components/settings/BackToSettings';

import { SIZES } from 'constants/theme';

const DealerManagement = () => {
  return (
    <WaterMarkBackground>
      <View style={styles.container}>
        <BackToSettings />
        <Dealer />
      </View>
    </WaterMarkBackground>
  );
};

export default DealerManagement;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    marginBottom: 100,
  },
});
