import React from 'react';

import HomePageComponent from 'scenes/home';
import ScrollViewWithWaterMark from 'components/common/ScrollViewWithWaterMark';

const HomePage = () => {
  return (
    <ScrollViewWithWaterMark>
      <HomePageComponent />
    </ScrollViewWithWaterMark>
  );
};

export default HomePage;
