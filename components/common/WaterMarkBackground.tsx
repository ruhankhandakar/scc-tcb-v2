import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  StatusBar,
  View,
  Dimensions,
} from 'react-native';

import ScrollViewComponent from './ScrollViewComponent';

import { waterMarkIcon } from 'constants/images';
import { COLORS } from 'constants/theme';
import Footer from './Footer';

const { height } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
}

const WaterMarkBackground: React.FC<Props> = ({ children }) => {
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
        <ScrollViewComponent showsVerticalScrollIndicator={false}>
          <View style={{ minHeight: height - 100 }}>{children}</View>
          <View
            style={{
              marginBottom: 100,
            }}
          >
            <Footer />
          </View>
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
