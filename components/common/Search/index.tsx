import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import styles from './style';
import { searchIcon } from 'constants/icons';
import { COLORS } from 'constants/theme';

interface Props {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  handleClick: () => void;
}

const SearchBox: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  handleClick,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          placeholder="মোবাইল ও জাতীয় পরিচয়পত্র নাম্বার দিয়ে সার্চ করুন"
        />
      </View>
      <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
        <AntDesign name="search1" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;
