import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

import RegisterComponent from 'components/auth/RegisterComponent';
import { useAppContext } from 'context/AppContext';
import { COLORS, SIZES } from 'constants/theme';
import { UpdateParams } from 'utils/types';
import { useBackEndContext } from 'context/BackEndContext';
import { getExtensionFromUrl } from 'utils';
import { PUBLIC_BUCKET_NAME } from 'constants/supabase';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';

const registration = () => {
  const {
    action: { handleUpdateData },
  } = useAppContext();
  const {
    state: { user },
    actions: {
      storeFileInBucketAndReturnPublicUrl,
      updateProfile,
      updateUser,
      signOut,
    },
  } = useBackEndContext();
  const { handleRefresh } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (params: UpdateParams) => {
    setLoading(true);
    const payload: Partial<UpdateParams> = {
      profile_picture: params.profilePicture?.uri,
      first_name: params.firstName,
      last_name: params.lastName,
      foundation_name: params.foundation_name,
    };
    if (params.password) {
      const updateRes = await updateUser({
        password: params.password,
      });
      if (updateRes.success) {
        signOut();
      }
    }
    if (params.profilePicture?.uri.startsWith('file://')) {
      const response = await storeFileInBucketAndReturnPublicUrl({
        fileURI: params.profilePicture.uri,
        contentType: params.profilePicture.mimeType || 'image/png',
        folderName: 'profilePicture',
        filePath: `${user!.phone}_profilePicture.${getExtensionFromUrl(
          params.profilePicture.uri
        )}`,
        keyName: 'profilePicture',
        bucketName: PUBLIC_BUCKET_NAME,
        isPublic: true,
      });
      if (response.pathName) {
        payload.profile_picture = response.pathName;
      }
    }

    const response = await updateProfile(user?.id!, payload);
    if (response.success) {
      handleRefresh();
      handleUpdateData({
        isShowRegistrationForm: false,
      });
      router.replace('/');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handleUpdateData({
            isShowRegistrationForm: false,
          });
        }}
        style={styles.backBtn}
      >
        <AntDesign name="back" size={30} color={COLORS.black} />
      </TouchableOpacity>
      <RegisterComponent
        containerStyle={{
          marginTop: 0,
          paddingTop: 0,
        }}
        isEditing
        handleUpdate={handleUpdate}
        isUpdating={loading}
      />
    </View>
  );
};

export default registration;

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  backBtn: {
    padding: 20,
    paddingBottom: 0,
  },
});
