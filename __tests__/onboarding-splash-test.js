import React from 'react';
import renderer, {act} from 'react-test-renderer';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Svg: 'Svg',
  Circle: 'Circle',
  Defs: 'Defs',
  Ellipse: 'Ellipse',
  LinearGradient: 'SvgLinearGradient',
  RadialGradient: 'RadialGradient',
  Rect: 'Rect',
  Stop: 'Stop',
  Text: 'SvgText',
}));

const mockStorage = {
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
};
jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    setItem: (...args) => mockStorage.setItem(...args),
    getItem: (...args) => mockStorage.getItem(...args),
  },
}));

global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};
global.nativeRequestAnimationFrame = () => 0;

const Onboarding = require('../src/Auth/Onboarding');
const OnboardingScreen = Onboarding.default;
const completeOnboarding = Onboarding.completeOnboarding;

const texts = (tree) =>
  tree.root
    .findAll((node) => {
      const children = node.props && node.props.children;
      return typeof children === 'string' || typeof children === 'number';
    })
    .map((node) => String(node.props.children));

const mount = () => {
  const routes = [];
  let tree;
  act(() => {
    tree = renderer.create(<OnboardingScreen navigation={{navigate: (route) => routes.push(route)}} />);
  });
  return {tree, routes};
};

const run = (ms) => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

describe('Onboarding splash revamp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockStorage.setItem.mockClear();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('blooms with the Pride of India splash', () => {
    const {tree} = mount();
    expect(texts(tree)).toContain('Pride of India');
  });

  it('spreads into the carousel, cockpit pages, then the start step', () => {
    const {tree} = mount();
    run(1160);
    expect(texts(tree)).toContain('Pride of India');
    run(1250);
    expect(texts(tree)).toContain('Meet the new HR Assist');
    run(1600);
    run(900);
    expect(texts(tree)).toContain('Where it all began');
    run(2400);
    expect(texts(tree)).toContain('Made for every family');
    run(2400);
    expect(texts(tree)).toContain('Every detail, checked');
    run(2400);
    expect(texts(tree)).toContain('Built for every terrain');
    run(2400);
    const seen = texts(tree);
    expect(seen).toContain('Start your engine');
    expect(seen).toContain('Hold to start');
    expect(seen).toContain('START');
  });

  it('never advances past the last cockpit page', () => {
    const {tree} = mount();
    run(60000);
    const seen = texts(tree);
    expect(seen).toContain('Start your engine');
    expect(seen).not.toContain('Built for every terrain');
  });

  it('stores first-run completion and routes to SignIn', async () => {
    const navigation = {navigate: jest.fn()};
    await completeOnboarding(navigation);
    expect(mockStorage.setItem).toHaveBeenCalledWith('isnotfirstTime', 'abcd');
    expect(navigation.navigate).toHaveBeenCalledWith('SignIn');
  });

  it('still routes to SignIn when storage fails', async () => {
    mockStorage.setItem.mockImplementationOnce(() => Promise.reject(new Error('boom')));
    const navigation = {navigate: jest.fn()};
    await completeOnboarding(navigation);
    expect(navigation.navigate).toHaveBeenCalledWith('SignIn');
  });

  it('never walks back to an earlier step when a timer lands after a tap', () => {
    const {tree} = mount();
    const pressable = tree.root.findAll((node) => typeof (node.props || {}).onResponderGrant === 'function');
    act(() => {
      pressable[0].props.onClick({});
    });
    expect(texts(tree)).toContain('Meet the new HR Assist');
    run(20000);
    const seen = texts(tree);
    expect(seen).toContain('Start your engine');
    expect(seen).not.toContain('Pride of India');
  });

  it('cleans up timers on unmount', () => {
    const {tree} = mount();
    run(500);
    expect(() => {
      act(() => tree.unmount());
    }).not.toThrow();
    run(20000);
  });
});
