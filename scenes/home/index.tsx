import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

import Dealer from './Dealer';
import Admin from './Admin';
import Customer from './Customer';

import { useBackEndContext } from 'context/BackEndContext';
import type { ROLE } from 'types/profile';
import styles from './styles';

const HomePage = () => {
  const {
    state: { profile, loading, user },
    actions: { signOut },
  } = useBackEndContext();

  if (loading) {
    return (
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    );
  }

  const role = profile?.user_role;

  if (role === 'DEALER') {
    return <Dealer />;
  }

  if (role === 'ADMIN') {
    return <Admin />;
  }

  return <Customer user={user} signOut={signOut} />;
};

export default React.memo(HomePage);
