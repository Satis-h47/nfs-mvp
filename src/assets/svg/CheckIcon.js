import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CheckIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5 13l4 4L19 7"
        stroke="#007AFF"  // iOS-style blue
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CheckIcon;
