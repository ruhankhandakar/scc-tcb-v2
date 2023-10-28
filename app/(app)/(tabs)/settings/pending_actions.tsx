import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import Actions from 'components/home/Actions';
import WaterMarkBackground from 'components/common/WaterMarkBackground';
import BackToSettings from 'components/settings/BackToSettings';

import { useBackEndContext } from 'context/BackEndContext';
import { COLORS, FONT, SIZES } from 'constants/theme';

import { ProfileData } from 'types/profile';
import CardSkeleton from 'components/common/CardSkeleton';

const PendingActions = () => {
  const [loading, setLoading] = useState(false);
  const [pendingDealerListData, setPendingDealerListData] = useState<
    ProfileData[]
  >([]);

  const {
    actions: { getPendingDealerList },
  } = useBackEndContext();

  const prepareData = async () => {
    setLoading(true);
    try {
      const pendingDealerData = await getPendingDealerList();
      setPendingDealerListData(pendingDealerData);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const filterPendingDealerListData = (id: number) => {
    const filteredData = pendingDealerListData.filter((item) => item.id !== id);
    setPendingDealerListData(filteredData);
  };

  useEffect(() => {
    prepareData();
  }, []);

  return (
    <WaterMarkBackground>
      <View style={styles.container}>
        <BackToSettings />
        {loading && <CardSkeleton />}
        {pendingDealerListData.length > 0 && !loading && (
          <Actions
            pendingDealerListData={pendingDealerListData}
            filterPendingDealerListData={filterPendingDealerListData}
          />
        )}
      </View>
    </WaterMarkBackground>
  );
};

export default PendingActions;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
  },
  adminFetchingDataText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
});
