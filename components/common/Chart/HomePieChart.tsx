import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PieChart from 'react-native-pie-chart';

import { COLORS, SHADOWS, SIZES } from 'constants/theme';

const widthAndHeight = 200;

const sliceColor = [
  COLORS.chartPrimaryFrontColor,
  COLORS.chartSecondaryFrontColor,
];

interface Props {
  privilegedCustomer: number;
  registeredCustomer: number;
}

const HomePieChart = ({ privilegedCustomer, registeredCustomer }: Props) => {
  const series = [registeredCustomer, privilegedCustomer];

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
      />
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <View style={styles.box} />
          <Text style={styles.title}>নিবন্ধিত উপকারভোগী</Text>
        </View>
        <View style={styles.info}>
          <View
            style={[
              styles.box,
              { backgroundColor: COLORS.chartSecondaryFrontColor },
            ]}
          />
          <Text style={styles.title}>সুবিধাপ্রাপ্ত উপকারভোগী</Text>
        </View>
      </View>
    </View>
  );
};

export default HomePieChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.darkBlue,
    borderRadius: SIZES.medium,
    marginTop: SIZES.large,
    ...SHADOWS.medium,
    padding: SIZES.large,
  },
  infoContainer: {
    flex: 1,
    paddingTop: SIZES.large,
    width: '100%',
  },
  info: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 4,
  },
  title: {
    fontSize: SIZES.small + 1,
    color: COLORS.white,
  },
  box: {
    height: 16,
    width: 16,
    backgroundColor: COLORS.chartPrimaryFrontColor,
    borderRadius: 4,
  },
});
