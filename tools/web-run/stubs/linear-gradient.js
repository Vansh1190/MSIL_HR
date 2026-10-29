import React from 'react';
import {rnStyleToDom} from './style';

const angleFor = (start, end) => {
  if (!start || !end) return 180;
  const deg = (Math.atan2(end.x - start.x, -(end.y - start.y)) * 180) / Math.PI;
  return (deg + 360) % 360;
};

const LinearGradient = ({colors, start, end, locations, angle, useAngle, style, children, ...rest}) => {
  const list = (colors && colors.length ? colors : ['#000000', '#000000']).join(', ');
  const stops = locations && locations.length ? `linear-gradient(to bottom, ${list})` : `linear-gradient(to bottom, ${list})`;
  const deg = useAngle && typeof angle === 'number' ? angle : angleFor(start, end);
  const dom = rnStyleToDom(style);
  return (
    <div
      {...rest}
      data-linear-gradient=""
      style={{
        position: dom.position || 'absolute',
        left: dom.left !== undefined ? dom.left : 0,
        right: dom.right !== undefined ? dom.right : 0,
        top: dom.top !== undefined ? dom.top : 0,
        bottom: dom.bottom !== undefined ? dom.bottom : 0,
        width: dom.width,
        height: dom.height,
        borderRadius: dom.borderRadius,
        opacity: dom.opacity,
        transform: dom.transform,
        backgroundImage: `linear-gradient(${deg}deg, ${list})`,
      }}
    >
      {children}
    </div>
  );
};

export default LinearGradient;
export const ShadowedLinearGradient = LinearGradient;
