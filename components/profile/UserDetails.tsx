import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

import styles from './styles';
import { COLORS, SIZES } from 'constants/theme';
import ListCard from 'components/common/ListCard';
import { useAppContext } from 'context/AppContext';

interface Props {
  isReadOnly?: boolean;
  isEditAccess?: boolean;
}

const UserDetails: React.FC<Props> = ({ isReadOnly, isEditAccess = true }) => {
  const {
    action: { handleUpdateData },
  } = useAppContext();
  const userDetails = {};

  const tcbCard = 'avail'; // TODO: fetch from API

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri:
                userDetails?.profilePic ||
                'https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png',
            }}
            contentFit="cover"
            style={styles.profileImage}
          />
        </View>
        <Text variant="displayMedium" style={styles.userTitle}>
          Niaz Morshed
        </Text>
        <Text variant="bodyMedium" style={styles.userDob}>
          Date of birth - Jan, 1995
        </Text>
      </View>
      <View style={styles.personalInformationContainer}>
        <View style={styles.personalInformationTitleView}>
          <Text variant="headlineSmall" style={styles.personalInformationText}>
            Personal Information
          </Text>
          {isEditAccess && (
            <TouchableOpacity
              style={styles.personalInformationEditWrapper}
              onPress={() => {
                handleUpdateData({
                  isShowRegistrationForm: true,
                });
              }}
            >
              <Entypo name="pencil" size={16} color={COLORS.darkBlue} />
              <Text style={styles.personalInformationText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <ListCard
            label="ইমেইল"
            value="niaz@morshed.com"
            icon={
              <MaterialIcons
                name="email"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
            borderPosition="top"
            numberOfLines={2}
          />
          <ListCard
            label="মোবাইল"
            value="0172476-7477"
            icon={
              <MaterialIcons
                name="phone"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
          />
          <ListCard
            label="NID নাম্বার"
            value="4648798868"
            icon={
              <Octicons
                name="number"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
          />
          <ListCard
            label="ফাউন্ডেশন নাম"
            value="জানিনা ফাউন্ডেশন"
            icon={
              <Octicons
                name="number"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
          />
          <ListCard
            label="ঠিকানা"
            value="ওয়ার্ড ১, মিয়া ফাজিল চিস্ত, ১৯৯ শুভেচ্ছা"
            icon={
              <Entypo
                name="location"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
            borderPosition="bottom"
            numberOfLines={2}
          />
        </View>
      </View>
      <View style={styles.utilitiesContainer}>
        <View style={styles.personalInformationTitleView}>
          <Text variant="headlineSmall" style={styles.personalInformationText}>
            Utilites
          </Text>
        </View>
        <View>
          {!isReadOnly && (
            <ListCard
              label="লগ আউট"
              icon={
                <SimpleLineIcons
                  name="logout"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    console.log('logout');
                  }}
                >
                  <AntDesign
                    name="right"
                    size={SIZES.medium}
                    color={COLORS.lightWhite}
                  />
                </TouchableOpacity>
              }
              borderPosition="top"
            />
          )}
          <ListCard
            label="NID কার্ড"
            icon={
              <Feather
                name="image"
                size={SIZES.medium}
                color={COLORS.lightWhite}
              />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  console.log('downloading');
                }}
              >
                <Feather
                  name="download"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity>
            }
            borderPosition={isReadOnly ? 'both' : ''}
          />
          {!!tcbCard && (
            <ListCard
              label="TCB কার্ড"
              icon={
                <Feather
                  name="image"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    console.log('downloading');
                  }}
                >
                  <Feather
                    name="download"
                    size={SIZES.medium}
                    color={COLORS.lightWhite}
                  />
                </TouchableOpacity>
              }
              borderPosition={isReadOnly ? 'both' : ''}
            />
          )}

          {!isReadOnly && (
            <ListCard
              label="সাহায্য/রিপোর্ট"
              icon={
                <Foundation
                  name="foundation"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => {
                    console.log('logout');
                  }}
                >
                  <AntDesign
                    name="right"
                    size={SIZES.medium}
                    color={COLORS.lightWhite}
                  />
                </TouchableOpacity>
              }
              borderPosition="bottom"
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default UserDetails;
