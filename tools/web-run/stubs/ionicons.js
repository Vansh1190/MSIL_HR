import React from 'react';
import {rnStyleToDom} from './style';

const glyphMap = require('/root/workspace-agent-server/MSIL_HR/node_modules/react-native-vector-icons/glyphmaps/Ionicons.json');
const fontUrl = require('/root/workspace-agent-server/MSIL_HR/node_modules/react-native-vector-icons/Fonts/Ionicons.ttf');

if (typeof document !== 'undefined' && !document.getElementById('__ionicons_font__')) {
  const style = document.createElement('style');
  style.id = '__ionicons_font__';
  style.appendChild(
    document.createTextNode(
      `@font-face{font-family:'IoniconsWeb';src:url(${fontUrl}) format('truetype');font-weight:normal;font-style:normal;}`,
    ),
  );
  document.head.appendChild(style);
}

class Ionicons extends React.Component {
  render() {
    const {name, size = 24, color = '#000000', style, children, ...rest} = this.props;
    const code = glyphMap && glyphMap[name];
    const glyph = typeof code === 'number' ? String.fromCharCode(code) : code || '';
    const dom = rnStyleToDom(style);
    return (
      <span
        {...rest}
        data-icon={name}
        style={{
          fontFamily: "'IoniconsWeb'",
          fontSize: size,
          lineHeight: size * 1.15,
          color,
          display: 'inline-block',
          textAlign: 'center',
          minWidth: size,
          ...dom,
        }}
      >
        {glyph}
      </span>
    );
  }
}

Ionicons.glyphMap = glyphMap;
export default Ionicons;
