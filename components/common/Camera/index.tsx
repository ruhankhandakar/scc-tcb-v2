import React, { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

import styles from './style';
import { COLORS, SIZES } from 'constants/theme';
import { useAppContext } from 'context/AppContext';
import { router } from 'expo-router';

interface Props {
  cameraType: CameraType | number | undefined;
  keyName: string;
}

const CameraCapture: React.FC<Props> = ({ cameraType = 'back', keyName }) => {
  const [type, setType] = useState(cameraType);
  const [permission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState();
  const [capturedImage, setCapturedImage] = useState('');
  const {
    action: { handleUpdateData },
  } = useAppContext();

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    if (camera) {
      // @ts-ignore
      const data = await camera.takePictureAsync(null);
      const imageUri = data.uri;
      setCapturedImage(imageUri);
    }
  };

  if (!permission) {
    return (
      <View style={styles.areaViewContainer}>
        <View style={{ ...styles.flexCenter, marginTop: SIZES.medium }}>
          <Text variant="headlineLarge" style={styles.accessBtn}>
            Requesting for camera permission
          </Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.areaViewContainer}>
        <View style={styles.flexCenter}>
          <Text variant="headlineLarge" style={styles.accessBtn}>
            No Access To Camera
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
      ) : (
        <Camera
          style={styles.camera}
          // @ts-ignore
          type={type}
          // @ts-ignore
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: SIZES.medium,
          marginBottom: SIZES.medium,
          flexDirection: 'row',
          gap: SIZES.small,
        }}
      >
        <Button
          mode="contained"
          onPressIn={() => {
            if (capturedImage) {
              handleUpdateData({
                [keyName]: capturedImage,
              });
              router.back();
            } else {
              takePicture();
            }
          }}
          icon={capturedImage ? 'file' : 'camera'}
          style={{
            width: 150,
            padding: SIZES.medium,
            borderRadius: SIZES.small,
          }}
        >
          {capturedImage ? 'Save' : 'Capture'}
        </Button>
        {capturedImage ? (
          <Button
            mode="outlined"
            onPressIn={() => {
              setCapturedImage('');
            }}
            icon="camera"
            style={{
              width: 150,
              padding: SIZES.medium,
              borderRadius: SIZES.small,
            }}
            buttonColor={COLORS.tertiaryContainer}
            textColor={COLORS.darkBlue}
          >
            Re take
          </Button>
        ) : null}
      </View>
    </View>
  );
};

export default CameraCapture;
