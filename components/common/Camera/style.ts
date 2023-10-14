import { COLORS, SIZES } from 'constants/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  areaViewContainer: {
    flex: 1,
    paddingBottom: SIZES.xxLarge,
    paddingTop: SIZES.xxLarge,
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessBtn: {
    color: COLORS.error,
    fontSize: SIZES.large - 2,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
});

export default styles;
