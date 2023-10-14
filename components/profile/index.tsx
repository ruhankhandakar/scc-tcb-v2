import React from 'react';

import Registration from './registration';
import UserDetails from './UserDetails';
import { useAppContext } from 'context/AppContext';

interface Props {
  isReadOnly?: boolean;
  isEditAccess?: boolean;
}

const ProfileComponent = ({ isReadOnly = false, isEditAccess = true }) => {
  const {
    state: { isShowRegistrationForm },
  } = useAppContext();

  if (isShowRegistrationForm) return <Registration />;

  return <UserDetails isReadOnly={isReadOnly} isEditAccess={isEditAccess} />;
};

export default ProfileComponent;
