import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const storeData = async (keyName: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(keyName, jsonValue);
  } catch (e) {
    Alert.alert('Storing failed');
  }
};

export const getData = async (keyName: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(keyName);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert('Fetching failed');
  }
};
