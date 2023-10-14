import React from 'react';
import { View, Text } from 'react-native';

import Dealer from './Dealer';
import Admin from './Admin';
import Customer from './Customer';

import type { ROLE } from 'utils/types';

const HomePage = () => {
  const role: ROLE = 'DEALER';
  // TODO: Based on role render different home page

  if (role === 'DEALER') {
    return <Dealer />;
  }

  if (role === 'ADMIN') {
    return <Admin />;
  }

  return <Customer />;
};

export default HomePage;
