import WaterMarkBackground from 'components/common/WaterMarkBackground';
import HelpScene from 'scenes/help';
import Settings from 'scenes/settings';

import { useBackEndContext } from 'context/BackEndContext';

const HelpPage = () => {
  const {
    state: { profile },
  } = useBackEndContext();

  const userRole = profile?.user_role || 'DEALER';

  console.log('userRole', userRole);

  return (
    <WaterMarkBackground>
      {userRole === 'ADMIN' ? <Settings /> : <HelpScene />}
    </WaterMarkBackground>
  );
};

export default HelpPage;
