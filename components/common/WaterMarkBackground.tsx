import React from 'react';
import { SafeAreaView, StyleSheet, ImageBackground } from 'react-native';

import ScrollViewComponent from './ScrollViewComponent';

import { waterMarkIcon } from 'constants/images';

interface Props {
  children: React.ReactNode;
}

const WaterMarkBackground: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={waterMarkIcon}
        style={styles.imageBackground}
        resizeMode="contain"
      >
        <ScrollViewComponent showsVerticalScrollIndicator={false}>
          {children}
        </ScrollViewComponent>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WaterMarkBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    backgroundAttachment: 'fixed',
  },
});
