import { Text, View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';

import { loadingLottie } from 'constants/lottie_files';
import { useAuth } from 'context/AuthContext';
import { useBackEndContext } from 'context/BackEndContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { session } = useAuth();
  const {
    state: { profile },
    actions: { updateState, getLoggedInUserProfileData },
  } = useBackEndContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      updateState('user', session.user);
      getLoggedInUserProfileData(session.user.id)
        .then((response) => {
          if (response?.length) {
            updateState('profile', response[0]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  const isOnBoardingPending = !profile || !profile.is_verified;
  const href = isOnBoardingPending ? '/on-boarding' : '/(app)/(tabs)/home';

  return (
    <ScrollViewWithWaterMark>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <AnimatedLottieView
            source={loadingLottie}
            autoPlay
            loop
            style={{
              height: 150,
              width: 150,
            }}
          />
        ) : (
          <Redirect href={href} />
        )}
      </View>
    </ScrollViewWithWaterMark>
  );
}
