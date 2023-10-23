import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

import { COLORS, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';
import { bytesToKB } from 'utils';
import { FileUploadDocumentKeyName } from 'types';
import { MAX_FILE_SIZE } from 'constants/data';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  toggleModal: () => void;
  multiple?: boolean;
  type?: string[];
  maxFileSize?: number;
  numberOfFilesAllowedFromFilePicker?: number;
  pathName?: string;
  keyName?: string;
  handleSubmit: (
    documentKeyName: FileUploadDocumentKeyName,
    params: DocumentPicker.DocumentPickerAsset[]
  ) => void;
  documentKeyName: FileUploadDocumentKeyName;
}

const FileUploadModal = ({
  visible,
  toggleModal,
  multiple = false,
  type = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/*',
  ],
  maxFileSize = MAX_FILE_SIZE,
  numberOfFilesAllowedFromFilePicker = 2,
  pathName,
  keyName,
  handleSubmit,
  documentKeyName,
}: Props) => {
  const router = useRouter();

  const {
    state,
    action: { handleErrorMessage, handleUpdateData },
  } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

  const handleCameraPress = () => {
    // @ts-ignore
    router.push({
      pathname: pathName,
      params: {
        key: keyName,
      },
    });
  };

  const handleFilePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type,
        multiple,
      });

      const files = result.assets || [];

      if (files?.length === numberOfFilesAllowedFromFilePicker) {
        let errorFileNames: string[] = [];

        files.forEach((file) => {
          if (file.size! > maxFileSize) {
            errorFileNames.push(file.name);
          }
        });

        if (errorFileNames.length) {
          handleErrorMessage(
            `${errorFileNames.join(', ')} ফাইলর সাইজ ${bytesToKB(
              maxFileSize
            )} এর থেকে বেশি`
          );
        } else {
          setSelectedFiles(files);
        }
      } else {
        handleErrorMessage(
          `শুধুমাত্র ${numberOfFilesAllowedFromFilePicker} ফাইল সিলেক্ট করুন`
        );
      }
    } catch (error) {}
  };

  const handleSave = () => {
    let payload: DocumentPicker.DocumentPickerAsset[] = [];

    if (keyName && state[keyName]) {
      payload = [
        {
          uri: state[keyName],
          name: `uploaded_file_${new Date().toDateString()}.png`,
        },
      ];
    }

    if (selectedFiles.length) {
      payload = selectedFiles;
    }

    handleSubmit(documentKeyName, payload);
    toggleModal();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      animationOutTiming={100}
      backdropOpacity={0.5}
    >
      <View style={styles.modalView}>
        <View style={styles.childrenContainer}>
          <Pressable
            style={styles.btn}
            onPress={handleCameraPress}
            android_ripple={{
              color: COLORS.gray2,
              borderless: true,
              radius: 50,
              foreground: true,
            }}
          >
            <Entypo name="camera" size={SIZES.xxLarge} color={COLORS.white} />
          </Pressable>
          <Text style={{ color: COLORS.gray }}>OR</Text>
          <Pressable
            style={styles.btn}
            onPress={handleFilePress}
            android_ripple={{
              color: COLORS.gray2,
              borderless: true,
              radius: 50,
              foreground: true,
            }}
          >
            <AntDesign name="filetext1" size={30} color={COLORS.white} />
          </Pressable>
        </View>
        <Button
          mode="contained-tonal"
          buttonColor={COLORS.darkBlue}
          textColor={COLORS.white}
          style={styles.saveBtn}
          onPress={handleSave}
        >
          Save
        </Button>
        {!!keyName && !!state[keyName] && (
          <View style={styles.fileNamesContainer}>
            <Pressable
              style={styles.file}
              onPress={() => {
                console.log('delete');
                handleUpdateData({
                  [keyName]: null,
                });
              }}
            >
              <Text>captured_file.png</Text>
              <Feather name="trash-2" size={24} color={COLORS.error} />
            </Pressable>
          </View>
        )}
        {selectedFiles.length > 0 && (
          <View style={styles.fileNamesContainer}>
            {selectedFiles.map((file) => (
              <Pressable key={file.uri} style={styles.file}>
                <Text>{file.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default FileUploadModal;

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 50,
    minHeight: 200,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    width: 80,
    borderRadius: 8,
  },
  saveBtn: {
    width: 150,
    marginTop: SIZES.xLarge,
  },
  fileNamesContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: SIZES.medium,
  },
  file: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
});
