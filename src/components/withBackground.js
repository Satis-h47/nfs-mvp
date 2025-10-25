// withBackground.js
import React from 'react';
import BackgroundWrapper from './BackgroundWrapper';

const withBackground = (WrappedComponent) => (props) => (
  <BackgroundWrapper>
    <WrappedComponent {...props} />
  </BackgroundWrapper>
);

export default withBackground;
