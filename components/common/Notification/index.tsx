import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from 'constants/theme';
import { Badge } from 'react-native-paper';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useRouter } from 'expo-router';

import { storeData } from 'lib/storage';
import { useBackEndContext } from 'context/BackEndContext';
import { PendingTasksType } from 'utils/types';

const Notification = () => {
  const router = useRouter();

  const {
    state: { profile },
    actions: { getAnyPendingTasks },
  } = useBackEndContext();

  const [notifications, setNotifications] = useState<PendingTasksType[]>([]);

  const userRole = profile?.user_role || 'DEALER';

  const prepareNotification = async () => {
    // * 1 first get notification data from DB
    const response = await getAnyPendingTasks();
    const totalNotification = response.length;

    // * 2 Update local storage
    await storeData('notification_count', totalNotification);

    // * 3 Update local state
    setNotifications(response);
  };

  const handleNotificationSelect = async (id: string, route: string) => {
    const updatedNotificationCount = notifications.length - 1;
    // * 1 Update local storage - by removing one
    await storeData('notification_count', updatedNotificationCount);

    // * 2 Update local state
    setNotifications((prevState) =>
      prevState.filter((notification) => notification.id !== id)
    );

    // * 3 redirect to particular page - based on notification
    // @ts-ignore
    router.push(route);
  };

  useEffect(() => {
    if (userRole === 'ADMIN') {
      prepareNotification();
    }
  }, [userRole]);

  const notificationCount = notifications.length;

  if (!notificationCount || userRole !== 'ADMIN') return null;

  return (
    <Menu>
      <MenuTrigger>
        <Ionicons
          name="notifications-circle"
          size={40}
          color={COLORS.primary}
        />
        <Badge style={styles.badge} size={18}>
          {notificationCount}
        </Badge>
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={styles.menuOption}>
        {notifications.map((notification) => (
          <MenuOption
            onSelect={() => {
              handleNotificationSelect(notification.id, notification.route);
            }}
            key={notification.id}
          >
            <Text style={styles.menuText}>
              {notification.text} - {notification.count}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default React.memo(Notification);

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 4,
    right: -4,
    color: COLORS.white,
    backgroundColor: COLORS.error,
  },
  menuOption: {
    backgroundColor: COLORS.white,
    marginTop: 50,
    width: 'auto',
    minWidth: 100,
    borderRadius: SIZES.xSmall,
    padding: SIZES.small,
  },
  menuText: {
    color: '#a47e1b',
    fontFamily: FONT.bold,
    fontSize: SIZES.medium - 3,
  },
});
