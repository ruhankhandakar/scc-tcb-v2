import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Entypo as Icon, MaterialIcons, AntDesign } from '@expo/vector-icons';

import { COLORS } from 'constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          height: 72,
          elevation: 0,
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Tabs.Screen
        name="details"
        options={{
          title: '',
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTopColor: focused ? COLORS.primary : COLORS.white,
                  borderTopWidth: 2,
                }}
              >
                <Icon
                  name="home"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />

                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? COLORS.primary : COLORS.gray,
                  }}
                >
                  হোম
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTopColor: focused ? COLORS.primary : COLORS.white,
                  borderTopWidth: 2,
                  minWidth: 60,
                }}
              >
                <MaterialIcons
                  name="dashboard"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />

                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? COLORS.primary : COLORS.gray,
                  }}
                >
                  ড্যাশবোর্ড
                </Text>
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  width: Platform.OS == 'ios' ? 50 : 60,
                  height: Platform.OS == 'ios' ? 50 : 60,
                  top: Platform.OS == 'ios' ? -10 : -20,
                  borderRadius: Platform.OS == 'ios' ? 25 : 30,
                }}
              >
                <MaterialIcons
                  name="qr-code-scanner"
                  size={24}
                  color={COLORS.white}
                />
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTopColor: focused ? COLORS.primary : COLORS.white,
                  borderTopWidth: 2,
                  minWidth: 60,
                }}
              >
                <Icon
                  name="help"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />

                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? COLORS.primary : COLORS.gray,
                  }}
                >
                  ই-সেবা
                </Text>
              </View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        getId={({}) => new Date().getTime().toString()}
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTopColor: focused ? COLORS.primary : COLORS.white,
                  borderTopWidth: 2,
                  minWidth: 60,
                }}
              >
                <AntDesign
                  name="user"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: focused ? COLORS.primary : COLORS.gray,
                  }}
                >
                  প্রোফাইল
                </Text>
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
}
