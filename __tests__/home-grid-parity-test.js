import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {TouchableOpacity, Text} from 'react-native';

jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: v => v,
  RFPercentage: v => v,
}));
jest.mock('react-native-share', () => ({open: jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 20, bottom: 0, left: 0, right: 0}),
  SafeAreaView: 'SafeAreaView',
}));

const AuthContext = require('../src/context/AuthContext').default;
const TouchableCard = require('../src/components/Touchable').default;

// Navigation contract of the home service grid — must survive the redesign.
const ROUTES = [
  ['Employee Lookup', 'EmployeeNavs'],
  ['Attendance & Admin', 'AttendanceAdminNav'],
  ['Comp. & Benefits', 'CompensationBenifitsNav'],
  ['Hospital & Quick Dials', 'HospitalNavs'],
  ['Gatepass & Room Booking', 'GatePassNavigator'],
  ['Canteen Menu', 'CanteeNavigator'],
  ['Other Mobile Apps', 'OtherApps'],
  ['Business Travel', 'BusinessNavigator'],
  ['Add-On Menu', 'OtherMobilityNavigator'],
];

const ctx = userFlag => ({
  authContext: {},
  AppUserData: {
    token: 't',
    data: {
      userFlag,
      EMPL_NAME: 'Test User',
      userId: 'E-1',
      username: 'u',
      userDept: 'PE',
      empllocn: 'MNR',
      profile_photo: '',
    },
  },
});

const renderGrid = (design, userFlag) => {
  const routes = [];
  const tree = renderer.create(
    React.createElement(
      AuthContext.Provider,
      {value: ctx(userFlag)},
      React.createElement(TouchableCard, {
        design,
        navigation: {navigate: r => routes.push(r)},
      }),
    ),
  );
  return {tree, routes};
};

const tapAll = (tree, routes) => {
  tree.root
    .findAllByType(TouchableOpacity)
    .forEach(tile => act(() => tile.props.onPress()));
  return routes;
};

const labelsOf = tree =>
  tree.root
    .findAllByType(Text)
    .map(t =>
      String(
        Array.isArray(t.props.children)
          ? t.props.children.join('')
          : t.props.children,
      )
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);

describe('Home service grid – navigation contract', () => {
  it('every tile still routes to the same screen as before the redesign', () => {
    const {tree, routes} = renderGrid('v2', 'N');
    expect(tapAll(tree, routes)).toEqual(ROUTES.map(r => r[1]));
  });

  it('hides Gatepass & Room Booking for userFlag "Y" without breaking order', () => {
    const {tree, routes} = renderGrid('v2', 'Y');
    const expected = ROUTES.filter(
      ([label]) => label !== 'Gatepass & Room Booking',
    ).map(r => r[1]);
    expect(tapAll(tree, routes)).toEqual(expected);
    expect(labelsOf(tree)).not.toContain('Gatepass & Room Booking');
  });

  it('keeps the classic variant behaviour for other consumers', () => {
    const {tree, routes} = renderGrid('classic', 'N');
    expect(tapAll(tree, routes)).toEqual(ROUTES.map(r => r[1]));
  });

  it('renders the same nine labels in the redesigned grid', () => {
    const {tree} = renderGrid('v2', 'N');
    expect(labelsOf(tree)).toEqual(ROUTES.map(r => r[0]));
  });
});
