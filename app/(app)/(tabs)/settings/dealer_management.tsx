import { StyleSheet, View } from 'react-native';

import Dealer from 'scenes/settings/Dealer';
import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import BackToSettings from 'components/settings/BackToSettings';

import { SIZES } from 'constants/theme';

const DealerManagement = () => {
  return (
    <ScrollViewWithWaterMark>
      <View style={styles.container}>
        <BackToSettings />
        <Dealer />
      </View>
    </ScrollViewWithWaterMark>
  );
};

export default DealerManagement;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    marginBottom: 100,
  },
});
