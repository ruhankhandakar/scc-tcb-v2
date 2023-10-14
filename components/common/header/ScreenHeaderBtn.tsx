import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import styles from './screenheader.style';

interface Props {
  iconUrl: string;
  dimension: string;
  handlePress?: () => void;
}

const ScreenHeaderBtn: React.FC<Props> = ({
  iconUrl,
  dimension,
  handlePress,
}) => {
  const onPress = () => {
    if (handlePress) {
      handlePress();
    }
  };
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
      <Image
        // @ts-ignore
        source={iconUrl}
        resizeMode="cover"
        // @ts-ignore
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
