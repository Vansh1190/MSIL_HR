import {StyleSheet} from 'react-native';

const UNITLESS_TRANSFORM = {scale: 1, scaleX: 1, scaleY: 1, rotate: 1, rotateX: 1, rotateY: 1, rotateZ: 1, skewX: 1, skewY: 1, matrix: 1, perspective: 1};
const DROP = {
  shadowColor: 1,
  shadowOpacity: 1,
  shadowRadius: 1,
  shadowOffset: 1,
  elevation: 1,
  includeFontPadding: 1,
  overlayColor: 1,
  startColor: 1,
  endColor: 1,
  resizeMode: 1,
  tint: 1,
};

export const rnStyleToDom = (style) => {
  const s = StyleSheet.flatten(style) || {};
  const out = {};
  Object.keys(s).forEach((k) => {
    if (DROP[k]) return;
    if (k === 'transform') {
      const t = Array.isArray(s[k])
        ? s[k]
            .map((entry) => {
              const fn = Object.keys(entry)[0];
              const v = entry[fn];
              if (UNITLESS_TRANSFORM[fn]) return `${fn}(${v})`;
              if (typeof v === 'number') return `${fn}(${v}px)`;
              return `${fn}(${v})`;
            })
            .join(' ')
        : s[k];
      out.transform = t;
      return;
    }
    out[k] = s[k];
  });
  return out;
};
