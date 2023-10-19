import React from 'react';
import { Card } from 'react-native-paper';

import styles from './styles';
import { View } from 'react-native';

interface Props {
  children: JSX.Element | string;
  cardBackgroundColor?: string;
  cardContainerStyle?: any;
}

const CustomCard: React.FC<Props> = ({
  children,
  cardBackgroundColor = '',
  cardContainerStyle = {},
}) => {
  return (
    <Card
      // @ts-ignore
      style={[styles.cardContainer(cardBackgroundColor), cardContainerStyle]}
    >
      <View style={styles.cardView}>{children}</View>
    </Card>
  );
};

export default CustomCard;
