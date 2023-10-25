import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ScrollView,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';

import { waterMarkIcon } from 'constants/images';
import { COLORS } from 'constants/theme';

interface Props {
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

const ScrollViewWithWaterMark: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={COLORS.darkBlue}
        barStyle="light-content"
        showHideTransition="fade"
      />
      <ImageBackground
        source={waterMarkIcon}
        style={styles.imageBackground}
        resizeMode="contain"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ minHeight: height - 100 }}>{children}</View>
        </ScrollView>
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
