import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProfileIcon = ({ color }) => (
    <Svg
        width={wp(8)}
        height={wp(8)}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    // {...props}
    >
        <G id="Frame">
            <Path
                id="Vector"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.001 13.5C16.1945 13.5 17.339 13.0259 18.183 12.182C19.0269 11.3381 19.501 10.1935 19.501 9C19.501 7.80653 19.0269 6.66193 18.183 5.81802C17.339 4.97411 16.1945 4.5 15.001 4.5C13.8075 4.5 12.6629 4.97411 11.819 5.81802C10.9751 6.66193 10.501 7.80653 10.501 9C10.501 10.1935 10.9751 11.3381 11.819 12.182C12.6629 13.0259 13.8075 13.5 15.001 13.5ZM4.50098 27C4.50098 25.6211 4.77257 24.2557 5.30024 22.9818C5.82792 21.7079 6.60134 20.5504 7.57636 19.5754C8.55137 18.6004 9.70888 17.8269 10.9828 17.2993C12.2567 16.7716 13.6221 16.5 15.001 16.5C16.3799 16.5 17.7452 16.7716 19.0192 17.2993C20.2931 17.8269 21.4506 18.6004 22.4256 19.5754C23.4006 20.5504 24.174 21.7079 24.7017 22.9818C25.2294 24.2557 25.501 25.6211 25.501 27H4.50098Z"
                fill={color}
            />
        </G>
    </Svg>
);
export default ProfileIcon;