import React from 'react';

import WaterMarkBackground from 'components/common/WaterMarkBackground';
import HomePageComponent from 'scenes/home';

const HomePage = () => {
  return (
    <WaterMarkBackground>
      <HomePageComponent />
    </WaterMarkBackground>
  );
};

export default HomePage;
