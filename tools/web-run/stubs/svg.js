import React from 'react';
import {rnStyleToDom} from './style';

const tag = (Tag) => {
  const C = ({style, children, ...rest}) => React.createElement(Tag, {...rest, style: rnStyleToDom(style)}, children);
  C.displayName = `svg.${Tag}`;
  return C;
};

const Svg = ({style, children, width, height, viewBox, ...rest}) =>
  React.createElement(
    'svg',
    {
      width,
      height,
      viewBox,
      ...rest,
      style: {overflow: 'visible', display: 'block', ...rnStyleToDom(style)},
      xmlns: 'http://www.w3.org/2000/svg',
    },
    children,
  );

export const Circle = tag('circle');
export const Ellipse = tag('ellipse');
export const Rect = tag('rect');
export const Defs = tag('defs');
export const Stop = tag('stop');
export const LinearGradient = tag('linearGradient');
export const RadialGradient = tag('radialGradient');
export const G = tag('g');
export const Path = tag('path');
export const Line = tag('line');
export const Polygon = tag('polygon');
export const Text = tag('text');
export const TSpan = tag('tspan');
export const ClipPath = tag('clipPath');
export const Image = tag('image');

export default Svg;
