import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';

import { waterMarkIcon } from 'constants/images';

interface Props {
  children: React.ReactNode;
}

const ScrollViewWithWaterMark: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={waterMarkIcon}
        style={styles.imageBackground}
        resizeMode="contain"
      >
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ScrollViewWithWaterMark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    backgroundAttachment: 'fixed',
  },
});
