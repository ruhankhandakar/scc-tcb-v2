import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES } from 'constants/theme';

import styles from './styles';

const Chart = () => {
  const data = [
    {
      value: 2500,
      frontColor: COLORS.chartPrimaryFrontColor,
      gradientColor: COLORS.chartPrimaryGradientColor,
      spacing: 6,
      label: 'জুন',
    },
    {
      value: 2000,
      frontColor: COLORS.chartSecondaryFrontColor,
      gradientColor: COLORS.chartSecondaryGradientColor,
    },
    {
      value: 3500,
      frontColor: COLORS.chartPrimaryFrontColor,
      gradientColor: COLORS.chartPrimaryGradientColor,
      spacing: 6,
      label: 'জুলাই',
    },
    {
      value: 3000,
      frontColor: COLORS.chartSecondaryFrontColor,
      gradientColor: COLORS.chartSecondaryGradientColor,
    },
    {
      value: 4500,
      frontColor: COLORS.chartPrimaryFrontColor,
      gradientColor: COLORS.chartPrimaryGradientColor,
      spacing: 6,
      label: 'অগাস্ট',
    },
    {
      value: 4000,
      frontColor: COLORS.chartSecondaryFrontColor,
      gradientColor: COLORS.chartSecondaryGradientColor,
    },

    {
      value: 5200,
      frontColor: COLORS.chartPrimaryFrontColor,
      gradientColor: COLORS.chartPrimaryGradientColor,
      spacing: 6,
      label: 'সেপ্টেম্বর',
    },
    {
      value: 4900,
      frontColor: COLORS.chartSecondaryFrontColor,
      gradientColor: COLORS.chartSecondaryGradientColor,
    },

    {
      value: 3000,
      frontColor: COLORS.chartPrimaryFrontColor,
      gradientColor: COLORS.chartPrimaryGradientColor,
      spacing: 6,
      label: 'অক্টোবর',
    },
    {
      value: 2800,
      frontColor: COLORS.chartSecondaryFrontColor,
      gradientColor: COLORS.chartSecondaryGradientColor,
    },
  ];

  return (
    <View style={styles.chartContainer}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(35, 43, 93, 0.8)', 'rgba(35, 43, 93, 0.8)']}
        style={styles.linearBackground}
      />
      <Text style={styles.chartHeading}>গত 6 মাসের</Text>
      <View
        style={{
          padding: SIZES.medium,
        }}
      >
        <BarChart
          data={data}
          barWidth={16}
          initialSpacing={10}
          spacing={14}
          barBorderRadius={4}
          showGradient
          yAxisThickness={0}
          xAxisType={'dashed'}
          xAxisColor={'lightgray'}
          yAxisTextStyle={{ color: 'lightgray' }}
          stepValue={1000}
          maxValue={6000}
          noOfSections={6}
          yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
          labelWidth={40}
          xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
          showLine
          lineConfig={{
            color: '#F29C6E',
            thickness: 3,
            curved: true,
            hideDataPoints: true,
            shiftY: 20,
            initialSpacing: -30,
          }}
        />
      </View>
      <View style={styles.chartLabelContainer}>
        <View style={{ flexDirection: 'row' }}>
          {/* @ts-ignore */}
          <View style={styles.boxStyle(COLORS.chartPrimaryFrontColor)} />
          <Text style={styles.chartTextStyle}>নিবন্ধিত উপকারভোগী</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {/* @ts-ignore */}
          <View style={styles.boxStyle(COLORS.chartSecondaryFrontColor)} />
          <Text style={styles.chartTextStyle}>সুবিধাপ্রাপ্ত উপকারভোগী</Text>
        </View>
      </View>
    </View>
  );
};

export default Chart;
