import { StyleSheet, View } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { COLORS, SIZES } from 'constants/theme';

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const CardSkeleton = () => {
  const colorMode = 'dark';

  return (
    <View>
      <MotiView
        transition={{
          type: 'timing',
          loop: true,
        }}
        style={[styles.container, styles.padded]}
        animate={{ backgroundColor: COLORS.white }}
      >
        <Skeleton colorMode={colorMode} radius="round" height={75} width={75} />
        <Spacer />
        <Skeleton colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
      </MotiView>
    </View>
  );
};

export default CardSkeleton;

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: SIZES.medium,
  },
  padded: {
    padding: 16,
  },
});
