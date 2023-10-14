import React from 'react';
import { View, Text } from 'react-native';

import styles from './style';

interface Props {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  borderPosition?: 'top' | 'bottom' | 'both' | '';
  rightIcon?: React.ReactNode;
  numberOfLines?: number;
}

const ListCard: React.FC<Props> = ({
  icon,
  label,
  value,
  borderPosition,
  rightIcon,
  numberOfLines = 1,
}) => {
  return (
    // @ts-ignore
    <View style={styles.container(borderPosition)}>
      <View style={styles.leftContainer}>
        {icon}
        <Text style={styles.text}>{label}</Text>
      </View>
      <View style={styles.rightContainer}>
        {!!value && (
          <Text style={styles.valueText} numberOfLines={numberOfLines}>
            {value}
          </Text>
        )}
        {rightIcon}
      </View>
    </View>
  );
};

export default ListCard;
