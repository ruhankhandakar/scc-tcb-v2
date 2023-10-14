import React from 'react';
import { Card } from 'react-native-paper';

import styles from './styles';
import { View } from 'react-native';

interface Props {
  children: JSX.Element | string;
  cardBackgroundColor?: string;
}

const CustomCard: React.FC<Props> = ({
  children,
  cardBackgroundColor = '',
}) => {
  return (
    // @ts-ignore
    <Card style={styles.cardContainer(cardBackgroundColor)}>
      <View style={styles.cardView}>{children}</View>
    </Card>
  );
};

export default CustomCard;
