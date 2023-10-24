import { StyleSheet } from 'react-native';

import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';
import RegisterComponent from 'components/auth/RegisterComponent';

const register = () => {
  return (
    <>
      <ScrollViewWithWaterMark>
        <RegisterComponent />
      </ScrollViewWithWaterMark>
    </>
  );
};

export default register;

const styles = StyleSheet.create({});
