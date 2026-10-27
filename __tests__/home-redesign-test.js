import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';

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
jest.mock('react-native-fs', () => ({DocumentDirectoryPath: '/tmp', writeFile: jest.fn(), exists: jest.fn()}));
jest.mock('react-native-image-resizer', () => ({default: {createResizedImage: jest.fn()}}));
jest.mock('react-native-image-picker', () => ({launchCamera: jest.fn()}));
jest.mock('react-native-device-info', () => ({getBrand: () => 'X', getDeviceId: () => 'D'}));
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
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: () => {},
}));
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

const ctxValue = {
  authContext: {},
  AppUserData: {
    token: 't',
    data: {
      userFlag: 'N',
      EMPL_NAME: 'Arjun Mehta',
      userId: 'E-482137',
      userDept: 'PE',
      empllocn: 'MNR',
      username: 'arjun',
      profile_photo: '',
    },
  },
};

const render = () => {
  const routes = [];
  let tree;
  act(() => {
    tree = renderer.create(
      React.createElement(
        AuthContext.Provider,
        {value: ctxValue},
        React.createElement(Home, {
          navigation: {
            navigate: r => routes.push(r),
            openDrawer: () => routes.push('DRAWER'),
          },
        }),
      ),
    );
  });
  return {tree, routes};
};

const flatten = (node, out = []) => {
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node));
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach(n => flatten(n, out));
    return out;
  }
  if (node && node.children) node.children.forEach(c => flatten(c, out));
  return out;
};

const styleOf = (tree, typeName, idx = 0) => {
  const hits = tree.root.findAllByType(typeName);
  const flat = styles =>
    (Array.isArray(styles) ? styles : [styles])
      .filter(s => s && typeof s === 'object')
      .reduce((a, s) => Object.assign(a, s), {});
  return hits[idx] ? flat(hits[idx].props.style) : null;
};

describe('Home screen redesign', () => {
  it('renders without crashing and keeps every entry point wired', () => {
    const {tree, routes} = render();
    const json = tree.toJSON();
    const text = flatten(json).join(' | ');

    // ── copy / identity ──
    expect(text).toContain('HR Assist');
    expect(text).toContain('Arjun Mehta');
    expect(text).toContain('OUR VISION');
    expect(text).toContain('Quick actions');

    // ── every previously available navigation target still reachable ──
    const presses = tree.root.findAllByType(TouchableOpacity);
    const fired = [];
    presses.forEach(p => {
      if (!p.props.onPress) return;
      const before = routes.length;
      act(() => p.props.onPress());
      if (routes.length > before) fired.push(routes[routes.length - 1]);
    });
    expect(fired).toEqual(
      expect.arrayContaining([
        'DRAWER',
        'Notification',
        'EditProfile',
        'Whatsnew',
        'EmployeeNavs',
        'AttendanceAdminNav',
        'CompensationBenifitsNav',
        'HospitalNavs',
        'GatePassNavigator',
        'CanteeNavigator',
        'OtherApps',
        'BusinessNavigator',
        'OtherMobilityNavigator',
      ]),
    );
  });

  it('applies the teal / amber design tokens', () => {
    const {tree} = render();
    const flat = st =>
      (Array.isArray(st) ? st : [st]).filter(Boolean).reduce((a, x) => Object.assign(a, x), {});
    const hero = tree.root
      .findAll(n => typeof n.type === 'string')
      .filter(n => flat(n.props.style).borderBottomRightRadius === 30);
    expect(hero.length).toBe(1);
    expect(flat(hero[0].props.style).borderBottomLeftRadius).toBe(30);
    const gradient = tree.root.findAllByType('LinearGradient')[0];
    expect(gradient.props.colors).toEqual(['#3E9E90', '#2B8379', '#12403A']);
  });

  it('switches the vision statement when a dot is selected', () => {
    const {tree} = render();
    expect(flatten(tree.toJSON()).join(' ')).toContain(
      'The Leader in the Indian Mobility Industry.',
    );
    const dot = tree.root
      .findAllByType(TouchableOpacity)
      .filter(n => n.props.accessibilityRole === 'tab')[1];
    act(() => dot.props.onPress());
    expect(flatten(tree.toJSON()).join(' ')).toContain(
      'Enhancing Customer Delight and Stakeholder Value.',
    );
    expect(flatten(tree.toJSON()).join(' ')).toMatch(/2\s+\/\s+4/);
  });

  it('keeps the announcements carousel props untouched', () => {
    const {tree} = render();
    const box = tree.root.findAllByType('SliderBox')[0];
    expect(box.props.autoplay).toBe(true);
    expect(box.props.circleLoop).toBe(true);
    expect(box.props.images.length).toBe(3);
    expect(box.props.images[0]).toContain('HRAssistWebAPIMVC/Images/1.png');
  });


});
