import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

import styles from './style';
import { COLORS } from 'constants/theme';

interface Props {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  handleClick: () => void;
  handleSearch?: () => Promise<void>;
  loading?: boolean;
}

const SearchBox: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  handleClick,
  loading = false,
  handleSearch,
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
          onSubmitEditing={handleSearch}
          placeholder="নাম, মোবাইল নাম্বার, জাতীয় পরিচয়পত্র ও পরিবার কার্ড নাম্বার দিয়ে সার্চ করুন"
        />
      </View>
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={handleClick}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator animating={true} color={COLORS.gray} />
        ) : (
          <AntDesign name="search1" size={24} color={COLORS.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;
