/**
 * Guardrails for the redesigned Home screen.
 *
 * Each rule here reproduces a real defect class seen on device:
 *  1. a fontFamily that iOS never registered  -> red screen
 *  2. an unbounded SliderBox banner           -> hero layout blown out
 *  3. `gap` in a style sheet                  -> silently ignored on RN 0.67
 *  4. hero not bleeding under the status bar  -> white band above the teal hero
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import renderer from 'react-test-renderer';
import {Platform, ScrollView} from 'react-native';

jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: v => v,
  RFPercentage: v => v,
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-image-slider-box', () => ({
  SliderBox: 'SliderBox',
  __esModule: true,
}));
jest.mock('react-native-pager-view', () => 'PagerView');
jest.mock('react-native-modal', () => 'Modal');
jest.mock('react-native-share', () => ({open: jest.fn()}));
jest.mock('react-native-view-shot', () => 'ViewShot');
jest.mock('react-native-qrcode-svg', () => 'QRCode');
jest.mock('react-native-contacts', () => ({
  getAll: jest.fn(),
  addContact: jest.fn(),
  requestPermission: jest.fn(),
}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/tmp',
  writeFile: jest.fn(),
  exists: jest.fn(),
}));
jest.mock('react-native-image-resizer', () => ({
  default: {createResizedImage: jest.fn()},
}));
jest.mock('react-native-image-picker', () => ({launchCamera: jest.fn()}));
jest.mock('react-native-device-info', () => ({
  getBrand: () => 'X',
  getDeviceId: () => 'D',
}));
jest.mock('react-native-icon-badge', () => 'IconBadge');
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 20, bottom: 0, left: 0, right: 0}),
  SafeAreaView: 'SafeAreaView',
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));
jest.mock('@react-navigation/native', () => ({useFocusEffect: () => {}}));
jest.mock('../src/Utils/Utils', () => ({
  PostMethode: jest.fn(() => Promise.resolve({})),
  showErrorMessage: jest.fn(),
}));
jest.mock('../src/Service/Helper', () => ({
  Decrypt: s => s,
  encrypyDecrypt: s => s,
  encrypyDecryptSHA256: s => s,
}));

const AuthContext = require('../src/context/AuthContext').default;
const Home = require('../src/screens/Home').default;

const STATUS_BAR_H = 47;

beforeEach(() => {
  // iOS exposes the status-bar height natively; the jest mock ships it empty
  require('react-native').NativeModules.StatusBarManager = {height: STATUS_BAR_H};
});

const hostsWithStyle = (tree, predicate) =>
  tree.root.findAll(
    n => typeof n.type === 'string' && predicate(flat(n.props.style)),
  );

const flat = st =>
  (Array.isArray(st) ? st : [st])
    .filter(s => s && typeof s === 'object')
    .reduce((a, s) => Object.assign(a, s), {});

const renderHome = () => {
  const tree = renderer.create(
    React.createElement(
      AuthContext.Provider,
      {
        value: {
          authContext: {},
          AppUserData: {
            token: 't',
            data: {
              userFlag: 'N',
              EMPL_NAME: 'Test User',
              userId: 'E-1',
              userDept: 'PE',
              empllocn: 'MNR',
              username: 'u',
              profile_photo: '',
            },
          },
        },
      },
      React.createElement(Home, {
        navigation: {navigate: () => {}, openDrawer: () => {}},
      }),
    ),
  );
  return tree;
};

const registeredFonts = () => {
  const plist = fs.readFileSync(
    path.join(__dirname, '..', 'ios', 'MarutiSuzukiApp', 'Info.plist'),
    'utf8',
  );
  const block = plist.match(/<key>UIAppFonts<\/key>\s*<array>([\s\S]*?)<\/array>/);
  expect(block).toBeTruthy();
  return (block[1].match(/<string>(.*?)<\/string>/g) || [])
    .map(s => s.replace(/<\/?string>/g, '').replace(/^fonts\//, '').replace(/\.ttf$/, ''));
};

describe('Home design guardrails', () => {
  it('only uses font families registered in the iOS bundle', () => {
    const allowed = registeredFonts();
    const tree = renderHome();
    const used = tree.root
      .findAllByType(ScrollView)[0]
      .findAll(n => typeof n.type === 'string')
      .map(n => flat(n.props.style).fontFamily)
      .filter(Boolean);

    expect(used.length).toBeGreaterThan(0);
    const invalid = used.filter(f => !allowed.includes(f));
    expect(invalid).toEqual([]);
  });

  it('never uses flex `gap` in the redesigned chrome (unsupported until RN 0.71)', () => {
    const tree = renderHome();
    const page = tree.root.findAllByType(ScrollView)[0];
    const offenders = page
      .findAll(n => typeof n.type === 'string')
      .filter(n => {
        const s = flat(n.props.style);
        return (
          s.gap !== undefined ||
          s.rowGap !== undefined ||
          s.columnGap !== undefined
        );
      });
    expect(offenders.map(n => n.type)).toEqual([]);
  });

  it('keeps the announcements banner inside its card', () => {
    const tree = renderHome();
    const box = tree.root.findAllByType('SliderBox')[0];
    const bannerH = box.props.sliderBoxHeight;

    expect(typeof bannerH).toBe('number');
    expect(bannerH).toBeGreaterThan(120);
    expect(bannerH).toBeLessThan(300);
    // explicit image sizing, otherwise SliderBox falls back to the image's intrinsic size
    expect(box.props.ImageComponentStyle).toEqual({width: '100%', height: bannerH});
    expect(box.props.images.length).toBe(3);
    expect(box.props.autoplay).toBe(true);
    expect(box.props.circleLoop).toBe(true);

    const card = hostsWithStyle(tree, s => s.overflow === 'hidden' && s.height === bannerH);
    expect(card.length).toBe(1);
    expect(flat(card[0].props.style).borderRadius).toBe(20);
    // carousel must not be wider than the card that clips it
    expect(box.props.parentWidth).toBeLessThan(
      require('react-native').Dimensions.get('window').width,
    );
  });

  it('bleeds the hero under the iOS status bar instead of leaving a white band', () => {
    const tree = renderHome();
    const roots = hostsWithStyle(tree, s => s.marginTop === -STATUS_BAR_H);
    expect(roots.length).toBe(1);

    const hero = hostsWithStyle(tree, s => s.borderBottomRightRadius === 28);
    expect(hero.length).toBe(1);
    // 14pt of breathing room on top of the status-bar inset
    expect(flat(hero[0].props.style).paddingTop).toBe(18 + STATUS_BAR_H);
  });

  it('tiles the service grid with gap-free margins that exactly fill a row', () => {
    const tree = renderHome();
    const winW = require('react-native').Dimensions.get('window').width;
    const tiles = hostsWithStyle(
      tree,
      s => s.borderRadius === 18 && s.height === 92 && typeof s.width === 'number',
    );

    expect(tiles.length).toBe(9);
    tiles.forEach(t => {
      const s = flat(t.props.style);
      expect([0, 10]).toContain(s.marginRight);
      expect(s.marginBottom).toBe(10);
    });
    const {width} = flat(tiles[0].props.style);
    expect(Math.round(width * 3 + 10 * 2 + 16 * 2)).toBe(Math.round(winW));
  });
});
