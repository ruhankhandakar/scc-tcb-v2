import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ScrollView,
  View,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useRoute } from '@react-navigation/native';

import { waterMarkIcon } from 'constants/images';
import { COLORS } from 'constants/theme';
import { Text } from 'react-native-paper';
import Footer from './Footer';

interface Props {
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

const ScrollViewWithWaterMark: React.FC<Props> = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const currentRoutePath = segments.join('/');
    // @ts-ignore
    router.replace(currentRoutePath);
    setRefreshing(false);
  }, [segments, router]);

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ minHeight: height - 100 }}>{children}</View>
          <View
            style={{
              marginBottom: 100,
            }}
          >
            <Footer />
          </View>
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
