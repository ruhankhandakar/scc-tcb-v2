import { Image } from 'expo-image';
import React, { useState } from 'react';
import { TouchableOpacity, View, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

import styles from './styles';
import { COLORS, SIZES } from 'constants/theme';
import ListCard from 'components/common/ListCard';
import { useAppContext } from 'context/AppContext';
import { useBackEndContext } from 'context/BackEndContext';
import { placeholderUser } from 'constants/icons';
import { SelectedProfileData } from 'types/profile';

interface Props {
  isReadOnly?: boolean;
  isEditAccess?: boolean;
  selectedProfile: SelectedProfileData | null;
}

const UserDetails: React.FC<Props> = ({
  isReadOnly,
  isEditAccess = true,
  selectedProfile,
}) => {
  const {
    action: { handleUpdateData },
  } = useAppContext();
  const {
    actions: { signOut, downloadFile },
  } = useBackEndContext();

  const [downloadingFile, setDownloadingFile] = useState('');

  const handleDownload = async (fileName: string, filePath: string) => {
    setDownloadingFile(fileName);
    const url = await downloadFile(filePath);
    if (url) {
      await Linking.openURL(url);
    }
    setDownloadingFile('');
  };

  if (!selectedProfile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              selectedProfile.profile_picture ||
              selectedProfile.profile_pic ||
              placeholderUser
            }
            cachePolicy="none"
            contentFit="cover"
            style={styles.profileImage}
          />
        </View>
        <Text variant="displayMedium" style={styles.userTitle}>
          {selectedProfile.first_name} {selectedProfile.last_name}{' '}
          {selectedProfile.name}
        </Text>
        {selectedProfile.date_of_birth ? (
          <Text variant="bodyMedium" style={styles.userDob}>
            Date of birth - {selectedProfile.date_of_birth}
          </Text>
        ) : null}
        {selectedProfile.customer_id ? (
          <Text variant="bodyMedium" style={styles.userDob}>
            পরিবার কার্ড নাম্বার - {selectedProfile.customer_id}
          </Text>
        ) : null}
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
          {!!selectedProfile.email && (
            <ListCard
              label="ইমেইলঃ"
              value={selectedProfile.email}
              icon={
                <MaterialIcons
                  name="email"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              numberOfLines={2}
            />
          )}
          {!!selectedProfile.gurdian_name && (
            <ListCard
              label="পরিবার প্রধানের নামেঃ"
              value={selectedProfile.gurdian_name}
              icon={
                <AntDesign
                  name="user"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              numberOfLines={2}
            />
          )}
          {selectedProfile.phone_number && (
            <ListCard
              label="মোবাইলঃ"
              value={`+${selectedProfile.phone_number}`}
              icon={
                <MaterialIcons
                  name="phone"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
            />
          )}
          {!!selectedProfile.document_proof_number && (
            <ListCard
              label={selectedProfile.document_proof_name || 'NID নাম্বার' + 'ঃ'}
              value={selectedProfile.document_proof_number}
              icon={
                <Octicons
                  name="number"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
            />
          )}
          {!!selectedProfile.customer_id && (
            <ListCard
              label="পরিবার card নাম্বারঃ"
              value={selectedProfile.customer_id.toString()}
              icon={
                <Octicons
                  name="number"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
            />
          )}
          {!!selectedProfile?.foundation_name && (
            <ListCard
              label="ব্যবসা প্রতিষ্ঠানের নামঃ"
              value={selectedProfile?.foundation_name}
              icon={
                <Octicons
                  name="number"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
            />
          )}
          {(selectedProfile?.ward || selectedProfile?.address) && (
            <ListCard
              label="ঠিকানাঃ"
              value={`${selectedProfile?.wards?.name} ${
                selectedProfile?.address ? `, ${selectedProfile?.address}` : ``
              }`}
              icon={
                <Entypo
                  name="location"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              numberOfLines={2}
            />
          )}
        </View>
      </View>

      <View style={styles.utilitiesContainer}>
        <View style={styles.personalInformationTitleView}>
          <Text variant="headlineSmall" style={styles.personalInformationText}>
            Utilites
          </Text>
        </View>
        <View>
          {!!selectedProfile.document_proof_link && (
            <ListCard
              label="NID কার্ডঃ"
              icon={
                <Feather
                  name="image"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <View style={styles.multiDocsContainer}>
                  {selectedProfile.document_proof_link.map(
                    (pathName, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleDownload(`nidDocument_${index}`, pathName);
                        }}
                        key={pathName}
                        style={styles.utilsIcon}
                      >
                        {downloadingFile === `nidDocument_${index}` ? (
                          <ActivityIndicator
                            animating={true}
                            color={COLORS.white}
                            size="small"
                          />
                        ) : (
                          <Feather
                            name="download"
                            size={SIZES.large}
                            color={COLORS.lightWhite}
                          />
                        )}
                      </TouchableOpacity>
                    )
                  )}
                </View>
              }
            />
          )}
          {!!selectedProfile.deo_documents && (
            <ListCard
              label="DEO কার্ডঃ"
              icon={
                <Feather
                  name="image"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <View style={styles.multiDocsContainer}>
                  {selectedProfile.deo_documents.map((link, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        handleDownload(`deoDocument_${index}`, link);
                      }}
                      key={link}
                      style={styles.utilsIcon}
                    >
                      {downloadingFile === `deoDocument_${index}` ? (
                        <ActivityIndicator
                          animating={true}
                          color={COLORS.white}
                          size="small"
                        />
                      ) : (
                        <Feather
                          name="download"
                          size={SIZES.large}
                          color={COLORS.lightWhite}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              }
            />
          )}
          {!!selectedProfile.family_card && (
            <ListCard
              label="TCB কার্ডঃ"
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
                    handleDownload(`tcbCard_0`, selectedProfile.family_card!);
                  }}
                  style={styles.utilsIcon}
                >
                  {downloadingFile === `tcbCard_0` ? (
                    <ActivityIndicator
                      animating={true}
                      color={COLORS.white}
                      size="small"
                    />
                  ) : (
                    <Feather
                      name="download"
                      size={SIZES.large}
                      color={COLORS.lightWhite}
                    />
                  )}
                </TouchableOpacity>
              }
            />
          )}

          {!isReadOnly && (
            <ListCard
              label="সাহায্য/রিপোর্টঃ"
              icon={
                <Foundation
                  name="foundation"
                  size={SIZES.medium}
                  color={COLORS.lightWhite}
                />
              }
              rightIcon={
                <TouchableOpacity onPress={() => {}} style={styles.utilsIcon}>
                  <AntDesign
                    name="right"
                    size={SIZES.large}
                    color={COLORS.lightWhite}
                  />
                </TouchableOpacity>
              }
            />
          )}
          {!isReadOnly && (
            <ListCard
              label="লগ আউটঃ"
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
                    signOut();
                  }}
                  style={styles.utilsIcon}
                >
                  <AntDesign
                    name="logout"
                    size={SIZES.large}
                    color={COLORS.lightWhite}
                  />
                </TouchableOpacity>
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default UserDetails;
