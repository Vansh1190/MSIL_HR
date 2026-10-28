import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import EncryptedStorage from 'react-native-encrypted-storage';

const { width: W, height: H } = Dimensions.get('window');
const S = W / 440;
const u = (value) => value * S;

const ACT = { BLOOM: 0, LOGO: 1, CAROUSEL: 2, OPEN: 3, COCKPIT: 4, START: 5, LAUNCH: 6 };

const D = {
  bloom: 900,
  bloomHold: 260,
  logo: 1250,
  spread: 1550,
  hold: 1600,
  open: 900,
  photo: 2400,
  crossFade: 900,
  shadeIn: 600,
  holdToStart: 1200,
  drain: 550,
  flash: 320,
  engineOn: 800,
  orb: 1000,
};

const NIGHT = '#06070C';
const RING_STOPS = ['#B4C9FF', '#58A6FF', '#6B86FF', '#58A6FF', '#B4C9FF'];
const SHADE_TOP = ['rgba(6,8,20,0.58)', 'rgba(6,8,20,0.30)', 'rgba(6,8,20,0)'];
const SHADE_BOTTOM = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.78)', 'rgba(0,0,0,0.90)', 'rgba(0,0,0,0.96)'];

const LOGO = require('../assets/Images/onboarding/splash/logo.png');
const COCKPIT = require('../assets/Images/onboarding/splash/cockpit.png');
const CARDS = {
  plant: require('../assets/Images/onboarding/splash/card_plant.png'),
  jimny: require('../assets/Images/onboarding/splash/card_jimny.png'),
  trees: require('../assets/Images/onboarding/splash/card_trees.png'),
  night: require('../assets/Images/onboarding/splash/card_night.png'),
  invicto: require('../assets/Images/onboarding/splash/card_invicto.png'),
  qc: require('../assets/Images/onboarding/splash/card_qc.png'),
  gypsy: require('../assets/Images/onboarding/splash/card_gypsy.png'),
  showroom: require('../assets/Images/onboarding/splash/card_showroom.png'),
};
const HERO = require('../assets/Images/onboarding/splash/photo_800.jpg');
const SHOWROOM = require('../assets/Images/onboarding/splash/photo_showroom.jpg');
const QC = require('../assets/Images/onboarding/splash/photo_qc.jpg');
const GYPSY = require('../assets/Images/onboarding/splash/photo_gypsy.jpg');

const PHOTO_W = 547;
const PHOTO_H = 1191;
const PHOTO_X = -54;

const PAGES = [
  { photo: HERO, y: -324, title: 'Where it all began', line: 'Four decades of cars, and the people who make them' },
  { photo: SHOWROOM, y: -264, title: 'Made for every family', line: "Every car we make ends up in someone's story" },
  { photo: QC, y: -276, title: 'Every detail, checked', line: 'The same care goes into looking after our people' },
  { photo: GYPSY, y: -312, title: 'Built for every terrain', line: 'Wherever work takes you, HR Assist comes along' },
];

const LAST = PAGES.length - 1;
const HERO_TITLE = 'Meet the new HR Assist';
const HERO_LINE = 'Leave, attendance, gatepasses and more, all in one simple app';

const CARD_W = u(205);
const CARD_H = u(147);
const GAP = u(24);
const TILT = '-9deg';
const ROWS = [
  { y: u(250), w: CARD_W, h: CARD_H, speed: 1, reverse: false, items: [CARDS.jimny, CARDS.plant, CARDS.trees, CARDS.night] },
  { y: u(400), w: u(176), h: u(142), speed: 0.45, reverse: true, items: [CARDS.qc, CARDS.gypsy, CARDS.showroom, CARDS.qc] },
  { y: u(545), w: CARD_W, h: CARD_H, speed: 1, reverse: true, items: [CARDS.invicto, CARDS.plant, CARDS.jimny, CARDS.trees] },
];

const HERO_W = u(197) * 1.18;
const HERO_H = u(159) * 1.18;
const HERO_CX = W / 2;
const HERO_CY = u(396);
const BTN = u(330);
const BTN_CY = H - u(211);
const GLASS = u(128);
const RING = u(138);

export const completeOnboarding = (navigation) =>
  EncryptedStorage.setItem('isnotfirstTime', 'abcd')
    .then(() => navigation.navigate('SignIn'))
    .catch(() => navigation.navigate('SignIn'));

const useValue = (initial) => {
  const ref = useRef(null);
  if (ref.current === null) ref.current = new Animated.Value(initial);
  return ref.current;
};

const gradient = (id, cx, cy, r, stops) => (
  <RadialGradient id={id} cx={cx} cy={cy} r={r}>
    {stops.map((stop, index) => (
      <Stop key={`${id}-${index}`} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
    ))}
  </RadialGradient>
);

const BloomBackdrop = React.memo(({ core }) => (
  <View style={styles.blueField}>
    <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
      <Defs>
        {gradient('field', '50%', '42%', '72%', [
          { offset: '0', color: '#FFFFFF', opacity: 1 },
          { offset: '0.55', color: '#FFFFFF', opacity: 1 },
          { offset: '0.78', color: '#C3D4FF', opacity: 1 },
          { offset: '1', color: '#7D9AF2', opacity: 1 },
        ])}
      </Defs>
      <Rect x="0" y="0" width={W} height={H} fill="url(#field)" />
    </Svg>
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { opacity: core, transform: [{ scale: core.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.35] }) }] },
      ]}>
      <Svg width={W} height={H}>
        <Defs>
          {gradient('core', '50%', '45%', '58%', [
            { offset: '0', color: '#FFFFFF', opacity: 1 },
            { offset: '0.62', color: '#FFFFFF', opacity: 0.86 },
            { offset: '1', color: '#FFFFFF', opacity: 0 },
          ])}
        </Defs>
        <Ellipse cx={W / 2} cy={H * 0.45} rx={W * 0.62} ry={H * 0.34} fill="url(#core)" />
      </Svg>
    </Animated.View>
  </View>
));

const Tagline = ({ opacity }) => {
  const height = u(42);
  return (
    <Animated.View style={{ opacity, width: W, height }} pointerEvents="none">
      <Svg width={W} height={height}>
        <Defs>
          <SvgLinearGradient id="tagline" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0" stopColor="#171C8F" />
            <Stop offset="0.45" stopColor="#6B86FF" />
            <Stop offset="1" stopColor="#171C8F" />
          </SvgLinearGradient>
        </Defs>
        <SvgText x={W / 2} y={height * 0.76} fill="url(#tagline)" fontSize={u(27)} fontWeight="600" textAnchor="middle">
          Pride of India
        </SvgText>
      </Svg>
    </Animated.View>
  );
};

const CarouselRow = React.memo(({ row, enter, slow }) => {
  const stride = row.items.length * (row.w + GAP);
  const drift = useValue(row.reverse ? stride : 0);
  const band = row.items.concat(row.items, row.items);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(drift, {
        toValue: row.reverse ? 0 : -stride,
        duration: (stride / (u(24) * row.speed * (slow ? 0.3 : 1))) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, row.reverse, row.speed, slow, stride]);

  return (
    <Animated.View
      style={[
        styles.rowBand,
        {
          top: row.y - row.h / 2,
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [HERO_CY - row.y, 0] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) },
            { rotate: TILT },
            { translateX: drift },
          ],
        },
      ]}>
      <View style={[styles.rowStrip, { left: -stride }]}>
        {band.map((source, index) => (
          <Image
            key={`card-${index}`}
            source={source}
            style={[styles.card, { width: row.w, height: row.h }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ))}
      </View>
    </Animated.View>
  );
});

const photoBox = (y) => ({
  position: 'absolute',
  left: u(PHOTO_X),
  top: u(y),
  width: u(PHOTO_W),
  height: u(PHOTO_H),
});

const HeroCard = React.memo(({ enter, open }) => {
  const coverHeight = HERO_W * (PHOTO_H / PHOTO_W);
  return (
    <Animated.View
      style={[
        styles.heroCard,
        {
          width: open.interpolate({ inputRange: [0, 1], outputRange: [HERO_W, W] }),
          height: open.interpolate({ inputRange: [0, 1], outputRange: [HERO_H, H] }),
          left: open.interpolate({ inputRange: [0, 1], outputRange: [HERO_CX - HERO_W / 2, 0] }),
          top: open.interpolate({ inputRange: [0, 1], outputRange: [HERO_CY - HERO_H / 2, 0] }),
          borderRadius: open.interpolate({ inputRange: [0, 1], outputRange: [u(20), 0] }),
          opacity: enter,
          transform: [
            { rotate: open.interpolate({ inputRange: [0, 1], outputRange: [TILT, '0deg'] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }) },
          ],
        },
      ]}>
      <Animated.Image
        source={HERO}
        resizeMode="stretch"
        accessibilityIgnoresInvertColors
        style={{
          position: 'absolute',
          width: open.interpolate({ inputRange: [0, 1], outputRange: [HERO_W, u(PHOTO_W)] }),
          height: open.interpolate({ inputRange: [0, 1], outputRange: [coverHeight, u(PHOTO_H)] }),
          left: open.interpolate({ inputRange: [0, 1], outputRange: [0, u(PHOTO_X)] }),
          top: open.interpolate({ inputRange: [0, 1], outputRange: [(HERO_H - coverHeight) / 2, u(PAGES[0].y)] }),
        }}
      />
    </Animated.View>
  );
});

const LightRing = ({ id, size, stroke, opacity, spin, glow }) => {
  const radius = size / 2 - stroke / 2 - 0.5;
  const circumference = 2 * Math.PI * radius;
  return (
    <Animated.View
      style={[styles.ringLayer, { width: size, height: size, left: (BTN - size) / 2, top: (BTN - size) / 2, opacity, transform: [{ rotate: spin }] }, glow ? styles.ringGlow : null]}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            {RING_STOPS.map((color, index) => (
              <Stop key={`${id}-${index}`} offset={`${index / (RING_STOPS.length - 1)}`} stopColor={color} />
            ))}
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.74} ${circumference * 0.26}`}
        />
      </Svg>
    </Animated.View>
  );
};

const ProgressRing = ({ progress, size }) => {
  const [value, setValue] = useState(0);
  const stroke = u(3);
  const radius = size / 2 - stroke / 2 - 0.5;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const id = progress.addListener(({ value: next }) => setValue(Math.round(next * 48) / 48));
    return () => progress.removeListener(id);
  }, [progress]);

  return (
    <View style={[styles.ringLayer, { width: size, height: size, left: (BTN - size) / 2, top: (BTN - size) / 2, transform: [{ rotate: '-90deg' }] }]} pointerEvents="none">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.16)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - value)}
        />
      </Svg>
    </View>
  );
};

const StartButton = ({ breathing, spin, progress, label, active, onHoldStart, onHoldEnd }) => (
  <View pointerEvents="box-none" style={[styles.buttonCluster, { width: BTN, height: BTN }]}>
    <View pointerEvents="none" style={[styles.ringLayer, { width: BTN, height: BTN, left: 0, top: 0 }]}>
      <Svg width={BTN} height={BTN}>
        <Defs>
          {gradient('pool', '50%', '50%', '50%', [
            { offset: '0', color: '#000000', opacity: 0.6 },
            { offset: '0.36', color: '#000000', opacity: 0.6 },
            { offset: '1', color: '#000000', opacity: 0 },
          ])}
          {gradient('dashlight', '50%', '50%', '50%', [
            { offset: '0', color: '#58A6FF', opacity: 0.13 },
            { offset: '0.3', color: '#58A6FF', opacity: 0.13 },
            { offset: '0.66', color: '#6B86FF', opacity: 0.05 },
            { offset: '1', color: '#171C8F', opacity: 0 },
          ])}
        </Defs>
        <Rect x="0" y="0" width={BTN} height={BTN} fill="url(#pool)" />
        <Rect x="0" y="0" width={BTN} height={BTN} fill="url(#dashlight)" />
      </Svg>
    </View>

    <Animated.View
      pointerEvents="none"
      style={[
        styles.ringLayer,
        {
          width: BTN,
          height: BTN,
          left: 0,
          top: 0,
          opacity: breathing.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
          transform: [{ scale: breathing.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] }) }],
        },
      ]}>
      <LightRing id="ringSoft" size={u(142)} stroke={u(7)} spin={spin} glow opacity={0.45} />
      <LightRing id="ringLine" size={RING} stroke={u(2)} spin={spin} opacity={0.85} />
    </Animated.View>

    <View style={[styles.glass, { width: GLASS, height: GLASS, borderRadius: GLASS / 2 }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg width={GLASS} height={GLASS}>
          <Circle cx={GLASS / 2} cy={GLASS / 2} r={GLASS / 2 - 1} stroke="rgba(255,255,255,0.22)" strokeWidth={1} fill="none" />
        </Svg>
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
        style={[styles.highlight, { width: u(70), height: u(33), borderRadius: u(17) }]}
      />
      <View pointerEvents="none" style={styles.glassInner}>
        <Ionicons name="power" size={u(26)} color={active ? '#FFFFFF' : 'rgba(255,255,255,0.92)'} />
        <Text style={[styles.startLabel, { fontSize: u(10), letterSpacing: u(2.4) }]}>START</Text>
      </View>
    </View>

    <ProgressRing progress={progress} size={RING} />

    <View pointerEvents="none" style={[styles.hint, { top: BTN / 2 + u(94) }]}>
      <Text style={[styles.hintText, { fontSize: u(14) }]}>{label}</Text>
    </View>

    <TouchableWithoutFeedback onPressIn={onHoldStart} onPressOut={onHoldEnd} disabled={!active}>
      <View
        style={[styles.hit, { width: u(216), height: u(216), borderRadius: u(108), left: (BTN - u(216)) / 2, top: (BTN - u(216)) / 2 }]}
        accessibilityRole="button"
        accessibilityLabel={label}
      />
    </TouchableWithoutFeedback>
  </View>
);

const OnboardingScreen = ({ navigation }) => {
  const [act, setAct] = useState(ACT.BLOOM);
  const [page, setPage] = useState(0);
  const [label, setLabel] = useState('Hold to start');
  const [slow, setSlow] = useState(false);

  const bloom = useValue(0);
  const logoIn = useValue(0);
  const taglineIn = useValue(0);
  const lightOut = useValue(0);
  const sceneIn = useValue(0);
  const heroIn = useValue(0);
  const open = useValue(0);
  const sceneInDark = useValue(0);
  const copyIn = useValue(1);
  const photoIn = useValue(1);
  const shadeIn = useValue(0);
  const breathing = useValue(0.4);
  const flash = useValue(0);
  const orb = useValue(0);
  const spin = useValue(0);
  const progress = useValue(0);

  const alive = useRef(true);
  const timers = useRef([]);
  const launched = useRef(false);
  const holding = useRef(false);
  const actRef = useRef(act);
  const pageRef = useRef(page);
  const amount = useRef(0);
  const reduce = useRef(false);

  actRef.current = act;
  pageRef.current = page;

  const after = useCallback((ms, fn) => {
    const id = setTimeout(() => {
      if (alive.current) fn();
    }, reduce.current ? Math.max(80, ms * 0.25) : ms);
    timers.current.push(id);
    return id;
  }, []);

  const goto = useCallback((next) => {
    setAct((current) => (next > current ? next : current));
  }, []);

  const finish = useCallback(() => completeOnboarding(navigation), [navigation]);

  const engineOn = useCallback(() => {
    if (launched.current) return;
    launched.current = true;
    setLabel('Engine on');
    goto(ACT.LAUNCH);
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: D.flash, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: D.engineOn, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
    Animated.timing(orb, { toValue: 1, duration: D.orb, easing: Easing.bezier(0.65, 0, 0.35, 1), useNativeDriver: true }).start();
    after(D.flash + D.orb * 0.6, finish);
  }, [after, finish, goto]);

  useEffect(() => {
    try {
      const reduced =
        typeof AccessibilityInfo.isReduceMotionEnabled === 'function' && AccessibilityInfo.isReduceMotionEnabled();
      if (reduced && typeof reduced.then === 'function') {
        reduced
          .then((enabled) => {
            reduce.current = !!enabled;
            setSlow(!!enabled);
          })
          .catch(() => {});
      }
    } catch (e) {}
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      StatusBar.setBarStyle('dark-content', true);
      if (Platform.OS === 'android') StatusBar.setBackgroundColor('transparent', true);
    };
  }, []);

  useEffect(() => {
    Animated.timing(bloom, { toValue: 1, duration: D.bloom, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }).start();
    after(D.bloom - 260, () => {
      Animated.parallel([
        Animated.timing(logoIn, { toValue: 1, duration: 620, easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: true }),
        Animated.timing(taglineIn, { toValue: 1, duration: 720, delay: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    });
    after(D.bloom + D.bloomHold, () => goto(ACT.LOGO));
    after(D.bloom + D.bloomHold + D.logo, () => goto(ACT.CAROUSEL));
  }, [goto]);

  useEffect(() => {
    if (act !== ACT.CAROUSEL && act !== ACT.OPEN) return undefined;
    Animated.parallel([
      Animated.timing(sceneIn, { toValue: 1, duration: D.spread, easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: true }),
      Animated.timing(heroIn, { toValue: 1, duration: D.spread, easing: Easing.bezier(0.32, 0.72, 0, 1), useNativeDriver: false }),
    ]).start();
    if (act === ACT.CAROUSEL) after(D.hold, () => goto(ACT.OPEN));
    return undefined;
  }, [act, after, goto]);

  useEffect(() => {
    if (act !== ACT.OPEN) return undefined;
    Animated.parallel([
      Animated.timing(open, { toValue: 1, duration: D.open, easing: Easing.bezier(0.65, 0, 0.35, 1), useNativeDriver: false }),
      Animated.timing(lightOut, { toValue: 1, duration: D.open * 0.4, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(sceneInDark, { toValue: 1, duration: D.open, delay: D.open * 0.3, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    after(D.open, () => goto(ACT.COCKPIT));
    return undefined;
  }, [act, after, goto]);

  useEffect(() => {
    if (act !== ACT.COCKPIT) return undefined;
    if (pageRef.current >= LAST) {
      after(D.photo, () => goto(ACT.START));
    } else {
      after(D.photo, () => setPage((current) => Math.min(current + 1, LAST)));
    }
    return undefined;
  }, [act, page, after, goto]);

  useEffect(() => {
    if (act !== ACT.START || launched.current) return undefined;
    Animated.timing(shadeIn, { toValue: 1, duration: D.shadeIn, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    return undefined;
  }, [act]);

  useEffect(() => {
    if (act < ACT.COCKPIT || launched.current) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathing, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathing, { toValue: 0.4, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [act]);

  useEffect(() => {
    if (act < ACT.COCKPIT) return undefined;
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: reduce.current ? 12000 : act === ACT.START ? 2600 : 6200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [act]);

  const shownPage = useRef(-1);
  useEffect(() => {
    if (act < ACT.COCKPIT) return undefined;
    if (shownPage.current === page) return undefined;
    const animate = shownPage.current !== -1;
    shownPage.current = page;
    if (animate) {
      photoIn.setValue(0);
      Animated.timing(photoIn, { toValue: 1, duration: D.crossFade, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
    return undefined;
  }, [page, act]);

  const shownCopy = useRef('');
  useEffect(() => {
    if (act < ACT.COCKPIT) return undefined;
    const key = act === ACT.COCKPIT ? 'page' + page : 'start';
    if (shownCopy.current === key) return undefined;
    const animate = shownCopy.current !== '';
    shownCopy.current = key;
    if (animate) {
      copyIn.setValue(0);
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(copyIn, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
    return undefined;
  }, [page, act]);

  const onHoldStart = useCallback(() => {
    if (launched.current || actRef.current !== ACT.START) return;
    holding.current = true;
    setLabel('Starting');
    progress.stopAnimation();
    Animated.timing(progress, {
      toValue: 1,
      duration: Math.max(140, D.holdToStart * (1 - amount.current)),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && holding.current && amount.current > 0.99) engineOn();
    });
  }, [engineOn, progress]);

  const onHoldEnd = useCallback(() => {
    holding.current = false;
    if (launched.current || amount.current > 0.99) return;
    setLabel('Hold to start');
    progress.stopAnimation();
    Animated.timing(progress, { toValue: 0, duration: D.drain, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progress]);

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      amount.current = value;
    });
    return () => progress.removeListener(id);
  }, [progress]);

  const advance = useCallback(() => {
    if (act === ACT.BLOOM || act === ACT.LOGO) {
      goto(ACT.CAROUSEL);
      return;
    }
    if (act === ACT.CAROUSEL) {
      goto(ACT.OPEN);
      return;
    }
    if (act === ACT.COCKPIT) {
      if (pageRef.current >= LAST) goto(ACT.START);
      else setPage((current) => Math.min(current + 1, LAST));
    }
  }, [act, goto]);

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const mounted = {
    light: act <= ACT.OPEN,
    dark: act >= ACT.OPEN,
    hero: act >= ACT.CAROUSEL && act <= ACT.OPEN,
  };
  const current = PAGES[Math.min(page, LAST)];
  const previous = page > 0 ? PAGES[page - 1] : null;
  const copying = act === ACT.START || act === ACT.LAUNCH;
  const lightOpacity = lightOut.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const copyBlock = useMemo(
    () => (
      <Animated.View
        style={[styles.copy, { top: Math.max(H * 0.102, 96), opacity: copyIn, transform: [{ translateY: copyIn.interpolate({ inputRange: [0, 1], outputRange: [u(10), 0] }) }] }]}
        accessibilityLiveRegion="polite">
        <Text style={styles.copyTitle} numberOfLines={2}>
          {copying ? 'Start your engine' : current.title}
        </Text>
        <Text style={styles.copyLine}>{copying ? HERO_LINE : current.line}</Text>
      </Animated.View>
    ),
    [copyIn, copying, current],
  );

  return (
    <TouchableWithoutFeedback onPress={advance} disabled={act >= ACT.START}>
      <View style={styles.root}>
        <StatusBar barStyle={act >= ACT.OPEN ? 'light-content' : 'dark-content'} animated />

        {mounted.light && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: lightOpacity }]}>
            {act <= ACT.LOGO ? (
              <BloomBackdrop core={bloom} />
            ) : (
              <View style={styles.whiteField}>
                <LinearGradient
                  colors={['rgba(157,185,255,0.95)', 'rgba(195,213,255,0.55)', 'rgba(255,255,255,0)']}
                  locations={[0, 0.45, 1]}
                  style={styles.lightWash}
                />
              </View>
            )}

            {act <= ACT.LOGO && (
              <View style={styles.logoWrap}>
                <Animated.View style={{ opacity: logoIn, transform: [{ scale: logoIn.interpolate({ inputRange: [0, 1], outputRange: [1.14, 1] }) }], alignItems: 'center' }}>
                  <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityIgnoresInvertColors />
                  <View style={styles.taglineWrap}>
                    <Tagline opacity={taglineIn} />
                  </View>
                </Animated.View>
              </View>
            )}

            {act >= ACT.CAROUSEL && (
              <View style={StyleSheet.absoluteFill}>
                <View style={styles.carouselClip}>
                  {ROWS.map((row, index) => (
                    <CarouselRow key={`row-${index}`} row={row} enter={sceneIn} slow={slow} />
                  ))}
                </View>
                <LinearGradient
                  colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.82)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
                  locations={[0, 0.186, 0.31, 1]}
                  style={styles.fadeToWhite}
                />
                <Animated.View
                  style={[styles.carouselCopy, { opacity: sceneIn, transform: [{ translateY: sceneIn.interpolate({ inputRange: [0, 1], outputRange: [u(22), 0] }) }] }]}>
                  <Text style={styles.heroTitle}>{HERO_TITLE}</Text>
                  <Text style={styles.heroBody}>{HERO_LINE}</Text>
                </Animated.View>
              </View>
            )}
          </Animated.View>
        )}

        {mounted.dark && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: sceneInDark }]}>
            <View style={styles.photoClip}>
              {previous && act === ACT.COCKPIT && (
                <Image source={previous.photo} style={photoBox(previous.y)} resizeMode="stretch" accessibilityIgnoresInvertColors />
              )}
              <Animated.View
                style={[StyleSheet.absoluteFill, { opacity: photoIn, transform: [{ scale: photoIn.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] }) }] }]}>
                <Image source={current.photo} style={photoBox(current.y)} resizeMode="stretch" accessibilityIgnoresInvertColors />
              </Animated.View>
            </View>

            <LinearGradient colors={SHADE_TOP} locations={[0, 0.55, 1]} style={styles.topShade} pointerEvents="none" />

            <Image source={COCKPIT} style={styles.cockpit} resizeMode="stretch" accessibilityIgnoresInvertColors />

            {act >= ACT.START && (
              <Animated.View style={[styles.bottomShade, { opacity: shadeIn }]} pointerEvents="none">
                <LinearGradient colors={SHADE_BOTTOM} locations={[0, 0.2, 0.45, 1]} style={StyleSheet.absoluteFill} />
              </Animated.View>
            )}

            {copyBlock}

            <View pointerEvents="box-none" style={[styles.cluster, { top: BTN_CY - BTN / 2 }]}>
              <StartButton
                breathing={breathing}
                spin={spinDeg}
                progress={progress}
                label={label}
                active={act === ACT.START && !launched.current}
                onHoldStart={onHoldStart}
                onHoldEnd={onHoldEnd}
              />
            </View>

            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: flash, backgroundColor: '#FFFFFF' }]} />

            <Animated.View pointerEvents="none" style={[styles.orbWrap, { top: BTN_CY - u(64), left: W / 2 - u(64) }]}>
              <Animated.View
                style={{
                  width: u(128),
                  height: u(128),
                  borderRadius: u(64),
                  opacity: orb,
                  transform: [{ scale: orb.interpolate({ inputRange: [0, 1], outputRange: [0.5, (Math.max(W, H) / u(128)) * 2.6] }) }],
                }}>
                <Svg width={u(128)} height={u(128)}>
                  <Defs>
                    {gradient('orbg', '50%', '50%', '50%', [
                      { offset: '0', color: '#FFFFFF', opacity: 1 },
                      { offset: '0.55', color: '#DCE7FF', opacity: 0.96 },
                      { offset: '1', color: '#7D9AF2', opacity: 0.9 },
                    ])}
                  </Defs>
                  <Circle cx={u(64)} cy={u(64)} r={u(64)} fill="url(#orbg)" />
                </Svg>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        )}

        {mounted.hero && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <HeroCard enter={heroIn} open={open} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NIGHT },
  blueField: { flex: 1, backgroundColor: '#7D9AF2' },
  whiteField: { flex: 1, backgroundColor: '#FFFFFF' },
  lightWash: { position: 'absolute', left: 0, right: 0, top: 0, height: u(300) },
  fadeToWhite: { position: 'absolute', left: 0, right: 0, top: u(428), height: u(568) },
  logoWrap: { position: 'absolute', left: 0, right: 0, top: u(276), alignItems: 'center' },
  logo: { width: u(166), height: u(169) },
  taglineWrap: { marginTop: u(16) },
  carouselClip: { position: 'absolute', left: 0, right: 0, top: 0, height: u(700), overflow: 'hidden' },
  rowBand: { position: 'absolute', left: -u(300), right: -u(300), height: u(180) },
  rowStrip: { position: 'absolute', top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center' },
  card: { borderRadius: u(20), marginRight: GAP, backgroundColor: '#E4E9F5' },
  heroCard: {
    position: 'absolute',
    backgroundColor: NIGHT,
    overflow: 'hidden',
    shadowColor: '#0A1130',
    shadowOpacity: 0.26,
    shadowRadius: u(26),
    shadowOffset: { width: 0, height: u(14) },
    elevation: 16,
  },
  carouselCopy: { position: 'absolute', left: u(28), right: u(28), top: u(655) },
  heroTitle: { color: '#1C1C1E', fontSize: u(27), fontWeight: '700', lineHeight: u(33) },
  heroBody: { marginTop: u(13), color: 'rgba(60,60,67,1)', fontSize: u(16.5), lineHeight: u(23) },
  photoClip: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: NIGHT, overflow: 'hidden' },
  topShade: { position: 'absolute', left: 0, right: 0, top: 0, height: u(300) },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: u(468) },
  cockpit: { position: 'absolute', left: 0, width: W, height: W * (996 / 440), bottom: 0 },
  copy: { position: 'absolute', left: u(28), right: u(28) },
  copyTitle: { color: '#FFFFFF', fontSize: u(31), fontWeight: '700', lineHeight: u(37) },
  copyLine: { marginTop: u(14), color: 'rgba(255,255,255,0.92)', fontSize: u(20), lineHeight: u(28) },
  cluster: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  buttonCluster: { alignItems: 'center', justifyContent: 'center' },
  ringLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringGlow: {
    shadowColor: '#58A6FF',
    shadowOpacity: 0.85,
    shadowRadius: u(10),
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  glass: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#0C0F1A',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: u(18),
    shadowOffset: { width: 0, height: u(10) },
    elevation: 14,
  },
  highlight: { position: 'absolute', top: u(11), left: u(29) },
  glassInner: { alignItems: 'center', justifyContent: 'center' },
  startLabel: { marginTop: u(7), color: '#FFFFFF', fontWeight: '600', includeFontPadding: false },
  hint: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  hit: { position: 'absolute', backgroundColor: 'transparent' },
  hintText: { color: 'rgba(255,255,255,0.92)', fontWeight: '500', fontSize: u(14), textAlign: 'center' },
  orbWrap: { position: 'absolute' },
});

export default OnboardingScreen;
