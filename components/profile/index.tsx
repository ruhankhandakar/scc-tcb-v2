import React from 'react';

import Registration from './registration';
import UserDetails from './UserDetails';
import { useAppContext } from 'context/AppContext';
import { SelectedProfileData } from 'types/profile';

interface Props {
  isReadOnly?: boolean;
  isEditAccess?: boolean;
  selectedProfile: SelectedProfileData | null;
}

const ProfileComponent = ({
  isReadOnly = false,
  isEditAccess = true,
  selectedProfile,
}: Props) => {
  const {
    state: { isShowRegistrationForm },
  } = useAppContext();

  if (isShowRegistrationForm) return <Registration />;

  return (
    <UserDetails
      isReadOnly={isReadOnly}
      isEditAccess={isEditAccess}
      selectedProfile={selectedProfile}
    />
  );
};

export default ProfileComponent;
