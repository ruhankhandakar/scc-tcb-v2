import { SIZES } from 'constants/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  sceneContainer: {
    flex: 1,
    padding: SIZES.medium,
    marginBottom: 100,
  },
});

export default styles;
