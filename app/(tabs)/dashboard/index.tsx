import React from 'react';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import DashBoard from 'scenes/dashboard';

const DashboardPage = () => {
  return (
    <WaterMarkBackground>
      <DashBoard />
    </WaterMarkBackground>
  );
};

export default DashboardPage;
